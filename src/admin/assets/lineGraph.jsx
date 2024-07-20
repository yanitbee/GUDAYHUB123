import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale);

const LineGraph = ({ data, dateField }) => {
  const formattedData = {
    labels: data.map(item => new Date(item[dateField])),
    datasets: [
      {
        label: 'Entries Over Time',
        data: data.map((item, index) => ({ x: new Date(item[dateField]), y: index + 1 })),
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Line data={formattedData} options={options} />;
};

export default LineGraph;
