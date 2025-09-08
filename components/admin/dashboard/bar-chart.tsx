'use client';

import { BarElement, CategoryScale, Chart, Legend, LinearScale, Tooltip } from 'chart.js';
import { Country } from '@prisma/client';
import { Bar } from 'react-chartjs-2';
import { useTranslations } from 'next-intl';

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export interface BarChartData {
  place: Country | string;
  value: number;
}

interface BarChartProps {
  data: BarChartData[];
  title: string;
}

export default function BarChart({ data, title }: BarChartProps) {
  const t = useTranslations('Component.BarChart');
  const chartData = {
    labels: data.map((item) => item.place),
    datasets: [
      {
        label: t('label'),
        data: data.map((item) => item.value),
        backgroundColor: '#36A2EB',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold ">{title}</h3>
      <div className="h-64">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
