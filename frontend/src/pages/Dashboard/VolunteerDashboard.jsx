import { Link } from "react-router-dom";

const VolunteerDashboard = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📊 Volunteer Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <Link
          to="/dashboard/events"
          className="bg-green-100 p-4 rounded shadow hover:bg-green-200"
        >
          🗓 My Events
        </Link>
        <Link
          to="/dashboard/badges"
          className="bg-yellow-100 p-4 rounded shadow hover:bg-yellow-200"
        >
          🏅 My Badges
        </Link>
        <Link
          to="/dashboard/quizzes"
          className="bg-blue-100 p-4 rounded shadow hover:bg-blue-200"
        >
          📚 Quiz Scores
        </Link>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
