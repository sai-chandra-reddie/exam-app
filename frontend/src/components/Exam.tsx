import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Question, Answer } from '../types';
import { examAPI } from '../services/api';

const Exam: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmitExam = useCallback(async () => {
    setIsSubmitting(true);
    setError('');

    try {
      const answersArray: Answer[] = questions.map(question => ({
        question_id: question.id,
        selected_answer: answers[question.id] || ''
      }));

      const result = await examAPI.submitExam({ answers: answersArray });
      navigate('/results', { state: { result } });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to submit exam');
    } finally {
      setIsSubmitting(false);
    }
  }, [questions, answers, navigate]);

  // Load questions on component mount
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        // Check if questions were passed from Dashboard
        if (location.state?.questions) {
          setQuestions(location.state.questions);
          setIsLoading(false);
        } else {
          // If no questions were passed, redirect to dashboard
          setError('No exam questions available. Please start a new exam from the dashboard.');
        }
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to load questions');
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, [location.state]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmitExam();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, handleSubmitExam]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestionIndex].id]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isAnswered = answers[currentQuestion?.id];
  const answeredCount = Object.keys(answers).length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">{error}</div>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with timer */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">Exam in Progress</h1>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
              <div className={`text-lg font-mono ${timeLeft <= 300 ? 'text-red-600' : 'text-gray-900'}`}>
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          {/* Progress bar */}
          <div className="px-6 py-4 border-b">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress: {answeredCount}/{questions.length} answered</span>
              <span>{Math.round((answeredCount / questions.length) * 100)}% complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(answeredCount / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="px-6 py-8">
            <div className="mb-8">
              <h2 className="text-xl font-medium text-gray-900 mb-4">
                Question {currentQuestionIndex + 1}
              </h2>
              <p className="text-lg text-gray-700 mb-6">{currentQuestion.question_text}</p>
            </div>

            {/* Answer options */}
            <div className="space-y-3">
              {[
                { key: 'A', text: currentQuestion.option_a },
                { key: 'B', text: currentQuestion.option_b },
                { key: 'C', text: currentQuestion.option_c },
                { key: 'D', text: currentQuestion.option_d },
              ].map((option) => (
                <label
                  key={option.key}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                    isAnswered === option.key
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={option.key}
                    checked={isAnswered === option.key}
                    onChange={() => handleAnswerSelect(option.key)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                    isAnswered === option.key
                      ? 'border-primary-500 bg-primary-500'
                      : 'border-gray-300'
                  }`}>
                    {isAnswered === option.key && (
                      <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                    )}
                  </div>
                  <span className="font-medium mr-2">{option.key}.</span>
                  <span className="text-gray-700">{option.text}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="px-6 py-4 border-t bg-gray-50">
            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <div className="flex space-x-3">
                <button
                  onClick={handleSubmitExam}
                  disabled={isSubmitting}
                  className="px-6 py-2 text-sm font-medium text-white bg-success-600 border border-transparent rounded-md hover:bg-success-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Exam'}
                </button>

                {currentQuestionIndex < questions.length - 1 && (
                  <button
                    onClick={handleNext}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exam;
