import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { percentis } from '../data/percentis';

ChartJS.register(BarElement, CategoryScale, LinearScale);

const percentilSteps = [10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90];

const getPercentil = (area, score) => {
  const valores = percentis[area];
  if (!valores) return 0;
  for (let i = 0; i < valores.length; i++) {
    if (score <= valores[i]) {
      return percentilSteps[i];
    }
  }
  return percentilSteps[percentilSteps.length - 1];
};

const getColor = (area, score) => {
  const valores = percentis[area];
  let faixa = "Alto";
  for (let i = 0; i < valores.length; i++) {
    if (score <= valores[i]) {
      faixa = i <= 2 ? "Baixo" : i <= 7 ? "Médio" : "Alto";
      break;
    }
  }
  switch (faixa) {
    case "Baixo": return "#d9534f";
    case "Médio": return "#f0ad4e";
    case "Alto": return "#5cb85c";
    default: return "#999";
  }
};

const ResultChart = ({ scores, chartRef }) => {
  const labels = Object.keys(scores);
  const percentisData = labels.map(area => getPercentil(area, scores[area]));
  const data = {
    labels,
    datasets: [
      {
        label: 'Percentil por Área',
        data: percentisData,
        backgroundColor: labels.map((area, idx) => getColor(area, scores[area]))
      }
    ]
  };

  const options = {
    scales: {
      y: { beginAtZero: true, max: 100 }
    }
  };

  return <Bar ref={chartRef} data={data} options={options} />;
};

export default ResultChart;