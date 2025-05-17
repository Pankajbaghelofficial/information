import React from 'react';
import { Link } from 'react-router-dom';
import { FiMic, FiCreditCard, FiDownload, FiGlobe } from 'react-icons/fi';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Convert Text to Natural Voice with AI
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            High-quality text-to-speech conversion powered by Google Cloud TTS API.
            Transform your text into natural-sounding voice in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="btn bg-white text-primary-600 hover:bg-gray-100 font-semibold text-lg px-8 py-3"
            >
              Get Started Free
            </Link>
            <Link
              to="/pricing"
              className="btn bg-transparent border-2 border-white hover:bg-white/10 font-semibold text-lg px-8 py-3"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-primary-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FiMic className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">High-Quality Voices</h3>
              <p className="text-gray-600">
                Access to both Standard and premium WaveNet voices for natural-sounding speech.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-primary-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FiGlobe className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Multiple Languages</h3>
              <p className="text-gray-600">
                Support for numerous languages and regional accents to suit your needs.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-primary-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FiDownload className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">MP3 Downloads</h3>
              <p className="text-gray-600">
                Easily download your converted audio as MP3 files for use anywhere.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-primary-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FiCreditCard className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Credit System</h3>
              <p className="text-gray-600">
                Flexible credit-based system with free tier and premium options.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-primary-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Enter Your Text</h3>
              <p className="text-gray-600">
                Type or paste the text you want to convert to speech.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-primary-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose Voice Options</h3>
              <p className="text-gray-600">
                Select your preferred language, voice type, and specific voice.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-primary-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Convert and Download</h3>
              <p className="text-gray-600">
                Click convert, listen to the preview, and download your MP3 file.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Sign up for free and get 10,000 credits to start converting your text to speech today.
          </p>
          <Link
            to="/register"
            className="btn bg-white text-primary-600 hover:bg-gray-100 font-semibold text-lg px-8 py-3"
          >
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

