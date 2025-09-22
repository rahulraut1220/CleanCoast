import { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const Badges = () => {
  const [badges, setBadges] = useState([]);
  const { user, isLoading } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchBadges = async () => {
      if (!user?._id) return; // ✅ Wait until user is available

      try {
        const res = await axios.get(`/users/${user._id}/badges`);
        setBadges(res.data);
      } catch {
        toast.error("Failed to fetch badges");
      }
    };

    fetchBadges();
  }, [user?._id]); // ✅ run this effect only after user is loaded

  if (isLoading || !user) return <div className="p-6">Loading badges...</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-3">🏅 My Badges</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {badges.length > 0 ? (
          badges.map((b) => (
            <div
              key={b.name}
              className="bg-yellow-100 p-3 rounded text-center shadow"
            >
              <h3 className="font-semibold">{b.name}</h3>
              <p className="text-xs text-gray-600">
                🏆 Earned on {new Date(b.awardedAt).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full">No badges earned yet.</p>
        )}
      </div>
    </div>
  );
};

export default Badges;
