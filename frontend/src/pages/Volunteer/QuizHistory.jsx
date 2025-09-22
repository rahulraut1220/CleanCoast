import { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import toast from "react-hot-toast";
import { format } from "date-fns";

const QuizHistory = () => {
  const [quizScores, setQuizScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    const fetchQuizHistory = async () => {
      try {
        const res = await axios.get("/quiz/history", {
          withCredentials: true,
        });
        setQuizScores(res.data || []);
      } catch (err) {
        toast.error("Failed to load quiz history");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizHistory();
  }, []);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-6">📚 Quiz History</h2>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : quizScores.length === 0 ? (
        <p className="text-gray-600">You haven't taken any quizzes yet.</p>
      ) : (
        <div className="space-y-4">
          {quizScores.map((quiz, idx) => (
            <div key={idx} className="border rounded-md shadow-sm p-4 bg-white">
              <div className="flex flex-col md:flex-row justify-between md:items-center mb-2">
                <div className="space-y-1">
                  <p className="font-medium text-lg">
                    📊 Score: {quiz.score} / {quiz.total}
                  </p>
                  <p className="text-sm text-gray-600">
                    🗓️ {format(new Date(quiz.date), "dd MMM yyyy")}
                  </p>
                </div>
                <button
                  onClick={() => toggleExpand(idx)}
                  className="mt-2 md:mt-0 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {expandedIndex === idx
                    ? "Hide Questions"
                    : "🔽 View All Questions"}
                </button>
              </div>

              {expandedIndex === idx && (
                <div className="mt-4 space-y-4">
                  {quiz.questions?.map((q, qIdx) => (
                    <div
                      key={qIdx}
                      className={`border-l-4 p-3 ${
                        q.isCorrect
                          ? "border-green-500 bg-green-50"
                          : "border-red-500 bg-red-50"
                      }`}
                    >
                      <p className="font-medium">
                        Q{qIdx + 1}. {q.question}
                      </p>
                      <p>
                        <strong>Your Answer:</strong>{" "}
                        <span className="text-gray-800">
                          {q.selectedAnswer}
                        </span>
                      </p>
                      {!q.isCorrect && (
                        <p>
                          <strong>Correct Answer:</strong>{" "}
                          <span className="text-green-600">
                            {q.correctAnswer}
                          </span>
                        </p>
                      )}
                      <p
                        className={`text-sm font-semibold ${
                          q.isCorrect ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {q.isCorrect ? "✅ Correct" : "❌ Incorrect"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizHistory;
