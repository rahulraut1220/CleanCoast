import React from "react";

const BadgeCard = ({ badge }) => {
  return (
    <div className="bg-green-100 border border-green-300 rounded p-4">
      <h4 className="font-semibold text-green-800">{badge.name}</h4>
      <p className="text-sm text-gray-600">
        Awarded: {new Date(badge.awardedAt).toLocaleDateString()}
      </p>
    </div>
  );
};

export default BadgeCard;
