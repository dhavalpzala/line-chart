import React, { Component } from 'react';
import Chart from 'chart.js';

class LineChart extends Component {
  constructor(props) {
    super(props);

    this.ctx = 'lineChart';
  }

  componentDidUpdate() {
    const { series, minYear, maxYear } = this.props;

    if(series && series.length > 0) {
      const COLORS = [
      	'#4dc9f6',
      	'#f67019',
      	'#f53794',
      	'#537bc4',
      	'#acc236',
      	'#166a8f',
      	'#00a950',
      	'#58595b',
      	'#8549ba'
      ];

      const labels = [];

      const datasets = [];

      series.forEach((serie) => {
        serie.data.sort((a, b) => a.year - b.year);

  			const newColor = COLORS[datasets.length % COLORS.length];

        const dataset = {
          label: serie.name,
          borderColor: newColor,
				  backgroundColor: newColor,
          data: serie.data.map(d => {
            return {
              x: d.year,
              y: d.score
            }
          }),
          fill: false,
          lineTension: 0
        };

        datasets.push(dataset);
      })

      for (let year = minYear; year <= maxYear; year++) {
        labels.push(year);
      }

      this.lineChart = new Chart(this.ctx, {
        type: 'line',
        data: {
          labels,
          datasets
        },
        options: {
    			responsive: true,
    			title: {
    				display: true,
    				text: 'Series Line Chart'
    			},
          tooltips: {
            mode: 'x'
          },
    			scales: {
    				xAxes: [{
    					display: true,
    					scaleLabel: {
    						display: true,
    						labelString: 'Year'
    					}
    				}],
    				yAxes: [{
    					display: true,
    					scaleLabel: {
    						display: true,
    						labelString: 'Score'
    					}
    				}]
    			}
			  }
      });
    } else if(this.lineChart) {
      this.lineChart.destroy();
    }
  }

  render() {
    return (
      <canvas id={this.ctx} ></canvas>
    );
  }
}

export default LineChart;
