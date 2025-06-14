"use client"; // Si vous utilisez l'App Router et des hooks React

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

export default function ChartCard({ title, data, labels, colors }) {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div className="bg-white rounded shadow p-4 flex flex-col">
      <h2 className="text-lg font-bold mb-2">{title}</h2>
      <div className="flex-1 relative">
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
}
