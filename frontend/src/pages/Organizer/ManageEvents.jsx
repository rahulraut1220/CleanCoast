import { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import { Toaster, toast } from "react-hot-toast";

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editEvent, setEditEvent] = useState(null); // for modal
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: {
      name: "",
      city: "",
      meetingPoint: "",
    },
  });

  const fetchEvents = async () => {
    try {
      const { data } = await axios.get("/events/my-events");
      setEvents(data.events || []);
    } catch (err) {
      setError("Failed to fetch events.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await axios.delete(`/events/${id}`);
      setEvents((prev) => prev.filter((event) => event._id !== id));
      toast.success("Event deleted successfully!");
    } catch (err) {
      toast.error("Error deleting event");
    }
  };

  const handleEditClick = (event) => {
    setEditEvent(event._id);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date.slice(0, 10),
      location: {
        name: event.location?.name || "",
        city: event.location?.city || "",
        meetingPoint: event.location?.meetingPoint || "",
      },
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/events/${editEvent}`, formData);
      toast.success("Event updated successfully!");
      fetchEvents(); // refresh data
      setEditEvent(null); // close modal
    } catch (err) {
      toast.error("Failed to update event.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (["name", "city", "meetingPoint"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNotifyUsers = async (eventId) => {
    try {
      await axios.post(`/events/${eventId}/notify-nearby`);
      toast.success("Users notified successfully!");
    } catch (err) {
      toast.error("Failed to notify users.");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="text-red-500 p-4">{error}</p>;

  return (
    <div className="p-6 relative">
      <Toaster />
      <h2 className="text-2xl font-bold mb-4">Manage Your Events</h2>
      {events.length === 0 ? (
        <p>No events created yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
            >
              <h3 className="text-xl font-semibold">{event.title}</h3>
              <p className="text-sm text-gray-600">
                {new Date(event.date).toLocaleDateString()} •{" "}
                {event.location?.name || event.location?.city || "No location"}
              </p>

              <p className="mt-2 text-gray-700">{event.description}</p>

              <div className="mt-4 flex flex-wrap justify-between gap-2">
                <button
                  onClick={() => handleEditClick(event)}
                  className="px-4 py-2 text-sm bg-yellow-400 text-white rounded hover:bg-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(event._id)}
                  className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleNotifyUsers(event._id)}
                  className="px-4 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Notify Users
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {editEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative">
            <h2 className="text-xl font-bold mb-4">Edit Event</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Title"
                className="w-full border p-2 rounded"
                required
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Description"
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="text"
                name="name"
                value={formData.location.name}
                onChange={handleInputChange}
                placeholder="Location Name"
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                name="city"
                value={formData.location.city}
                onChange={handleInputChange}
                placeholder="City"
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                name="meetingPoint"
                value={formData.location.meetingPoint}
                onChange={handleInputChange}
                placeholder="Meeting Point"
                className="w-full border p-2 rounded"
              />

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setEditEvent(null)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEvents;
