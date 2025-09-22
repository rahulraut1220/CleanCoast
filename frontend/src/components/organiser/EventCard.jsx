import React from "react";

const EventCard = ({ event }) => {
  return (
    <div className="bg-white shadow-md rounded p-4 mb-4">
      <h3 className="text-lg font-bold mb-1">{event.title}</h3>
      <p className="text-sm text-gray-600">{event.date}</p>
      <p className="text-sm">{event.description}</p>
      <p className="text-xs text-blue-600 mt-2">Status: {event.status}</p>
    </div>
  );
};

export default EventCard;
