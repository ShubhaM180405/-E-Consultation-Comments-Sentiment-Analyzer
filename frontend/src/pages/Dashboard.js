import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
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

  // Sample data for charts (replace with API data)
  const sentimentData = [
    { name: 'Positive', value: data.filter(d => d.sentiment === 'Positive').length },
    { name: 'Negative', value: data.filter(d => d.sentiment === 'Negative').length },
    { name: 'Neutral', value: data.filter(d => d.sentiment === 'Neutral').length },
  ];

    const COLORS = ['#FF5733', '#FF8C00', '#FFD700', '#90EE90', '#00C49F'];

  // Updated sentiment data for PieChart
  const sentimentData = [
    { name: 'Negative', value: data.filter(d => d.sentiment === 'Negative').length },
    { name: 'Neutral-', value: data.filter(d => d.sentiment === 'Neutral but dominantly negative').length },
    { name: 'Neutral', value: data.filter(d => d.sentiment === 'Neutral').length },
    { name: 'Neutral+', value: data.filter(d => d.sentiment === 'Neutral but dominantly positive').length },
    { name: 'Positive', value: data.filter(d => d.sentiment === 'Positive').length },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* ... (previous JSX) */}
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
        {/* ... (rest of the JSX) */}
      </div>
    </div>
  );
};
