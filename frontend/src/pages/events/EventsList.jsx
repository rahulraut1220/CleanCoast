import { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import EventCard from "../../components/events/EventCard";
import toast from "react-hot-toast";

const EventsList = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("/events");
        setEvents(res.data);
      } catch (err) {
        toast.error("Failed to fetch events");
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default EventsList;
