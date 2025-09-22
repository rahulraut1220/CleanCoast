import React from "react";

const VolunteerTable = ({ volunteers }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Events Attended</th>
            <th className="px-4 py-2 border">Waste Collected (Kg)</th>
          </tr>
        </thead>
        <tbody>
          {volunteers.map((v) => (
            <tr key={v._id} className="text-sm">
              <td className="px-4 py-2 border">{v.name}</td>
              <td className="px-4 py-2 border">{v.email}</td>
              <td className="px-4 py-2 border">{v.totalEventsAttended}</td>
              <td className="px-4 py-2 border">{v.totalWasteCollectedKg}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VolunteerTable;
