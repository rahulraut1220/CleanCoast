import { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import { useNavigate, useLocation } from "react-router-dom";

const SetProfile = () => {
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState("volunteer");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [locationError, setLocationError] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const userIdFromState = location.state?.userId;

  useEffect(() => {
    // Determine userId
    if (userIdFromState) {
      setUserId(userIdFromState);
    } else {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed._id) {
            setUserId(parsed._id);
            setRole(parsed.role || "volunteer");
          }
        } catch (err) {
          console.error("Invalid user in localStorage");
        }
      }
    }

    // Fetch location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lng: longitude });
        setLocationLoading(false);
      },
      (error) => {
        let msg = "Location access failed";
        if (error.code === 1) msg = "Location access denied";
        if (error.code === 2) msg = "Location unavailable";
        if (error.code === 3) msg = "Location timeout";
        setLocationError(msg);
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, [userIdFromState]);

  const handleSave = async () => {
    if (!userId) {
      console.error("❌ User ID not found");
      return;
    }

    try {
      await axios.put(`/users/${userId}`, {
        role,
        location: {
          city,
          state,
          coordinates,
        },
      });
      console.log("✅ Profile updated!");
      navigate("/");
    } catch (err) {
      console.error("❌ Failed to update profile:", err);
    }
  };

  const handleRetryLocation = () => {
    setLocationError(null);
    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lng: longitude });
        setLocationLoading(false);
      },
      (error) => {
        let msg = "Location access failed";
        if (error.code === 1) msg = "Location access denied";
        if (error.code === 2) msg = "Location unavailable";
        if (error.code === 3) msg = "Location timeout";
        setLocationError(msg);
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 border rounded">
      <h2 className="text-2xl font-bold mb-4">🧭 Set Your Profile</h2>

      <label className="block mb-4">
        <span className="font-medium">Select Role:</span>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full mt-1 border p-2 rounded"
        >
          <option value="volunteer">Volunteer</option>
          <option value="organizer">Organizer</option>
        </select>
      </label>

      <label className="block mb-4">
        <span className="font-medium">City:</span>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full mt-1 border p-2 rounded"
          placeholder="Enter your city"
        />
      </label>

      <label className="block mb-4">
        <span className="font-medium">State:</span>
        <input
          type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="w-full mt-1 border p-2 rounded"
          placeholder="Enter your state"
        />
      </label>

      <div className="space-y-2 mb-4">
        <h3 className="font-medium">Location Coordinates:</h3>

        {locationLoading && (
          <p className="text-blue-600">📍 Getting location...</p>
        )}
        {locationError && (
          <div>
            <p className="text-red-600">❌ {locationError}</p>
            <button
              onClick={handleRetryLocation}
              className="text-blue-600 hover:underline text-sm"
            >
              Try Again
            </button>
          </div>
        )}
        {!locationLoading && !locationError && (
          <>
            <p>
              <strong>Latitude:</strong> {coordinates.lat || "—"}
            </p>
            <p>
              <strong>Longitude:</strong> {coordinates.lng || "—"}
            </p>
          </>
        )}
      </div>

      <button
        onClick={handleSave}
        disabled={locationLoading}
        className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {locationLoading ? "Getting Location..." : "Save and Continue"}
      </button>

      <p className="text-sm text-gray-600 mt-2">
        💡 Coordinates are auto-detected. Please allow location access.
      </p>
    </div>
  );
};

export default SetProfile;
