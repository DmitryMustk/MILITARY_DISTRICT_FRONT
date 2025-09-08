'use client';

import { ArcElement, Chart, Legend, Tooltip } from 'chart.js';
import { Industry, OpportunityType } from '@prisma/client';
import { Doughnut } from 'react-chartjs-2';

Chart.register(ArcElement, Tooltip, Legend);

export interface PieChartData {
  id: OpportunityType | Industry | string;
  value: number;
}

interface PieChartProps {
  data: PieChartData[];
  title: string;
}

const predefinedColors = [
  '#FF6384',
  '#36A2EB',
  '#FFCE56',
  '#4BC0C0',
  '#9966FF',
  '#FF9F40',
  '#FF5733',
  '#C70039',
  '#900C3F',
  '#00CED1',
  '#FFD700',
  '#ADFF2F',
  '#32CD32',
  '#4682B4',
];

const generateColors = (count: number) => {
  return predefinedColors.slice(0, count);
};

export function PieChart({ data, title }: PieChartProps) {
  const chartData = {
    labels: data.map((item) => item.id),
    datasets: [
      {
        data: data.map((item) => item.value),
        backgroundColor: generateColors(data.length),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
}
