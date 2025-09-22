import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../features/userSlice";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import toast from "react-hot-toast";
import { FaUserCircle } from "react-icons/fa";
import { useState, useEffect } from "react";

const Navbar = () => {
  const { user, isLoading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  // Debug: Check what's in user
  useEffect(() => {
    console.log("🧑 Logged-in User:", user);
  }, [user]);

  const handleLogout = async () => {
    try {
      await axios.get("/auth/logout");
      dispatch(logoutUser());
      localStorage.removeItem("user");
      toast.success("Logged out successfully");
      navigate("/");
    } catch (err) {
      toast.error("Logout failed");
      console.error("❌ Logout Error:", err);
    }
  };

  if (isLoading) return null;

  return (
    <nav className="bg-green-700 text-white px-4 py-3 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">
        🌊 Beach Warriors
      </Link>

      {user && user.name ? (
        <div className="relative flex items-center gap-2">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <FaUserCircle className="text-2xl" />
            <span className="font-medium">{user?.name || "No Name"}</span>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 bg-white text-black rounded shadow px-4 py-2 z-10">
              <button
                onClick={handleLogout}
                className="hover:text-red-600 font-medium"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="bg-white text-green-700 px-3 py-1 rounded"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-white text-green-700 px-3 py-1 rounded"
          >
            Register
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
