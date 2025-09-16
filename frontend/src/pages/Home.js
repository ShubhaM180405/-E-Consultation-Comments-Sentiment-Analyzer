import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiSend } from 'react-icons/fi';
import WordCloud from '../components/WordCloud';

const Home = () => {
  const [comment, setComment] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const analyzeSentiment = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/analyze', { text: comment });
      setResult(response.data);
    } catch (error) {
      alert('Error analyzing sentiment!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">E-Consultation Sentiment Analyzer</h1>

        <textarea
          className="w-full h-32 p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Paste or type comments here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button
          onClick={analyzeSentiment}
          disabled={isLoading}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          <FiSend /> {isLoading ? 'Analyzing...' : 'Analyze Sentiment'}
        </button>

        {result && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Results:</h2>
            <p className="text-lg">
              <span className={`font-bold ${result.sentiment === 'Positive' ? 'text-green-600' : result.sentiment === 'Negative' ? 'text-red-600' : 'text-yellow-600'}`}>
                {result.sentiment}
              </span>
              &nbsp;(Polarity: {result.polarity.toFixed(2)})
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              View Dashboard
            </button>
          </div>
        )}
      </div>

      {/* Decorative Word Cloud (Static Example) */}
      <div className="mt-10 max-w-3xl mx-auto">
        <WordCloud />
      </div>
    </div>
  );
};

export default Home;
