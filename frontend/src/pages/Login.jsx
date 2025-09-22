import { useState } from "react";
import axios from "../api/axiosInstance";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../features/userSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/login", { email, password });

      dispatch(setUser(res.data.user));
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login successful!");
      navigate("/set-profile");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  const handleGoogleLogin = () => {
    window.open("http://localhost:3000/auth/google", "_self");
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 border rounded">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full border py-2 rounded hover:bg-gray-100"
        >
          Login with Google
        </button>
      </form>
    </div>
  );
};

export default Login;
