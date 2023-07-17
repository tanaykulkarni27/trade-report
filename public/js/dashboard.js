

// Load the Google Charts library
google.charts.load('current', { 'packages': ['corechart'] });


// Example data for stocks traded
const stockData = [
    { stockName: 'AAPL', profitLoss: 5000 },
    { stockName: 'GOOG', profitLoss: -2000 },
    { stockName: 'MSFT', profitLoss: 3000 },
    // Add more stock objects as needed
  ];
  
  // Example data for dates and profit/loss values
  
  // Load the Google Charts API
  google.charts.load('current', { 'packages': ['corechart'] });
  

  // Function to create the profit and loss pie chart
  function createProfitLossPieChart(values) {
    const data = new google.visualization.DataTable();
    data.addColumn('string', 'Category');
    data.addColumn('number', 'Amount');
  
    var profitAmount = 0;
    var lossAmount = 0;
    
    values.forEach(val=>{
      if(val <= 0){
        lossAmount += Math.abs(val);
      }else
        profitAmount += val;
    });

    data.addRow(['Profit', profitAmount]);
    data.addRow(['Loss', lossAmount]);
  
    const options = {
      colors: ['#1f8bff', '#ff3d71'],
      legend: {
        position: 'right',
        textStyle: {
          fontName: 'Roboto',
          fontSize: 12,
          bold: true
        }
      }
    };
  
    const chart = new google.visualization.PieChart(document.getElementById('profitLossChart'));
    chart.draw(data, options);
  }
  
  // Function to create the line chart for profit and loss dates
  function createProfitLossLineChart(dates,values) {
    const data = new google.visualization.DataTable();
    data.addColumn('date', 'Date');
    data.addColumn('number', 'Amount');

    const chartData = dates.map((date, index) => [new Date(date[2],date[1] - 1,date[0]), values[index]]);
    
    data.addRows(chartData);
  
    const options = {
      colors: ['#1f8bff'],
      hAxis: {
        format: 'dd MMM yyyy',
        title: 'Date',
        titleTextStyle: {
          fontName: 'Roboto',
          fontSize: 12,
          bold: true
        },
        textStyle: {
          fontName: 'Roboto',
          fontSize: 10
        }
      },
      vAxis: {
        title: 'Amount',
        titleTextStyle: {
          fontName: 'Roboto',
          fontSize: 12,
          bold: true
        },
        textStyle: {
          fontName: 'Roboto',
          fontSize: 10
        },
        format: '#,##0',
        ticks: {
          callback: (value) => {
            return value >= 0 ? '+' + value : value;
          }
        }
      },
      chartArea: {
        width: '80%',
        height: '70%',
        left: '10%',
        top: '10%'
      },
      curveType: 'function',
      pointSize: 5
    };
  
    const chart = new google.visualization.LineChart(document.getElementById('profitLossDatesChart'));
    chart.draw(data, options);
  }
  
  // Toggle stock list visibility
  function toggleStockList() {
    const stockList = document.getElementById('stockList');
    stockList.classList.toggle('collapsed');
  }
  
function Load_PnL(){
    // ./api/PnL
    $.ajax({
        type : "GET",
        url:'./api/PnL',
       success:(data)=>{
            var dates = [];
            var values = [];
            for(var i of data){
                cur_date = i.date.split('-');
                if(cur_date[2].length == 2)
                    cur_date[2] = '20' + cur_date[2];
                dates.push(cur_date);
                values.push(i.profit);
            }
            // console.log(dates)
            createProfitLossLineChart(dates,values);
            createProfitLossPieChart(values);
       } 
    });
}


  // Function to load the Google Charts API and create the charts
  function initialize() {
    Load_PnL();
  }
  
  // Load the Google Charts API and call the initialize function
  google.charts.setOnLoadCallback(initialize);
  