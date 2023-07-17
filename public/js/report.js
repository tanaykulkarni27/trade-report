var stock_name = '';
var TRADE_ID = '';
var nxt_key = 0;

function populateTradeTable(tradeData) {
  const tradeTableBody = document.getElementById('tradeTableBody');

  tradeData.forEach(trade => {
    const row = document.createElement('tr');

    const stockNameCell = document.createElement('td');
    stockNameCell.textContent = trade.name;
    row.appendChild(stockNameCell);

    const dateCell = document.createElement('td');
    dateCell.textContent = trade.date;
    row.appendChild(dateCell);

    const transactionTypeCell = document.createElement('td');
    transactionTypeCell.textContent = trade.type;
    row.appendChild(transactionTypeCell);

    const priceCell = document.createElement('td');
    priceCell.textContent = trade.price.toFixed(2);
    row.appendChild(priceCell);

    const QuantityCell = document.createElement('td');
    QuantityCell.innerHTML = trade.quantity;
    row.appendChild(QuantityCell);

    const TotalCell = document.createElement('td');
    TotalCell.innerHTML = trade.total;
    row.appendChild(TotalCell);

    const reasonCell = document.createElement('td');
    if(!trade.Reason)
      trade.Reason = '';
    reasonCell.innerHTML = trade.Reason.replace('\n','<br>');
    row.appendChild(reasonCell);

    tradeTableBody.appendChild(row);
  });
}

// Function to calculate and display the total capital used
function calculateTotalCapital(data) {
  const totalCapitalElement = document.getElementById('totalCapital');
  const totalQuantityElement = document.getElementById('totalQuantity');

  var totalCapital = 0;
  var totalQuantity = 0;

  for(var i of data){
    if(i.type == 'buy' || i.type == 'Buy'){
      totalCapital += i.total;
      totalQuantity += i.quantity;
    }
  }
  
  totalCapitalElement.textContent = totalCapital.toFixed(2);
  totalQuantityElement.textContent = totalQuantity.toFixed(2);
}

// Call the functions to populate the trade report table and calculate the total capital

function initialize(){
  var loc = window.location.pathname;
  var dirs = loc.split('/');
  const trade_id = dirs[dirs.length - 1];  

  stock_name = '';
  TRADE_ID = trade_id;

  $.ajax({
    type : "GET",
    url:'../api/trade/'+trade_id,
    data:{
      data:'hello world'
    },
    contentType: 'application/json',
    success:function(data){
      stock_name = data[0].name;
      populateTradeTable(data);
      calculateTotalCapital(data);      
      document.getElementById('stockName').value = stock_name;
      for(var i of data){
        if(i.IS_END == '1'){
          document.getElementById('addTradeForm').style.display = 'none'; 
          document.getElementById('add_trade').style.display = 'none';
          break;
        }
      }
    }
  });
  
}

initialize();

function end_trade(){
  axios.put('../api/trade/'+TRADE_ID,{
    TRADE_ID : TRADE_ID,
    IS_END : '1'
  }).then((res)=>{
    window.location.reload(); 
  });
}
function add_trade(){
  var date = new Date();
  axios.post('../api/trade',{
      "type": document.getElementById('transactionType').value,
      "name": document.getElementById('stockName').value,
      "date": date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear(),
      "quantity": document.getElementById('quantity').value,
      "price": document.getElementById('price').value,
      "total": document.getElementById('price').value * document.getElementById('quantity').value,
      "TRADE_ID": TRADE_ID,
      "IS_END": "0",
      "Reason": document.getElementById('reason').value
    }).then((res)=>{
      window.location.reload(); 
  });
}