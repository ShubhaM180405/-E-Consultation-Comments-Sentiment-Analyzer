import React from 'react';
import { TagCloud } from 'react-tagcloud';

const WordCloud = () => {
  const words = [
    { value: 'policy', count: 25 },
    { value: 'government', count: 20 },
    { value: 'change', count: 18 },
    { value: 'improve', count: 15 },
    { value: 'bad', count: 12 },
    { value: 'good', count: 30 },
    { value: 'support', count: 10 },
    { value: 'against', count: 8 },
  ];

  return (
    <div className="flex justify-center items-center h-64 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
      <TagCloud
        tags={words}
        minSize={12}
        maxSize={35}
        colorOptions={{
          luminosity: 'bright',
          hue: 'blue',
        }}
      />
    </div>
  );
};

export default WordCloud;
