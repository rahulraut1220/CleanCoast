import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axiosInstance";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const EventDetail = () => {
  const { id } = useParams(); // this is eventId
  const [event, setEvent] = useState(null);
  const { user } = useSelector((state) => state.user);

  const fetchEvent = async () => {
    try {
      const res = await axios.get(`/events/${id}`);
      setEvent(res.data);
    } catch {
      toast.error("Failed to fetch event");
    }
  };

  const handleRegister = async () => {
    try {
      const res = await axios.post(`/users/register/${id}`, null, {
        withCredentials: true,
      });
      toast.success("Registered successfully!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Registration failed");
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  if (!event) return <div className="p-4">Loading event...</div>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-2">{event.title}</h2>
      <p className="text-gray-700 mb-4">{event.description}</p>
      <p>
        📍{" "}
        <strong>
          {event.location?.name}, {event.location?.city}
        </strong>
        <br />
        🕒 {event.startTime} to {event.endTime} on{" "}
        {new Date(event.date).toLocaleDateString()}
      </p>

      {user ? (
        <button
          onClick={handleRegister}
          className="mt-4 bg-green-700 text-white px-4 py-2 rounded"
        >
          Register for Event
        </button>
      ) : (
        <p className="text-red-500 mt-4">Please login to register</p>
      )}
    </div>
  );
};

export default EventDetail;
