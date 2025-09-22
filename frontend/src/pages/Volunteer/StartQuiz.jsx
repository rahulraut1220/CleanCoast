import { useState } from "react";
import axios from "../../api/axiosInstance";
import toast from "react-hot-toast";

const StartQuiz = () => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [questionCount, setQuestionCount] = useState(5);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [totalAsked, setTotalAsked] = useState(0);
  const [quizHistory, setQuizHistory] = useState([]);
  const [quizEnded, setQuizEnded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setQuizStarted(true);
    await fetchNextQuestion();
  };

  const fetchNextQuestion = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/quiz/next");
      setCurrentQuestion(res.data.question);
      setSelectedAnswer(null);
      setAnswered(false);
      setIsCorrect(null);
    } catch (err) {
      toast.error("Error fetching question");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async () => {
    if (!selectedAnswer) return toast.error("Please select an answer");

    try {
      const res = await axios.post(`/quiz/${currentQuestion._id}/submit`, {
        selectedAnswer,
      });

      const correct = res.data.correct;
      setIsCorrect(correct);
      setAnswered(true);

      if (correct) {
        toast.success("✅ Correct!");
        setScore((prev) => prev + 1);
      } else {
        toast.error("❌ Incorrect!");
      }

      setQuizHistory((prev) => [
        ...prev,
        {
          question: currentQuestion.question,
          selectedAnswer,
          correctAnswer: res.data.correctAnswer,
          isCorrect: correct,
        },
      ]);
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const handleNext = async () => {
    if (totalAsked + 1 === questionCount) {
      setQuizEnded(true);
    } else {
      setTotalAsked((prev) => prev + 1);
      await fetchNextQuestion();
    }
  };

  const handleSubmitTest = async () => {
    try {
      const res = await axios.post("/quiz/submit", {
        score,
        total: questionCount,
        questions: quizHistory,
      });

      toast.success("🎉 Test submitted!");
    } catch (err) {
      toast.error("Failed to submit quiz result");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-6">🌿 Start a New Quiz</h2>

      {/* Select question count */}
      {!quizStarted && (
        <div className="space-y-4">
          <label className="block">
            <span className="font-medium">Select number of questions:</span>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value))}
              className="mt-1 p-2 border rounded w-full"
            >
              <option value={5}>5 Questions</option>
              <option value={10}>10 Questions</option>
              <option value={15}>15 Questions</option>
            </select>
          </label>

          <button
            onClick={handleStart}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            🚀 Start Quiz
          </button>
        </div>
      )}

      {/* Quiz question */}
      {quizStarted && !quizEnded && currentQuestion && (
        <div className="mt-8">
          <div className="text-lg font-semibold mb-3">
            Q{totalAsked + 1}. {currentQuestion.question}
          </div>

          <ul className="space-y-3">
            {currentQuestion.options.map((option, idx) => (
              <li key={idx}>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="option"
                    value={option}
                    disabled={answered}
                    checked={selectedAnswer === option}
                    onChange={() => setSelectedAnswer(option)}
                  />
                  {option}
                </label>
              </li>
            ))}
          </ul>

          {!answered ? (
            <button
              onClick={handleAnswerSubmit}
              disabled={loading}
              className="mt-5 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Submit Answer
            </button>
          ) : (
            <div className="mt-4">
              <p>
                {isCorrect ? (
                  <span className="text-green-600 font-semibold">
                    ✅ Correct Answer!
                  </span>
                ) : (
                  <span className="text-red-600 font-semibold">
                    ❌ Incorrect. Correct Answer:{" "}
                    {quizHistory[quizHistory.length - 1].correctAnswer}
                  </span>
                )}
              </p>

              <button
                onClick={handleNext}
                className="mt-3 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
              >
                {totalAsked + 1 === questionCount
                  ? "Finish Quiz"
                  : "Next Question"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Final Result */}
      {quizEnded && (
        <div className="mt-10">
          <h3 className="text-2xl font-semibold">🎉 Quiz Completed!</h3>
          <p className="mt-2">
            You scored <strong>{score}</strong> out of{" "}
            <strong>{questionCount}</strong>
          </p>

          <button
            onClick={handleSubmitTest}
            className="mt-4 bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800"
          >
            📤 Submit Test
          </button>

          <ul className="mt-6 space-y-2">
            {quizHistory.map((q, idx) => (
              <li
                key={idx}
                className={`p-3 rounded ${
                  q.isCorrect ? "bg-green-100" : "bg-red-100"
                }`}
              >
                <strong>Q:</strong> {q.question}
                <br />
                <strong>Your Answer:</strong> {q.selectedAnswer}
                {!q.isCorrect && (
                  <>
                    <br />
                    <strong>Correct Answer:</strong> {q.correctAnswer}
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StartQuiz;
