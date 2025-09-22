import { Link } from "react-router-dom";

const EventCard = ({ event }) => {
  return (
    <div className="bg-white shadow p-4 rounded">
      <h3 className="text-xl font-semibold">{event.title}</h3>
      <p className="text-sm text-gray-600">
        {event.description?.slice(0, 100)}...
      </p>
      <p className="text-sm mt-2">
        📍 <strong>{event.location?.city}</strong> <br />
        📅 {new Date(event.date).toLocaleDateString()} | 🕒 {event.startTime}
      </p>
      <Link
        to={`/events/${event._id}`}
        className="mt-3 inline-block bg-green-700 text-white px-3 py-1 rounded"
      >
        View Details
      </Link>
    </div>
  );
};

export default EventCard;
