import { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const { user, isLoading } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyEvents = async () => {
      if (!user?._id) return;

      try {
        const res = await axios.get(`/users/${user._id}`);
        const userData = res.data;

        // Fetch full event data from event IDs
        if (userData.eventsParticipated.length > 0) {
          const eventDetails = await Promise.all(
            userData.eventsParticipated.map((id) =>
              axios.get(`/events/${id}`).then((r) => r.data)
            )
          );
          setEvents(eventDetails);
        } else {
          setEvents([]);
        }
      } catch {
        toast.error("Failed to fetch events");
      }
    };

    fetchMyEvents();
  }, [user?._id]);

  if (isLoading || !user) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-3">🗓 My Participated Events</h2>
      <div className="space-y-3">
        {events.length > 0 ? (
          events.map((e) => (
            <div
              key={e._id}
              onClick={() => navigate(`/events/${e._id}`)}
              className="border px-4 py-3 rounded bg-white shadow-sm cursor-pointer hover:bg-gray-100 transition"
            >
              <h3 className="text-lg font-semibold">{e.title}</h3>
              <p className="text-sm text-gray-600">
                📍 {e.location?.name}, {e.location?.city}
              </p>
              <p className="text-sm text-gray-600">
                🗓 {new Date(e.date).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No events registered yet.</p>
        )}
      </div>
    </div>
  );
};

export default MyEvents;
