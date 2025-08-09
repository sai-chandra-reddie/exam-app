import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { examAPI } from '../services/api';
import { Question } from '../types';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState('');

  const handleStartExam = async () => {
    setIsStarting(true);
    setError('');

    try {
      const questions = await examAPI.startExam();
      navigate('/exam', { state: { questions } });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to start exam. Please try again.');
    } finally {
      setIsStarting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Exam Taking Application</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {user?.username}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Welcome to Your Exam Dashboard
                </h2>
                <p className="text-gray-600 mb-8">
                  You are ready to take your exam. The exam consists of 10 multiple-choice questions
                  and you will have 30 minutes to complete it.
                </p>

                {error && (
                  <div className="mb-6 rounded-md bg-red-50 p-4">
                    <div className="text-sm text-red-700">{error}</div>
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Exam Instructions</h3>
                  <ul className="text-left text-gray-600 space-y-2">
                    <li>• The exam contains 10 multiple-choice questions</li>
                    <li>• You have 30 minutes to complete the exam</li>
                    <li>• Each question has 4 options (A, B, C, D)</li>
                    <li>• You can navigate between questions using Next/Previous buttons</li>
                    <li>• The exam will auto-submit when time runs out</li>
                    <li>• You can submit early if you finish before the time limit</li>
                  </ul>
                </div>

                <button
                  onClick={handleStartExam}
                  disabled={isStarting}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isStarting ? 'Starting Exam...' : 'Start Exam'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
