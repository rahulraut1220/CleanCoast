import { useEffect, useState } from "react";
import axios from "axios";

const VolunteerStats = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [volunteers, setVolunteers] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("/events/my-events");
        console.log("Fetched events:", res.data);

        // Validate the response
        if (Array.isArray(res.data)) {
          setEvents(res.data);
        } else {
          console.error("Expected array, got:", res.data);
          setEvents([]);
        }
      } catch (err) {
        console.error("Error fetching events", err);
      }
    };

    fetchEvents();
  }, []);

  const fetchVolunteers = async (eventId) => {
    try {
      const { data } = await axios.get(`/events/${eventId}/volunteers`);
      setVolunteers(Array.isArray(data) ? data : []);
      setSelectedEvent(eventId);
    } catch (err) {
      console.error("Error fetching volunteers", err);
    }
  };

  const handleStatusChange = async (volunteerId, status) => {
    try {
      await axios.patch(`/events/${selectedEvent}/attendance`, {
        volunteerId,
        status,
      });

      setVolunteers((prev) =>
        prev.map((v) => (v._id === volunteerId ? { ...v, status } : v))
      );
    } catch (err) {
      alert("Failed to update attendance");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Events</h1>
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul className="mb-6">
          {events.map((event) => (
            <li key={event._id} className="mb-2">
              <button
                className="text-blue-600 underline"
                onClick={() => fetchVolunteers(event._id)}
              >
                {event.name}
              </button>
            </li>
          ))}
        </ul>
      )}

      {volunteers.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Volunteers</h2>
          <table className="min-w-full bg-white shadow-md rounded">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map((v) => (
                <tr key={v._id} className="border-t">
                  <td className="py-2 px-4">{v.name}</td>
                  <td className="py-2 px-4">{v.email}</td>
                  <td className="py-2 px-4">{v.status || "Not marked"}</td>
                  <td className="py-2 px-4">
                    <button
                      className="text-green-600 mr-2"
                      onClick={() => handleStatusChange(v._id, "present")}
                    >
                      Mark Present
                    </button>
                    <button
                      className="text-red-600"
                      onClick={() => handleStatusChange(v._id, "absent")}
                    >
                      Mark Absent
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VolunteerStats;
