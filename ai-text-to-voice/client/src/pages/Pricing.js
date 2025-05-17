import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiCheck, FiX } from 'react-icons/fi';

const Pricing = () => {
  const { isAuthenticated, user, upgradePlan } = useAuth();

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '₹0',
      period: 'per month',
      description: 'Basic features for personal use',
      features: [
        '10,000 credits per month',
        'Standard voices only',
        'MP3 downloads',
        'Basic support',
        'Mobile access'
      ],
      limitations: [
        'No WaveNet voices',
        'No priority processing',
        'Limited voice selection'
      ],
      buttonText: isAuthenticated && user?.plan === 'free' ? 'Current Plan' : 'Get Started',
      buttonLink: isAuthenticated ? '/dashboard' : '/register',
      highlighted: false
    },
    {
      id: 'premium_basic',
      name: 'Premium Basic',
      price: '₹199',
      period: 'per month',
      description: 'Advanced features for professionals',
      features: [
        '100,000 credits per month',
        'Access to WaveNet voices',
        'MP3 downloads',
        'Priority support',
        'Mobile access',
        'Extended voice selection'
      ],
      limitations: [
        'No unlimited usage'
      ],
      buttonText: isAuthenticated && user?.plan === 'premium_basic' ? 'Current Plan' : 'Upgrade',
      buttonLink: isAuthenticated ? '#' : '/register',
      highlighted: true
    },
    {
      id: 'premium_pro',
      name: 'Premium Pro',
      price: '₹499',
      period: 'per month',
      description: 'Maximum features for power users',
      features: [
        'Unlimited credits',
        'Access to all voice types',
        'MP3 downloads',
        'Priority processing',
        'Premium support',
        'Mobile access',
        'Full voice selection',
        'API access (coming soon)'
      ],
      limitations: [],
      buttonText: isAuthenticated && user?.plan === 'premium_pro' ? 'Current Plan' : 'Upgrade',
      buttonLink: isAuthenticated ? '#' : '/register',
      highlighted: false
    }
  ];

  const handleUpgrade = async (planId) => {
    if (isAuthenticated) {
      await upgradePlan(planId);
    }
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Pricing Plans</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect plan for your text-to-speech needs. All plans include basic features with different credit limits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-lg shadow-lg overflow-hidden ${
                plan.highlighted ? 'ring-2 ring-primary-500 transform md:-translate-y-4' : ''
              }`}
            >
              {plan.highlighted && (
                <div className="bg-primary-500 text-white text-center py-2 font-semibold">
                  Most Popular
                </div>
              )}
              
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900">{plan.name}</h2>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                  <span className="ml-1 text-xl font-medium text-gray-500">{plan.period}</span>
                </div>
                <p className="mt-2 text-gray-600">{plan.description}</p>
                
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0">
                        <FiCheck className="h-5 w-5 text-green-500" />
                      </div>
                      <p className="ml-3 text-gray-700">{feature}</p>
                    </li>
                  ))}
                  
                  {plan.limitations.map((limitation, index) => (
                    <li key={index} className="flex items-start text-gray-400">
                      <div className="flex-shrink-0">
                        <FiX className="h-5 w-5 text-red-400" />
                      </div>
                      <p className="ml-3">{limitation}</p>
                    </li>
                  ))}
                </ul>
                
                {isAuthenticated ? (
                  user?.plan === plan.id ? (
                    <button
                      disabled
                      className="mt-8 w-full bg-gray-300 text-gray-700 py-3 px-4 rounded-md font-medium"
                    >
                      Current Plan
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpgrade(plan.id)}
                      className={`mt-8 w-full ${
                        plan.highlighted
                          ? 'bg-primary-600 hover:bg-primary-700 text-white'
                          : 'bg-primary-100 hover:bg-primary-200 text-primary-700'
                      } py-3 px-4 rounded-md font-medium transition-colors duration-200`}
                    >
                      {plan.buttonText}
                    </button>
                  )
                ) : (
                  <Link
                    to={plan.buttonLink}
                    className={`mt-8 block text-center w-full ${
                      plan.highlighted
                        ? 'bg-primary-600 hover:bg-primary-700 text-white'
                        : 'bg-primary-100 hover:bg-primary-200 text-primary-700'
                    } py-3 px-4 rounded-md font-medium transition-colors duration-200`}
                  >
                    {plan.buttonText}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">What are credits?</h3>
              <p className="text-gray-700">
                Credits are used to convert text to speech. Each character in your text uses 1 credit for Standard voices and 2 credits for WaveNet voices.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">When do my credits reset?</h3>
              <p className="text-gray-700">
                Credits reset at the beginning of each month based on your plan. Unused credits do not roll over to the next month.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">What's the difference between Standard and WaveNet voices?</h3>
              <p className="text-gray-700">
                WaveNet voices sound more natural and human-like compared to Standard voices. They use advanced neural network technology but consume twice as many credits.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">Can I upgrade or downgrade my plan?</h3>
              <p className="text-gray-700">
                Yes, you can change your plan at any time. The new plan will take effect immediately, and your credits will be adjusted accordingly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;

