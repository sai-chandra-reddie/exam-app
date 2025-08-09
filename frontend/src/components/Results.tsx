import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ExamResult } from '../types';

const Results: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result as ExamResult;

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">No results found</div>
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

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-success-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 80) return 'Excellent! Great job!';
    if (percentage >= 60) return 'Good work! Keep practicing.';
    return 'Keep studying and try again!';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 py-8 bg-gradient-to-r from-primary-600 to-primary-700">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-2">Exam Results</h1>
              <p className="text-primary-100">Your exam has been completed successfully</p>
            </div>
          </div>

          {/* Score Display */}
          <div className="px-6 py-8">
            <div className="text-center mb-8">
              <div className={`text-6xl font-bold ${getScoreColor(result.percentage)} mb-4`}>
                {result.percentage}%
              </div>
              <div className="text-xl text-gray-600 mb-2">
                {getScoreMessage(result.percentage)}
              </div>
              <div className="text-sm text-gray-500">
                Score: {result.correct_answers} out of {result.total_questions} correct
              </div>
            </div>

            {/* Detailed Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Questions:</span>
                    <span className="font-medium">{result.total_questions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Correct Answers:</span>
                    <span className="font-medium text-success-600">{result.correct_answers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Incorrect Answers:</span>
                    <span className="font-medium text-red-600">
                      {result.total_questions - result.correct_answers}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Accuracy:</span>
                    <span className="font-medium">{result.percentage}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Exam Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Exam ID:</span>
                    <span className="font-medium">#{result.exam_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Start Time:</span>
                    <span className="font-medium">
                      {new Date(result.start_time).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">End Time:</span>
                    <span className="font-medium">
                      {new Date(result.end_time).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">
                      {Math.round((new Date(result.end_time).getTime() - new Date(result.start_time).getTime()) / 1000 / 60)} minutes
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Performance</span>
                <span>{result.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    result.percentage >= 80 ? 'bg-success-500' :
                    result.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${result.percentage}%` }}
                ></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => navigate('/exam')}
                className="px-6 py-3 text-sm font-medium text-primary-600 bg-white border border-primary-600 rounded-md hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Take Another Exam
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
