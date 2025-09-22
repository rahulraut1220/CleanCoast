import React, { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";

const MarkAttendance = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [volunteers, setVolunteers] = useState([]);

  const fetchEvents = async () => {
    try {
      const res = await axios.get("/events/my-events"); // Adjust API path if needed
      console.log(res.data.events); // ✅ Log the fetched events
      setEvents(res.data.events || []); // ✅ Adjusted to access `events` array inside response object
    } catch (error) {
      console.error("Error fetching events", error);
    }
  };

  const handleMarkAttendance = (event) => {
    setSelectedEvent(event);
    setVolunteers(event.volunteersRegisteredList || []);
  };

  const updateAttendance = async (volunteerId, status) => {
    try {
      await axios.patch(`/events/${selectedEvent._id}/attendance`, {
        volunteerId,
        status,
      });

      // Update local state after marking attendance
      const updatedVolunteers = volunteers.map((v) =>
        v.volunteer === volunteerId ? { ...v, status } : v
      );
      setVolunteers(updatedVolunteers);
    } catch (error) {
      console.error("Error updating attendance", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-green-700">
        Mark Attendance
      </h1>

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => (
          <div
            key={event._id}
            className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition duration-300"
          >
            <h2 className="text-xl font-semibold">{event.title}</h2>
            <p className="text-gray-600">{event.date?.split("T")[0]}</p>
            <p className="text-gray-600">
              {event.location?.name}, {event.location?.city}
            </p>
            <button
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={() => handleMarkAttendance(event)}
            >
              Mark Attendance
            </button>
          </div>
        ))}
      </div>

      {/* Volunteer List */}
      {selectedEvent && (
        <div className="mt-10 bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-semibold mb-4 text-green-700">
            Volunteers for {selectedEvent.title}
          </h2>

          {volunteers.length === 0 ? (
            <p className="text-gray-600">No volunteers registered yet.</p>
          ) : (
            <table className="w-full border border-collapse mt-4">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2 border">Volunteer ID</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {volunteers.map((vol) => (
                  <tr key={vol._id} className="text-center">
                    <td className="border p-2">{vol.volunteer}</td>
                    <td className="border p-2 capitalize">
                      {vol.status || "absent"}
                    </td>
                    <td className="border p-2">
                      <button
                        onClick={() =>
                          updateAttendance(vol.volunteer, "present")
                        }
                        className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600"
                      >
                        Present
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default MarkAttendance;
