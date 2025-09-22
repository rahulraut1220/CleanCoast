import React from "react";

const EventCard = ({ event }) => {
  return (
    <div className="border rounded-md p-4 shadow-sm mb-4">
      <h3 className="text-lg font-bold">{event.title}</h3>
      <p className="text-sm text-gray-600">{event.date}</p>
      <p className="text-sm">{event.description}</p>
    </div>
  );
};

export default EventCard;
