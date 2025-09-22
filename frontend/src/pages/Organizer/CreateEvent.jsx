import { useState } from "react";
import axios from "../../api/axiosInstance";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const CreateEvent = () => {
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    location: {
      name: "",
      city: "",
      coordinates: {
        lat: "",
        lng: "",
      },
      meetingPoint: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");

    if (
      keys.length === 3 &&
      keys[0] === "location" &&
      keys[1] === "coordinates"
    ) {
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          coordinates: {
            ...prev.location.coordinates,
            [keys[2]]: value,
          },
        },
      }));
    } else if (keys.length === 2 && keys[0] === "location") {
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [keys[1]]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user._id) {
      toast.error("User not authenticated");
      return;
    }

    const payload = {
      ...formData,
      organizerId: user._id,
    };

    setLoading(true);
    try {
      await axios.post("/events/create", payload);
      toast.success("✅ Event created successfully!");
      setFormData({
        title: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        location: {
          name: "",
          city: "",
          coordinates: {
            lat: "",
            lng: "",
          },
          meetingPoint: "",
        },
      });
    } catch (err) {
      toast.error("❌ Failed to create event");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-3xl font-semibold mb-6">📅 Create New Event</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-medium">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
              required
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="font-medium">Start Time</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded"
                required
              />
            </div>
            <div className="flex-1">
              <label className="font-medium">End Time</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded"
                required
              />
            </div>
          </div>
        </div>

        <h3 className="text-xl mt-6 mb-2 font-semibold">📍 Location Info</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-medium">Location Name</label>
            <input
              type="text"
              name="location.name"
              value={formData.location.name}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="font-medium">City</label>
            <input
              type="text"
              name="location.city"
              value={formData.location.city}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="font-medium">Latitude</label>
            <input
              type="number"
              name="location.coordinates.lat"
              value={formData.location.coordinates.lat}
              onChange={handleChange}
              step="any"
              className="w-full mt-1 p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="font-medium">Longitude</label>
            <input
              type="number"
              name="location.coordinates.lng"
              value={formData.location.coordinates.lng}
              onChange={handleChange}
              step="any"
              className="w-full mt-1 p-2 border rounded"
              required
            />
          </div>
          <div className="col-span-2">
            <label className="font-medium">Meeting Point</label>
            <input
              type="text"
              name="location.meetingPoint"
              value={formData.location.meetingPoint}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-6 py-2 mt-4 rounded hover:bg-green-700"
        >
          {loading ? "Creating..." : "✅ Create Event"}
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;
