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
    if (!comment.trim()) return; // Early exit if empty
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/analyze', { text: comment });
      setResult(response.data);
      setComment(''); // Clear textarea
    } catch (error) {
      alert('Error analyzing sentiment!');
    } finally {
      setIsLoading(false);
    }
  };

  const getSentimentColor = (sentiment) => {
    const colors = {
      'Positive': 'text-green-600',
      'Negative': 'text-red-600',
      'Neutral': 'text-yellow-600',
      'Neutral but dominantly negative': 'text-orange-600',
      'Neutral but dominantly positive': 'text-lime-600'
    };
    return colors[sentiment] || 'text-gray-600';
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
          disabled={isLoading || !comment.trim()}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          <FiSend /> {isLoading ? 'Analyzing...' : 'Analyze Sentiment'}
        </button>

        {result && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Results:</h2>
            <div className="mb-4">
              <p className="text-lg">
                <span className={`font-bold ${getSentimentColor(result.sentiment)}`}>
                  {result.sentiment}
                </span>
                &nbsp;(Confidence: {(result.confidence * 100).toFixed(1)}%)
              </p>
              <div className="mt-2">
                <h3 className="font-medium mb-1">Score Breakdown:</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(result.scores).map(([label, score]) => (
                    <div key={label} className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full ${getSentimentColor(label).replace('text', 'bg')}`}></div>
                      <span className="text-sm">{label}: {(score * 100).toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              View Dashboard
            </button>
          </div>
        )}
      </div>
      <div className="mt-10 max-w-3xl mx-auto">
        <WordCloud />
      </div>
    </div>
  );
};

export default Home;
