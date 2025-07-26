import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

function Dashboard() {
  const { user, loading } = useContext(UserContext);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Please log in</p>;

  return (
    <div>
      <h1>Welcome to Trip2gether!</h1>
      <p>You're logged in as user #{user.id}</p>
    </div>
  );
}

export default Dashboard;
