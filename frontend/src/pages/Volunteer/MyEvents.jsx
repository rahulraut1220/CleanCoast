import { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import { useSelector } from "react-redux";

const MyEvents = () => {
  const { user } = useSelector((state) => state.user);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [participatedEvents, setParticipatedEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("registered");

  useEffect(() => {
    if (user?._id) {
      fetchEvents();
    }
  }, [user]);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`/events/user/${user._id}`, {
        withCredentials: true,
      });

      setRegisteredEvents(res.data.registered || []);
      setParticipatedEvents(res.data.participated || []);
    } catch (error) {
      console.error("Error fetching events", error);
    }
  };

  const renderEventCard = (event) => (
    <div
      key={event._id}
      className="p-4 border rounded shadow-sm bg-white hover:shadow-md transition"
    >
      <h3 className="text-xl font-semibold text-blue-600 mb-1">
        {event.title}
      </h3>
      <p className="text-gray-700">{event.description?.slice(0, 100)}...</p>
      <p className="text-sm text-gray-500 mt-1">
        📍 {event.location?.name}, {event.location?.city}
      </p>
      <p className="text-sm text-gray-500">
        📅 {new Date(event.date).toDateString()}
      </p>
      <p className="text-sm text-gray-500">
        🕐 {event.startTime} - {event.endTime}
      </p>
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📌 My Events</h1>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setActiveTab("registered")}
          className={`px-4 py-2 rounded ${
            activeTab === "registered"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Registered Events
        </button>
        <button
          onClick={() => setActiveTab("participated")}
          className={`px-4 py-2 rounded ${
            activeTab === "participated"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Participated Events
        </button>
      </div>

      {activeTab === "registered" && registeredEvents?.length === 0 && (
        <p className="text-gray-500">No registered events yet.</p>
      )}
      {activeTab === "participated" && participatedEvents?.length === 0 && (
        <p className="text-gray-500">No participated events yet.</p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeTab === "registered" &&
          registeredEvents.map((event) => renderEventCard(event))}
        {activeTab === "participated" &&
          participatedEvents.map((event) => renderEventCard(event))}
      </div>
    </div>
  );
};

export default MyEvents;
