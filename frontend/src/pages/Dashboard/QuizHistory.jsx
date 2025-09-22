import { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const QuizHistory = () => {
  const [scores, setScores] = useState([]);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const res = await axios.get(`/users/${user._id}/quiz-scores`);
        setScores(res.data || []);
      } catch {
        toast.error("Could not load quiz history");
      }
    };
    fetchScores();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-3">📚 Quiz Scores</h2>
      <ul className="list-disc pl-5 space-y-1">
        {scores.map((s, idx) => (
          <li key={idx}>
            Quiz ID: <span className="font-mono">{s.quizId}</span> | Score:{" "}
            {s.score}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuizHistory;
