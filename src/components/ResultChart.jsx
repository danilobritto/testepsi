import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale);

const ResultChart = ({ scores }) => {
  const data = {
    labels: Object.keys(scores),
    datasets: [
      {
        label: 'Pontuação por Área',
        data: Object.values(scores),
        backgroundColor: '#0078D4'
      }
    ]
  };

  const options = {
    scales: {
      y: { beginAtZero: true }
    }
  };

  return <Bar data={data} options={options} />;
};

export default ResultChart;