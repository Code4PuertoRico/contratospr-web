import React from 'react';
import { Line } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import millify from '../lib/millify';
import intcomma from '../lib/intcomma';

const DEFAULT_POINT_BG_COLOR = 'rgba(52, 144, 220, 0.5)';
const DEFAULT_POINT_RADIUS = 3;
const SELECTED_POINT_BG_COLOR = 'rgba(52, 144, 220, 1)';
const SELECTED_POINT_RADIUS = 5;

export function getChartData(contracts) {
  let chartData = [];
  let groups = {};

  for (let contract of contracts) {
    if (!groups[contract.date_of_grant]) {
      groups[contract.date_of_grant] = [];
    }
    groups[contract.date_of_grant].push(parseFloat(contract.amount_to_pay));
  }

  for (let [date, amounts] of Object.entries(groups)) {
    chartData.push({
      x: date,
      y: amounts.reduce((total, amount) => total + amount),
      contracts: amounts.length
    });
  }

  return chartData;
}

function ContractsChart({ height, contracts }) {
  let data = getChartData(contracts);
  let chartData = {
    datasets: [
      {
        backgroundColor: 'rgba(52, 144, 220, 0.5)',
        borderColor: 'rgba(52, 144, 220, 1)',
        pointBackgroundColor: data.map(() => DEFAULT_POINT_BG_COLOR),
        pointRadius: data.map(() => DEFAULT_POINT_RADIUS),
        fill: true,
        data: data
      }
    ]
  };

  let chartOptions = {
    legend: {
      display: false
    },
    tooltips: {
      displayColors: false,
      callbacks: {
        label: function(item, data) {
          let contracts = data.datasets[0].data[item.index].contracts;
          return [
            'Contratos: ' + contracts,
            'Total: $' + intcomma(item.yLabel)
          ];
        }
      }
    },
    scales: {
      xAxes: [
        {
          display: true,
          type: 'time',
          time: {
            tooltipFormat: 'll'
          }
        }
      ],
      yAxes: [
        {
          display: true,
          ticks: {
            beginAtZero: true,
            maxTicksLimit: 5,
            callback: function(value) {
              return '$' + millify(value);
            }
          }
        }
      ]
    },
    onClick: function(e) {
      let firstPoint = this.getElementAtEvent(e)[0];
      let dataset = this.data.datasets[0];

      let contractsElements = document
        .getElementById('contracts-list')
        .querySelectorAll('a');
      let contracts = Array.from(contractsElements);

      if (firstPoint) {
        let value = dataset.data[firstPoint._index];

        dataset.pointBackgroundColor = data.map(() => DEFAULT_POINT_BG_COLOR);
        dataset.pointBackgroundColor[
          firstPoint._index
        ] = SELECTED_POINT_BG_COLOR;
        dataset.pointRadius = data.map(() => DEFAULT_POINT_RADIUS);
        dataset.pointRadius[firstPoint._index] = SELECTED_POINT_RADIUS;
        this.update({ duration: 0 });

        contracts.forEach(function(contract) {
          if (value.x === contract.getAttribute('data-date')) {
            contract.style.display = '';
          } else {
            contract.style.display = 'none';
          }
        });
      } else {
        dataset.pointBackgroundColor = data.map(() => DEFAULT_POINT_BG_COLOR);
        dataset.pointRadius = data.map(() => DEFAULT_POINT_RADIUS);
        this.update({ duration: 0 });

        contracts.forEach(function(contract) {
          contract.style.display = '';
        });
      }
    }
  };

  return (
    <>
      <Line data={chartData} height={height} options={chartOptions} />
    </>
  );
}

ContractsChart.propTypes = {
  contracts: PropTypes.array,
  height: PropTypes.number
};

export default ContractsChart;
