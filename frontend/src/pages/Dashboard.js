import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { FiUpload } from 'react-icons/fi';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/dashboard');
      setData(response.data);
    } catch (error) {
      alert('Error fetching data!');
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    try {
      await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchData();
    } catch (error) {
      alert('Error uploading file!');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Updated sentiment data for PieChart (5 classes)
  const sentimentData = [
    { name: 'Negative', value: data.filter(d => d.sentiment === 'Negative').length },
    { name: 'Neutral-', value: data.filter(d => d.sentiment === 'Neutral but dominantly negative').length },
    { name: 'Neutral', value: data.filter(d => d.sentiment === 'Neutral').length },
    { name: 'Neutral+', value: data.filter(d => d.sentiment === 'Neutral but dominantly positive').length },
    { name: 'Positive', value: data.filter(d => d.sentiment === 'Positive').length },
  ];

  const COLORS = ['#FF5733', '#FF8C00', '#FFD700', '#90EE90', '#00C49F'];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Sentiment Dashboard</h1>

        {/* File Upload */}
        <div className="mb-6 p-4 bg-white rounded-lg shadow">
          <form onSubmit={handleFileUpload} className="flex items-center gap-4">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="flex-1 border border-gray-300 p-2 rounded-lg"
              accept=".csv"
            />
            <button
              type="submit"
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              <FiUpload /> Upload CSV
            </button>
          </form>
        </div>

        {/* Pie Chart */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Sentiment Distribution</h2>
            <PieChart width={400} height={300}>
              <Pie
                data={sentimentData}
                cx={200}
                cy={150}
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {sentimentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </div>

        {/* Data Table */}
        <div className="mt-6 bg-white p-4 rounded-lg shadow overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4">Recent Comments</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sentiment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.text.substring(0, 50)}...</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <span className={
                      item.sentiment === 'Positive' ? 'text-green-600' :
                      item.sentiment === 'Negative' ? 'text-red-600' :
                      item.sentiment === 'Neutral but dominantly negative' ? 'text-orange-600' :
                      item.sentiment === 'Neutral but dominantly positive' ? 'text-lime-600' :
                      'text-yellow-600'
                    }>
                      {item.sentiment}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {(item.confidence * 100).toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

