import { useEffect, useState } from "react";
import axios from "axios";

function SuggestionsPage({ user }) {
  const [suggestions, setSuggestions] = useState([]);
  const [newSuggestion, setNewSuggestion] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get("http://localhost:5001/suggestions", {
      withCredentials: true
    })
    .then(res => setSuggestions(res.data))
    .catch(err => {
      console.error("Fetch error:", err);
      setMessage("Failed to load suggestions.");
    });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    if (!user) {
      setMessage("You must be logged in to submit a suggestion.");
      return;
    }

    axios.post("http://localhost:5001/suggestions", {
      content: newSuggestion,
      user_id: user.id
    }, { withCredentials: true })
      .then(res => {
        setSuggestions(prev => [...prev, res.data]);
        setNewSuggestion('');
        setMessage("Suggestion submitted!");
      })
      .catch(err => {
        console.error("Submit error:", err);
        setMessage("Failed to submit suggestion.");
      });
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Community Suggestions</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          value={newSuggestion}
          onChange={(e) => setNewSuggestion(e.target.value)}
          placeholder="Suggest something..."
          required
          style={{ marginRight: "0.5rem", padding: "0.5rem", width: "300px" }}
        />
        <button type="submit">Submit</button>
      </form>

      {message && <p>{message}</p>}

      <ul>
        {suggestions.map((s) => (
          <li key={s.id}>
            {s.content} — <em>by {s.username}</em> ({s.votes} votes)
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SuggestionsPage;
