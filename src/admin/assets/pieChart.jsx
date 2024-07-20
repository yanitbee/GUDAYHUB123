// src/components/PieChart.js

import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const PieChart = ({ data }) => {
    const chartData = {
        labels: data.map(item => item.label),
        datasets: [
          {
            data: data.map(item => item.value),
            backgroundColor: [
                '#03a1a4',
              '#FCB03C',
              '#6FB07F',
              '#068587',
              '#1A4F63',
              '#FC5B3F',
            ],
            borderWidth: 0,
          },
        ],
      };
    
      const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.label || '';
                if (context.parsed) {
                  label += `: ${context.raw}%`;
                }
                return label;
              },
            },
          },
        },
        cutout: '75%', // Adjust the percentage to set the size of the donut hole
      };;

  return (
    <div>
  
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default PieChart;
