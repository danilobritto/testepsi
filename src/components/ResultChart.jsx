import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { percentis } from '../data/percentis';

ChartJS.register(BarElement, CategoryScale, LinearScale);

const getColor = (area, score) => {
  const [_, faixa] = (() => {
    const valores = percentis[area];
    for (let i = 0; i < valores.length; i++) {
      if (score <= valores[i]) {
        return [i * 10 + 10, i <= 2 ? "Baixo" : i <= 7 ? "Médio" : "Alto"];
      }
    }
    return [90, "Alto"];
  })();

  switch (faixa) {
    case "Baixo": return "#d9534f"; // vermelho
    case "Médio": return "#f0ad4e"; // laranja
    case "Alto": return "#5cb85c";  // verde
    default: return "#999";
  }
};

const ResultChart = ({ scores }) => {
  const labels = Object.keys(scores);
  const data = {
    labels,
    datasets: [
      {
        label: 'Pontuação por Área',
        data: Object.values(scores),
        backgroundColor: labels.map(area => getColor(area, scores[area]))
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