import React from 'react';
import { Bar } from 'react-chartjs-2';
import intcomma from '../lib/intcomma';
import millify from '../lib/millify';

function getChartData(dataPoints) {
  return {
    labels: dataPoints.map((point) => point.month),
    datasets: [
      {
        label: 'Spending Over Time (Monthly)',
        backgroundColor: 'rgba(52, 144, 220, 0.5)',
        borderColor: 'rgba(52, 144, 220, 1)',
        data: dataPoints.map((point) => {
          return { y: point.total, x: point.month, count: point.count };
        })
      }
    ]
  };
}

function SpendingOverTimeChart({ dataPoints }) {
  let chartOptions = {
    legend: {
      display: false
    },
    tooltips: {
      displayColors: false,
      callbacks: {
        label: function(item, data) {
          let count = data.datasets[0].data[item.index].count;
          return ['Contratos: ' + count, 'Total: $' + intcomma(item.yLabel)];
        }
      }
    },
    scales: {
      xAxes: [
        {
          type: 'time',
          time: {
            unit: 'year',
            tooltipFormat: 'MMM YYYY'
          }
        }
      ],
      yAxes: [
        {
          display: true,
          ticks: {
            beginAtZero: true,
            callback: function(value) {
              return '$' + millify(value);
            }
          }
        }
      ]
    }
  };

  return (
    <>
      <Bar
        data={getChartData(dataPoints)}
        width={100}
        height={40}
        options={chartOptions}
      />
    </>
  );
}
export default SpendingOverTimeChart;
