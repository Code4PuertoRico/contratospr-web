import React from 'react';
import { HorizontalBar } from 'react-chartjs-2';
import Pagination from './pagination';
import intcomma from '../lib/intcomma';
import millify from '../lib/millify';

function getChartData(data) {
  return {
    labels: data.results.map((item) => item.name),
    datasets: [
      {
        backgroundColor: 'rgba(49,130,206,1)',
        borderColor: 'rgba(49,130,206,1)',
        data: data.results.map((item) => {
          return {
            y: item.name,
            x: item.contracts_total,
            count: item.contracts_count
          };
        })
      }
    ]
  };
}

class PaginatedChart extends React.PureComponent {
  render() {
    let { data, width, height, onPageChange } = this.props;

    let chartOptions = {
      legend: {
        display: false
      },
      tooltips: {
        displayColors: false,
        callbacks: {
          label: function(item, data) {
            let count = data.datasets[0].data[item.index].count;
            return ['Contratos: ' + count, 'Total: $' + intcomma(item.xLabel)];
          }
        }
      },
      scales: {
        xAxes: [
          {
            display: true,
            ticks: {
              beginAtZero: true,
              callback: function(value) {
                return '$' + millify(value);
              }
            }
          }
        ],
        yAxes: [
          {
            display: true,
            ticks: {
              callback: function(value) {
                return value.length > 20
                  ? value.substring(0, 20) + '...'
                  : value;
              }
            }
          }
        ]
      }
    };

    return (
      <>
        <HorizontalBar
          data={getChartData(data)}
          width={width}
          height={height}
          options={chartOptions}
        />

        {data.count > 0 && data.total_pages > 1 ? (
          <div className="text-center mt-4">
            <Pagination
              page={data.page}
              pages={data.total_pages}
              onPageChange={onPageChange}
            />
          </div>
        ) : null}
      </>
    );
  }
}

export default PaginatedChart;
