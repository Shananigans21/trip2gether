## Trip2gether
A full-stack web app for organizing group trips.

## Project Overview
Trip2gether allows users to create and manage group trips, track trip members, and interact with trip data through a RESTful Flask API backend and a React frontend.

## Features
User authentication and session management

Create, read, update, and delete trips

View trip details and members

Responsive frontend interface

Database migrations with Flask-Migrate and SQLite

## Technologies Used
Backend: Python, Flask, SQLAlchemy, Flask-Migrate, SQLite

Frontend: React (or your frontend framework), fetch API

Others: Alembic for database migrations, Flask-CORS for handling cross-origin requests

## Getting Started
Prerequisites
Python 3.10+

Node.js and npm/yarn (for frontend)

Virtual environment tool (optional but recommended)

## Backend Setup
Clone the repo and navigate to backend folder (e.g., /trip2gether):

bash
Copy code
git clone https://github.com/yourusername/trip2gether.git
cd trip2gether
Create and activate a virtual environment:

bash
Copy code
python3 -m venv venv
source venv/bin/activate  # Linux/macOS
# or
venv\Scripts\activate  # Windows
Install Python dependencies:

bash
Copy code
pip install -r requirements.txt
Set environment variables and initialize the database:

bash
Copy code
export FLASK_APP=server/app.py
export FLASK_ENV=development

flask db init
flask db migrate -m "Initial migration"
flask db upgrade
Run the Flask backend server:

bash
Copy code
flask run --port=5001
Frontend Setup
Navigate to your frontend directory (e.g., /my-app):

bash
Copy code
cd my-app
Install frontend dependencies:

bash
Copy code
npm install
# or
yarn install
Start the development server:

bash
Copy code
npm run dev
# or
yarn dev
Make sure API calls in the frontend point to your backend, e.g., http://localhost:5001/trips

## Usage
Open your browser and visit the frontend development server URL (usually http://localhost:5173 or http://localhost:3000)

Use the UI to create trips and manage trip members

Backend logs and responses will appear in your terminal running the Flask app

Troubleshooting
If migrations or upgrades fail, try deleting the migrations/ folder and your SQLite database file and then re-run migrations.

Ensure the backend server is running before using the frontend.

Confirm that frontend API endpoints are correctly configured.

