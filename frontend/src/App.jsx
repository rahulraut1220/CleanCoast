import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Toaster } from "react-hot-toast";
import axios from "./api/axiosInstance";
import { setUser, logoutUser, setLoading } from "./features/userSlice";

// Layouts & Pages
// Detailed frontend Page with Routes
import Navbar from "./layouts/Navbar";
import Home from "./pages/home/Home";
import EventsList from "./pages/events/EventsList";
import EventDetail from "./pages/events/EventDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SetProfile from "./pages/SetProfile";
import VolunteerLayout from "./layouts/VolunteerLayout";
import OrganizerLayout from "./layouts/OrganizerLayout";
import Dashboard from "./pages/Volunteer/Dashboard";
import MyEvents from "./pages/Volunteer/MyEvents";
import Badges from "./pages/Volunteer/Badges";
import QuizHistory from "./pages/Volunteer/QuizHistory";
import StartQuiz from "./pages/Volunteer/StartQuiz";
import Profile from "./pages/Volunteer/Profile";
import GenerateCertificate from "./pages/Volunteer/GenerateCertificate";
import CreateEvent from "./pages/Organizer/CreateEvent";
import ManageEvents from "./pages/Organizer/ManageEvents";
import EventDetails from "./pages/Organizer/EventDetails";
import MarkAttendance from "./pages/Organizer/MarkAttendance";
import SubmitWasteData from "./pages/Organizer/SubmitWasteData";
import NotifyVolunteers from "./pages/Organizer/NotifyVolunteers";
import ViewReports from "./pages/Organizer/ViewReports";
import VolunteerStats from "./pages/Organizer/VolunteerStats";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      dispatch(setLoading());

      const storedUser = localStorage.getItem("user");

      if (storedUser && storedUser !== "undefined") {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser?._id) {
            dispatch(setUser(parsedUser));
            return;
          }
        } catch {
          localStorage.removeItem("user");
        }
      }

      try {
        const res = await axios.get("/auth/me");
        if (res.data?.user) {
          dispatch(setUser(res.data.user));
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
      } catch {
        dispatch(logoutUser());
      }
    };

    fetchUser();
  }, [dispatch]);

  return (
    <>
      <Toaster position="top-center" />
      <Navbar />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<EventsList />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/set-profile" element={<SetProfile />} />

        {/* Volunteer */}
        <Route path="/volunteer-dashboard" element={<VolunteerLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="my-events" element={<MyEvents />} />
          <Route path="badges" element={<Badges />} />
          <Route path="quizzes" element={<QuizHistory />} />
          <Route path="start-quiz" element={<StartQuiz />} />
          <Route path="profile" element={<Profile />} />
          <Route
            path="generate-certificates"
            element={<GenerateCertificate />}
          />
        </Route>

        {/* Organizer */}
        <Route path="/organizer-dashboard" element={<OrganizerLayout />}>
          <Route path="create-event" element={<CreateEvent />} />
          <Route path="manage-events" element={<ManageEvents />} />
          <Route path="event-details" element={<EventDetails />} />
          <Route path="mark-attendance" element={<MarkAttendance />} />
          <Route path="submit-waste" element={<SubmitWasteData />} />
          <Route path="notify-volunteers" element={<NotifyVolunteers />} />
          <Route path="view-reports" element={<ViewReports />} />
          <Route path="volunteer-stats" element={<VolunteerStats />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
