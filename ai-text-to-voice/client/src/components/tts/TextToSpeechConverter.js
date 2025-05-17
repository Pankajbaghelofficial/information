import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiPlay, FiDownload, FiRefreshCw } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const TextToSpeechConverter = () => {
  const { user, updateCredits } = useAuth();
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('en-US');
  const [voiceType, setVoiceType] = useState('standard');
  const [voiceName, setVoiceName] = useState('en-US-Standard-A');
  const [voices, setVoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [characterCount, setCharacterCount] = useState(0);
  const audioRef = useRef(null);

  // Fetch available voices
  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const res = await axios.get('/api/tts/voices');
        if (res.data.success) {
          setVoices(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching voices:', err);
        toast.error('Failed to load available voices');
      }
    };

    fetchVoices();
  }, []);

  // Filter voices based on selected language and type
  const filteredVoices = voices.filter(
    (voice) => voice.languageCodes.includes(language) && 
               (voiceType === 'standard' ? !voice.name.includes('Wavenet') : voice.name.includes('Wavenet'))
  );

  // Update character count when text changes
  useEffect(() => {
    setCharacterCount(text.length);
  }, [text]);

  // Handle text change
  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  // Handle language change
  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    
    // Reset voice name when language changes
    if (filteredVoices.length > 0) {
      setVoiceName(filteredVoices[0].name);
    }
  };

  // Handle voice type change
  const handleVoiceTypeChange = (e) => {
    setVoiceType(e.target.value);
  };

  // Handle voice name change
  const handleVoiceNameChange = (e) => {
    setVoiceName(e.target.value);
  };

  // Convert text to speech
  const convertToSpeech = async () => {
    if (!text.trim()) {
      toast.error('Please enter some text to convert');
      return;
    }

    // Check if user has enough credits
    const creditsMultiplier = voiceType === 'wavenet' ? 2 : 1;
    const requiredCredits = text.length * creditsMultiplier;

    if (user.credits < requiredCredits) {
      toast.error('Not enough credits. Please upgrade your plan or wait for the monthly reset.');
      return;
    }

    // Check if user's plan allows WaveNet voices
    if (voiceType === 'wavenet' && user.plan === 'free') {
      toast.error('WaveNet voices are only available for premium users. Please upgrade your plan.');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post('/api/tts/convert', {
        text,
        language,
        voiceType,
        voiceName
      });

      if (res.data.success) {
        // Convert base64 to audio URL
        const audioContent = res.data.data.audioContent;
        const blob = new Blob([Buffer.from(audioContent, 'base64')], { type: 'audio/mp3' });
        const url = URL.createObjectURL(blob);
        
        setAudioUrl(url);
        
        // Update user credits
        updateCredits(res.data.data.remainingCredits);
        
        // Play audio
        if (audioRef.current) {
          audioRef.current.load();
          audioRef.current.play();
        }
        
        toast.success('Text converted to speech successfully!');
      }
    } catch (err) {
      console.error('Error converting text to speech:', err);
      toast.error(err.response?.data?.error || 'Failed to convert text to speech');
    } finally {
      setLoading(false);
    }
  };

  // Handle play button click
  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
    } else if (text.trim()) {
      convertToSpeech();
    }
  };

  // Handle download button click
  const handleDownload = () => {
    if (audioUrl) {
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = `tts_${new Date().getTime()}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else if (text.trim()) {
      convertToSpeech().then(() => {
        setTimeout(() => {
          if (audioUrl) {
            const a = document.createElement('a');
            a.href = audioUrl;
            a.download = `tts_${new Date().getTime()}.mp3`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }
        }, 1000);
      });
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">Text to Speech Converter</h2>
      
      {/* Text Input */}
      <div className="mb-4">
        <label htmlFor="text" className="block text-gray-700 mb-2">
          Enter Text
        </label>
        <textarea
          id="text"
          className="input h-40"
          value={text}
          onChange={handleTextChange}
          placeholder="Type or paste your text here..."
        ></textarea>
        <div className="flex justify-between mt-1 text-sm text-gray-600">
          <span>Characters: {characterCount}</span>
          <span>
            Credits required: {characterCount * (voiceType === 'wavenet' ? 2 : 1)}
          </span>
        </div>
      </div>
      
      {/* Language Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="language" className="block text-gray-700 mb-2">
            Language
          </label>
          <select
            id="language"
            className="input"
            value={language}
            onChange={handleLanguageChange}
          >
            <option value="en-US">English (US)</option>
            <option value="en-GB">English (UK)</option>
            <option value="en-IN">English (India)</option>
            <option value="hi-IN">Hindi (India)</option>
            <option value="fr-FR">French</option>
            <option value="de-DE">German</option>
            <option value="es-ES">Spanish</option>
            <option value="ja-JP">Japanese</option>
            <option value="ko-KR">Korean</option>
          </select>
        </div>
        
        {/* Voice Type Selection */}
        <div>
          <label htmlFor="voiceType" className="block text-gray-700 mb-2">
            Voice Type
          </label>
          <select
            id="voiceType"
            className="input"
            value={voiceType}
            onChange={handleVoiceTypeChange}
            disabled={user?.plan === 'free'}
          >
            <option value="standard">Standard</option>
            <option value="wavenet" disabled={user?.plan === 'free'}>
              WaveNet (Premium)
            </option>
          </select>
          {user?.plan === 'free' && (
            <p className="text-xs text-gray-500 mt-1">
              Upgrade to Premium for WaveNet voices
            </p>
          )}
        </div>
      </div>
      
      {/* Voice Selection */}
      <div className="mb-6">
        <label htmlFor="voiceName" className="block text-gray-700 mb-2">
          Voice
        </label>
        <select
          id="voiceName"
          className="input"
          value={voiceName}
          onChange={handleVoiceNameChange}
        >
          {filteredVoices.length > 0 ? (
            filteredVoices.map((voice) => (
              <option key={voice.name} value={voice.name}>
                {voice.name} ({voice.ssmlGender})
              </option>
            ))
          ) : (
            <option value="">No voices available for selected options</option>
          )}
        </select>
      </div>
      
      {/* Audio Player */}
      {audioUrl && (
        <div className="mb-6">
          <audio ref={audioRef} controls className="w-full">
            <source src={audioUrl} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={convertToSpeech}
          disabled={loading || !text.trim()}
          className="btn btn-primary flex items-center justify-center"
        >
          {loading ? (
            <FiRefreshCw className="animate-spin mr-2" />
          ) : (
            <FiPlay className="mr-2" />
          )}
          {loading ? 'Converting...' : 'Convert & Play'}
        </button>
        
        <button
          onClick={handleDownload}
          disabled={loading || (!audioUrl && !text.trim())}
          className="btn btn-secondary flex items-center justify-center"
        >
          <FiDownload className="mr-2" />
          Download MP3
        </button>
      </div>
    </div>
  );
};

export default TextToSpeechConverter;

