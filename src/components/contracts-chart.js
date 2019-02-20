import React from 'react';
import { Line } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import millify from '../lib/millify';

const DEFAULT_POINT_BG_COLOR = 'rgba(52, 144, 220, 0.5)';
const DEFAULT_POINT_RADIUS = 3;
const SELECTED_POINT_BG_COLOR = 'rgba(52, 144, 220, 1)';
const SELECTED_POINT_RADIUS = 5;

class ContractsChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      height: props.height,
      data: {
        datasets: [
          {
            backgroundColor: 'rgba(52, 144, 220, 0.5)',
            borderColor: 'rgba(52, 144, 220, 1)',
            pointBackgroundColor: props.data.map(() => DEFAULT_POINT_BG_COLOR),
            pointRadius: props.data.map(() => DEFAULT_POINT_RADIUS),
            fill: true,
            data: props.data
          }
        ]
      },
      options: {
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
                'Total: $' + item.yLabel.toLocaleString()
              ];
            }
          }
        },
        scales: {
          xAxes: [
            {
              display: false,
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

            dataset.pointBackgroundColor = props.data.map(
              () => DEFAULT_POINT_BG_COLOR
            );
            dataset.pointBackgroundColor[
              firstPoint._index
            ] = SELECTED_POINT_BG_COLOR;
            dataset.pointRadius = props.data.map(() => DEFAULT_POINT_RADIUS);
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
            dataset.pointBackgroundColor = props.data.map(
              () => DEFAULT_POINT_BG_COLOR
            );
            dataset.pointRadius = props.data.map(() => DEFAULT_POINT_RADIUS);
            this.update({ duration: 0 });

            contracts.forEach(function(contract) {
              contract.style.display = '';
            });
          }
        }
      }
    };
  }

  render() {
    return (
      <>
        <Line
          data={this.state.data}
          height={this.state.height}
          options={this.state.options}
        />
      </>
    );
  }
}

ContractsChart.propTypes = {
  data: PropTypes.array,
  height: PropTypes.number
};

export default ContractsChart;
