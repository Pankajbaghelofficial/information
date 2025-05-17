import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TextToSpeechConverter from '../components/tts/TextToSpeechConverter';
import { FiCreditCard, FiClock, FiUser } from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useAuth();

  // Format plan name for display
  const formatPlanName = (plan) => {
    switch (plan) {
      case 'free':
        return 'Free';
      case 'premium_basic':
        return 'Premium Basic';
      case 'premium_pro':
        return 'Premium Pro';
      default:
        return plan;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {/* User Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Credits Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <FiCreditCard className="text-primary-600 text-2xl mr-3" />
            <h2 className="text-xl font-semibold">Credits</h2>
          </div>
          <p className="text-3xl font-bold text-gray-800">{user?.credits.toLocaleString()}</p>
          <p className="text-sm text-gray-600 mt-2">
            Available for text-to-speech conversion
          </p>
          <Link
            to="/pricing"
            className="mt-4 inline-block text-primary-600 hover:text-primary-700 font-medium"
          >
            Upgrade Plan
          </Link>
        </div>
        
        {/* Plan Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <FiUser className="text-primary-600 text-2xl mr-3" />
            <h2 className="text-xl font-semibold">Current Plan</h2>
          </div>
          <p className="text-3xl font-bold text-gray-800">{formatPlanName(user?.plan)}</p>
          <p className="text-sm text-gray-600 mt-2">
            {user?.plan === 'free' 
              ? 'Standard voices only' 
              : 'Access to all voice types'}
          </p>
          {user?.plan !== 'premium_pro' && (
            <Link
              to="/pricing"
              className="mt-4 inline-block text-primary-600 hover:text-primary-700 font-medium"
            >
              Upgrade Plan
            </Link>
          )}
        </div>
        
        {/* History Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <FiClock className="text-primary-600 text-2xl mr-3" />
            <h2 className="text-xl font-semibold">History</h2>
          </div>
          <p className="text-sm text-gray-600">
            View your past text-to-speech conversions
          </p>
          <Link
            to="/history"
            className="mt-4 inline-block text-primary-600 hover:text-primary-700 font-medium"
          >
            View History
          </Link>
        </div>
      </div>
      
      {/* Text to Speech Converter */}
      <TextToSpeechConverter />
      
      {/* Tips Section */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Tips for Best Results</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            For longer texts, consider breaking them into smaller paragraphs for better processing.
          </li>
          <li>
            WaveNet voices (Premium) provide more natural-sounding speech but use 2x credits.
          </li>
          <li>
            Different languages have different voice options available.
          </li>
          <li>
            Your credits reset at the beginning of each month based on your plan.
          </li>
          <li>
            Downloaded MP3 files can be used in videos, podcasts, or any other media.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;

