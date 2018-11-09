import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import '../css/Home.css';
import LineChart from './LineChart';

class Home extends Component {
  constructor () {
    super();
    this.state = {
      series: [],
      minYear: undefined,
      maxYear: undefined,
      fileName: '',
      columnDefs: [{
          headerName: "Series",
          field: "series"
        },
        {
          headerName: "Year",
          field: "year"
        },
        {
          headerName: "Score",
          field: "score"
        }],
      rowData: []
    }
  }

  componentDidMount() {
    window.addEventListener("resize", this.sizeColumnsToFit.bind(this));
  }

  onFileChage({ target: { files } }) {
    const lineDelimiter = '\n';
    const valueDelimiter = ',';
    const dataDelimiter = '|';
    if (FileReader && files.length > 0) {
      let reader = new FileReader();
      if (reader) {
        reader.onload = ({ target: { result } }) => {
          const results = result.split(lineDelimiter);
          let seriesData = [];
          let rowData = [];
          let minYear = Number.MAX_SAFE_INTEGER, maxYear = Number.MIN_SAFE_INTEGER;

          results.forEach((series) => {
            if (series) {
              let values = series.split(valueDelimiter);
              const seriesName = values[0];

              values = values.splice(1);

              const data = values.map((value) => {
                let yearAndScore = value.split(dataDelimiter),
                  year = parseFloat(yearAndScore[0]),
                  score = parseFloat(yearAndScore[1]);

                if(year > maxYear) {
                  maxYear = year;
                }

                if(year < minYear){
                  minYear = year;
                }

                // add row data
                rowData.push({
                  series: seriesName,
                  year,
                  score
                });

                return {
                  year,
                  score
                }
              });

              seriesData.push({
                name: seriesName,
                data
              });
            }
          });

          this.setState({
            series: seriesData,
            minYear,
            maxYear,
            rowData
          });

          // reset columns width
          this.gridApi.sizeColumnsToFit();
        }

        reader.readAsText(files[0]);

        this.setState({
          fileName: files[0].name
        })
      }
    }
  }

  remove() {
    document.querySelector("#fileInput").value = "";

    this.setState({
      series: [],
      minYear: undefined,
      maxYear: undefined,
      fileName: '',
      rowData: []
    });
  }

  onGridReady(params) {
   this.gridApi = params.api;
   this.gridApi.sizeColumnsToFit();
  }

  renderData() {
    const { columnDefs, rowData } = this.state;
    return ( <div className="ag-theme-balham series-data-container">
        <AgGridReact
          enableSorting={true}
          enableFilter={true}
          paginationAutoPageSize={true}
          pagination={true}
          columnDefs={columnDefs}
          rowData={rowData}
          onGridReady={this.onGridReady.bind(this)}
        />
      </div>)
  }

  sizeColumnsToFit() {
    this.gridApi.sizeColumnsToFit();
  }

  render() {
    const { series, minYear, maxYear, fileName } = this.state;
    return (
      <section className="home-content">
        <div>
          <div className="browse-container">
            <button className="browse-button">Browse</button>
            <input id="fileInput" type="file" onChange={this.onFileChage.bind(this)} />
          </div>
          <label>{ fileName }</label>
          {
            fileName ? <button className="remove-button" onClick={this.remove.bind(this)}>X</button> : null
          }
        </div>
        <div className="chart-data-container">
          { this.renderData() }
          <div className="chart-container">
            <LineChart series={series} minYear={minYear} maxYear={maxYear} />
          </div>
        </div>
      </section>
    );
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.sizeColumnsToFit.bind(this));
  }
}

export default Home;
