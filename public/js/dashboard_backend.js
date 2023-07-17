var nxt_trade_id = 0;
$.ajax({
    type : "GET",
    url:'./api/trade',
    data:{
    
    },
    success:function(data){
        var stocks = new Map();
        const table = document.getElementById('list_of_stocks');
        for(var j = data.length - 1;j >= 0;j--){
            // console.log(data)
            var i = data[j];
            if(stocks.has(i.TRADE_ID) == false)
                stocks.set(i.TRADE_ID,i.name);
        }
        for(var i of stocks){
            nxt_trade_id = Math.max(nxt_trade_id,i[0]);
            var row = document.createElement('li');
            row.className = 'list-group-item';
            row.innerHTML = `<a href="./report/${i[0]}">${i[1]}</a>`;
            table.append(row);
        }
        nxt_trade_id++;
        console.log(nxt_trade_id)
    }
});

function create_new_trade(){  
  var date = new Date();
  axios.post('../api/trade',{
      "type": document.getElementById('tradeType').value,
      "name": document.getElementById('stockName').value,
      "date": date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear(),
      "quantity": document.getElementById('quantity').value,
      "price": document.getElementById('tradePrice').value,
      "total": document.getElementById('tradePrice').value * document.getElementById('quantity').value,
      "TRADE_ID": nxt_trade_id,
      "IS_END": "0",
      "Reason": document.getElementById('reason').value
    }).then((res)=>{
      window.location.reload(); 
  });
}