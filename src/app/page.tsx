"use client";

import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { UserIcon, AcademicCapIcon, BookOpenIcon, ChartBarIcon, UserPlusIcon, DocumentArrowUpIcon } from '@heroicons/react/24/outline';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
}

export default function Dashboard() {
  const [connectedUsers, setConnectedUsers] = useState(0);
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [{
      label: 'Utilisation quotidienne',
      data: [],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
    }]
  });

  useEffect(() => {
    const generateMockData = () => {
      const labels = Array.from({ length: 24 }, (_, i) => `${i}h`);
      const data = Array.from({ length: 24 }, () => Math.floor(Math.random() * 1000));
      return { labels, data };
    };

    const interval = setInterval(() => {
      setConnectedUsers(Math.floor(Math.random() * 500 + 200));
      const { labels, data } = generateMockData();
      setChartData({
        labels,
        datasets: [{
          label: 'Utilisation quotidienne',
          data,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
        }]
      });
    }, 5000);

    const { labels, data } = generateMockData();
    setChartData({
      labels,
      datasets: [{
        label: 'Utilisation quotidienne',
        data,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
      }]
    });

    return () => clearInterval(interval);
  }, []);

  const stats = [
    { 
      title: 'Utilisateurs connectés', 
      value: connectedUsers.toString(),
      icon: UserIcon,
      color: 'bg-blue-500'
    },
    { 
      title: 'Examens complétés', 
      value: '1,234',
      icon: AcademicCapIcon,
      color: 'bg-green-500'
    },
    { 
      title: 'Moyenne générale', 
      value: '14.5/20',
      icon: ChartBarIcon,
      color: 'bg-purple-500'
    },
    { 
      title: 'Cours actifs', 
      value: '56',
      icon: BookOpenIcon,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-semibold mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Activité des dernières 24 heures</h2>
        <div className="h-96">
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                },
              },
              scales: {
                x: {
                  grid: {
                    display: false
                  }
                },
                y: {
                  grid: {
                    color: '#e5e7eb'
                  },
                  beginAtZero: true
                }
              }
            }}
          />
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Activités Récentes</h2>
        <div className="space-y-6">
          <div className="group flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl hover:shadow-md transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                <UserPlusIcon className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">Nouvel utilisateur inscrit</span>
            </div>
            <span className="text-xs font-semibold bg-white px-3 py-1 rounded-full shadow-sm text-blue-600">2 min</span>
          </div>

          <div className="group flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl hover:shadow-md transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                <DocumentArrowUpIcon className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">Examen BACC soumis</span>
            </div>
            <span className="text-xs font-semibold bg-white px-3 py-1 rounded-full shadow-sm text-green-600">15 min</span>
          </div>

          <div className="text-center py-4">
            <div className="h-24 w-24 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
              <ChartBarIcon className="h-8 w-8 text-gray-400" />
            </div>
            <p className="mt-3 text-sm text-gray-500">Aucune autre activité récente</p>
          </div>
        </div>
      </div>
    </div>
  );
}

