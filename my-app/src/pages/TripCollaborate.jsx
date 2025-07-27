import { useState, useEffect } from "react";

export default function TripCollaborate({ tripId, currentUser }) {
  const [members, setMembers] = useState([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [tasks, setTasks] = useState([]);
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskAssignee, setNewTaskAssignee] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [newSuggestion, setNewSuggestion] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState("");

  // Fetch members, tasks, suggestions on mount or tripId change
  useEffect(() => {
    if (!tripId) return;

    fetch(`/trips/${tripId}/members`)
      .then(res => res.json())
      .then(setMembers)
      .catch(() => setError("Failed to load members"));

    fetch(`/trips/${tripId}/tasks`)
      .then(res => res.json())
      .then(setTasks)
      .catch(() => setError("Failed to load tasks"));

    fetch(`/trips/${tripId}/suggestions`)
      .then(res => res.json())
      .then(setSuggestions)
      .catch(() => setError("Failed to load location suggestions"));
  }, [tripId]);

  // Invite friend
  const inviteFriend = () => {
    if (!inviteEmail) return alert("Please enter an email to invite.");
    fetch(`/trips/${tripId}/invite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: inviteEmail }),
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) alert(data.error);
        else {
          alert(data.message);
          setInviteEmail("");
          fetch(`/trips/${tripId}/members`).then(res => res.json()).then(setMembers);
        }
      });
  };

  // Add task
  const addTask = () => {
    if (!newTaskDesc) return alert("Task description is required.");
    fetch(`/trips/${tripId}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: newTaskDesc,
        assigned_to_id: newTaskAssignee ? parseInt(newTaskAssignee) : null,
      }),
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) alert(data.error);
        else {
          setNewTaskDesc("");
          setNewTaskAssignee("");
          fetch(`/trips/${tripId}/tasks`).then(res => res.json()).then(setTasks);
        }
      });
  };

  // Suggest location
  const suggestLocation = () => {
    if (!newSuggestion) return alert("Suggestion name is required.");
    fetch(`/trips/${tripId}/suggestions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newSuggestion }),
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) alert(data.error);
        else {
          setNewSuggestion("");
          fetch(`/trips/${tripId}/suggestions`).then(res => res.json()).then(setSuggestions);
        }
      });
  };

  // Vote on a suggestion
  const voteSuggestion = (suggestionId) => {
    fetch(`/suggestions/${suggestionId}/vote`, {
      method: "POST",
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) alert(data.error);
        else {
          fetch(`/trips/${tripId}/suggestions`).then(res => res.json()).then(setSuggestions);
        }
      });
  };

  // Search locations (mock or backend)
  const searchLocations = () => {
    if (!searchQuery) return;
    fetch(`/trips/${tripId}/search_locations?q=${encodeURIComponent(searchQuery)}`)
      .then(res => res.json())
      .then(data => setSearchResults(data.results || []))
      .catch(() => setError("Failed to search locations"));
  };

  return (
    <div style={{ border: "1px solid #ddd", padding: "1rem", marginTop: "2rem" }}>
      <h3>Invite Friends</h3>
      <input
        type="email"
        placeholder="Friend's email"
        value={inviteEmail}
        onChange={(e) => setInviteEmail(e.target.value)}
      />
      <button onClick={inviteFriend}>Invite</button>

      <h4>Members</h4>
      <ul>
        {members.map((m) => (
          <li key={m.id}>{m.username} ({m.email})</li>
        ))}
      </ul>

      <h3>Tasks</h3>
      <input
        type="text"
        placeholder="Task description"
        value={newTaskDesc}
        onChange={(e) => setNewTaskDesc(e.target.value)}
      />
      <select
        value={newTaskAssignee}
        onChange={(e) => setNewTaskAssignee(e.target.value)}
      >
        <option value="">Assign to (optional)</option>
        {members.map((m) => (
          <option key={m.id} value={m.id}>{m.username}</option>
        ))}
      </select>
      <button onClick={addTask}>Add Task</button>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.description} 
            {task.assigned_to ? ` — assigned to ${task.assigned_to.username}` : ""}
            {' '}[Status: {task.status}]
          </li>
        ))}
      </ul>

      <h3>Suggest Locations</h3>
      <input
        type="text"
        placeholder="Location name"
        value={newSuggestion}
        onChange={(e) => setNewSuggestion(e.target.value)}
      />
      <button onClick={suggestLocation}>Suggest</button>

      <h4>Suggestions & Votes</h4>
      <ul>
        {suggestions.map((s) => (
          <li key={s.id}>
            {s.name} — Votes: {s.votes_count || 0}
            <button onClick={() => voteSuggestion(s.id)}>Vote</button>
          </li>
        ))}
      </ul>

      <h3>Search Locations (Mock)</h3>
      <input
        type="text"
        placeholder="Search Tripadvisor"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={searchLocations}>Search</button>

      <ul>
        {searchResults.map((result, i) => (
          <li key={i}>{result.name}</li>
        ))}
      </ul>

      {error && <p style={{color: "red"}}>{error}</p>}
    </div>
  );
}
