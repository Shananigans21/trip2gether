from flask import Flask, request, jsonify, session, make_response
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from functools import wraps
from sqlalchemy.exc import IntegrityError

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
app.config['SECRET_KEY'] = 'super-secret-key'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app, origins=["http://localhost:5173"], supports_credentials=True)
bcrypt = Bcrypt(app)
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# ========================== MODELS ==========================

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    trips = db.relationship('Trip', backref='user', lazy=True)

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {"id": self.id, "email": self.email, "username": self.username}


class Trip(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    destination = db.Column(db.String(100), nullable=False)
    date = db.Column(db.String(50))
    description = db.Column(db.Text)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    hotels = db.relationship("Hotel", backref="trip", cascade="all, delete-orphan")
    activities = db.relationship("Activity", backref="trip", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "destination": self.destination,
            "date": self.date,
            "description": self.description,
            "hotels": [{"id": h.id, "name": h.name, "location": h.location} for h in self.hotels],
            "activities": [{"id": a.id, "name": a.name, "time": a.time} for a in self.activities]
        }


class Hotel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    location = db.Column(db.String(120))
    trip_id = db.Column(db.Integer, db.ForeignKey('trip.id'), nullable=False)


class Activity(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    time = db.Column(db.String(50))
    trip_id = db.Column(db.Integer, db.ForeignKey('trip.id'), nullable=False)

# ========================== AUTH HELPERS ==========================

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({"error": "Authentication required"}), 401
        return f(*args, **kwargs)
    return decorated_function

# ========================== ROUTES ==========================

@app.route('/')
def index():
    return jsonify({ "message": "Trip2gether API is running" })

# -------- SIGNUP --------
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')

    if not email or not username or not password:
        return jsonify({"error": "Email, username, and password are required."}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered."}), 409

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already taken."}), 409

    hashed_pw = bcrypt.generate_password_hash(password).decode('utf-8')
    user = User(email=email, username=username, password_hash=hashed_pw)

    db.session.add(user)
    db.session.commit()

    session['user_id'] = user.id
    return jsonify({"message": "Signup successful", "user": user.to_dict()}), 201

# -------- LOGIN --------
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data.get('email')).first()

    if user and user.check_password(data.get('password')):
        session['user_id'] = user.id
        return jsonify({"message": "Login successful", "user": user.to_dict()})
    return jsonify({"error": "Invalid email or password"}), 401

@app.route('/check_session')
def check_session():
    if 'user_id' in session:
        user = User.query.get(session['user_id'])
        if user:
            return jsonify(user.to_dict())
        else:
            session.pop('user_id')
    return jsonify({"error": "Not logged in"}), 401

@app.route('/logout', methods=['DELETE'])
def logout():
    session.pop('user_id', None)
    response = make_response(jsonify({"message": "Logged out"}))
    response.set_cookie('session', '', expires=0)
    return response

# -------- TRIPS --------
@app.route('/trips', methods=['POST'])
@login_required
def create_trip():
    data = request.json
    trip = Trip(
        destination=data['destination'],
        date=data.get('date'),
        description=data.get('description'),
        user_id=session['user_id']
    )
    db.session.add(trip)
    db.session.commit()
    return jsonify({
        "message": "Trip created",
        "trip": {
            "id": trip.id,
            "destination": trip.destination
        }
    }), 201

@app.route('/trips', methods=['GET'])
@login_required
def get_trips():
    user_id = session['user_id']
    trips = Trip.query.filter_by(user_id=user_id).all()
    return jsonify([trip.to_dict() for trip in trips])

@app.route('/trips/<int:trip_id>', methods=['PATCH'])
@login_required
def update_trip(trip_id):
    trip = Trip.query.get_or_404(trip_id)
    if trip.user_id != session['user_id']:
        return jsonify({"error": "Not authorized"}), 403

    data = request.json
    if 'destination' in data:
        trip.destination = data['destination']
    if 'date' in data:
        trip.date = data['date']
    if 'description' in data:
        trip.description = data['description']
    db.session.commit()
    return jsonify(trip.to_dict())

@app.route('/trips/<int:trip_id>', methods=['DELETE'])
@login_required
def delete_trip(trip_id):
    trip = Trip.query.get_or_404(trip_id)
    if trip.user_id != session['user_id']:
        return jsonify({"error": "Not authorized"}), 403

    db.session.delete(trip)
    db.session.commit()
    return jsonify({"message": "Trip deleted"})

# -------- HOTELS --------
@app.route('/trips/<int:trip_id>/hotels', methods=['POST'])
@login_required
def add_hotel(trip_id):
    trip = Trip.query.get_or_404(trip_id)
    if trip.user_id != session['user_id']:
        return jsonify({"error": "Not authorized"}), 403

    data = request.json
    if not data.get('name'):
        return jsonify({"error": "Hotel name is required"}), 400

    hotel = Hotel(
        name=data['name'],
        location=data.get('location'),
        trip=trip
    )
    db.session.add(hotel)
    db.session.commit()
    return jsonify({"message": "Hotel added", "hotel": {"id": hotel.id, "name": hotel.name}}), 201

@app.route('/hotels/<int:hotel_id>', methods=['PATCH'])
@login_required
def update_hotel(hotel_id):
    hotel = Hotel.query.get_or_404(hotel_id)
    if hotel.trip.user_id != session['user_id']:
        return jsonify({"error": "Not authorized"}), 403

    data = request.json
    if 'name' in data:
        hotel.name = data['name']
    if 'location' in data:
        hotel.location = data['location']
    db.session.commit()
    return jsonify({"id": hotel.id, "name": hotel.name, "location": hotel.location})

@app.route('/hotels/<int:hotel_id>', methods=['DELETE'])
@login_required
def delete_hotel(hotel_id):
    hotel = Hotel.query.get_or_404(hotel_id)
    if hotel.trip.user_id != session['user_id']:
        return jsonify({"error": "Not authorized"}), 403

    db.session.delete(hotel)
    db.session.commit()
    return jsonify({"message": "Hotel deleted"})

# -------- ACTIVITIES --------
@app.route('/trips/<int:trip_id>/activities', methods=['POST'])
@login_required
def add_activity(trip_id):
    trip = Trip.query.get_or_404(trip_id)
    if trip.user_id != session['user_id']:
        return jsonify({"error": "Not authorized"}), 403

    data = request.json
    if not data.get('name'):
        return jsonify({"error": "Activity name is required"}), 400

    activity = Activity(
        name=data['name'],
        time=data.get('time'),
        trip=trip
    )
    db.session.add(activity)
    db.session.commit()
    return jsonify({"message": "Activity added", "activity": {"id": activity.id, "name": activity.name}}), 201

@app.route('/activities/<int:activity_id>', methods=['PATCH'])
@login_required
def update_activity(activity_id):
    activity = Activity.query.get_or_404(activity_id)
    if activity.trip.user_id != session['user_id']:
        return jsonify({"error": "Not authorized"}), 403

    data = request.json
    if 'name' in data:
        activity.name = data['name']
    if 'time' in data:
        activity.time = data['time']
    db.session.commit()
    return jsonify({"id": activity.id, "name": activity.name, "time": activity.time})

@app.route('/activities/<int:activity_id>', methods=['DELETE'])
@login_required
def delete_activity(activity_id):
    activity = Activity.query.get_or_404(activity_id)
    if activity.trip.user_id != session['user_id']:
        return jsonify({"error": "Not authorized"}), 403

    db.session.delete(activity)
    db.session.commit()
    return jsonify({"message": "Activity deleted"})

# RUN SERVER
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5001)
