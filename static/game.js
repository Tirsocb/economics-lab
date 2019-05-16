const portNumber = 5000
let socket = io.connect(`http://localhost:${portNumber}`);
let companies = []
let owned = []
let money = 0
let id = ''

socket.on('connect', () => {
  console.log(`player id: ${socket.id}`); // an alphanumeric id...
  document.getElementById('player-id').innerHTML = socket.id
  id = socket.id

  socket.on('fullLobby', (data) => {
    alert(data);
  })

  socket.on('updateInfo', (data) => {
    companies = data.companies
    const names = ['A', 'B', 'C']
    for (let i = 0; i < names.length; i++) {
      document.getElementById(`available${names[i]}`).value = data.companies[i].shares;
      document.getElementById(`price${names[i]}`).value = data.companies[i].price;
    }
  });

  socket.on('playerInfo', (data) => {
    document.getElementById(`playerMoney`).innerHTML = `$${data.player.money}.00`;
    money = data.player.money
    const names = ['A', 'B', 'C']
    for (let i = 0; i < names.length; i++) {
      owned[i] = data.player.shares[i]
      document.getElementById(`quantity${names[i]}`).innerHTML = data.player.shares[i];
    }
  });

  socket.on('play', (data) => {
    if (data.start == true && data.wait == false){
      document.getElementById('status').innerHTML = 'Enviar cantidad a vender o comprar'
      document.getElementById('submit-btn').style.display = 'initial'
    } else {
      document.getElementById('status').innerHTML = 'Esperando otros jugadores...'
      document.getElementById('submit-btn').style.display = 'none'
    }
  });
});

function submit() {
  const stocksToSell = [
    parseInt(document.getElementById('sellA').value),
    parseInt(document.getElementById('sellB').value),
    parseInt(document.getElementById('sellC').value),
  ]

  const stocksToBuy = [
    parseInt(document.getElementById('buyA').value),
    parseInt(document.getElementById('buyB').value),
    parseInt(document.getElementById('buyC').value)
  ]

  total = buyCalcTotal()
  if (total > money) {
    alert('Buy bigger than available money, lower stock buy amount.')
  }

  let legalSale = true
  for (let i = 0; i < 3; i ++){
    if (stocksToSell[i] > owned[i]){
      legalSale = false
    }
  }
  if (legalSale === false) {
    alert('Sell of more stock than owned, lower stock sell amount.')
  }

  if (legalSale && (total <= money)){
    socket.emit('submit', {
      'sell': stocksToSell,
      'buy': stocksToBuy,
      'id': id,
      'total': total,
      'sellTot': sellCalcTotal()
    })
  }
}

function buyCalcTotal(){
  const stocksToBuy = [
    parseInt(document.getElementById('buyA').value),
    parseInt(document.getElementById('buyB').value),
    parseInt(document.getElementById('buyC').value)
  ]
 
  let total = 0
  for (let i = 0; i < 3; i++){
    total += stocksToBuy[i] * companies[i].price
  }

  document.getElementById('total-spent').innerHTML = `$${total}.00`

  if (total > money) {
    document.getElementById('total-spent').innerHTML = 'Buy bigger than available money, lower stock amount'
  }
  
  return total
}

function sellCalcTotal(){
  const stocksToSell = [
    parseInt(document.getElementById('sellA').value),
    parseInt(document.getElementById('sellB').value),
    parseInt(document.getElementById('sellC').value),
  ]

  let total = 0
  for (let i = 0; i < 3; i++){
    total += stocksToSell[i] * companies[i].price
  }

  return total
}
