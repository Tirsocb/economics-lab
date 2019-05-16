Object.defineProperty(exports, "__esModule", { value: true });

class Player {
  constructor(money, utilities, shares, id){
    this.money = money;
    this.utilities = utilities;
    this.shares = shares;
    this.id = id;
  }

  buyShares(shares, total) {
    this.shares[0] += shares[0];
    this.shares[1] += shares[1];
    this.shares[2] += shares[2];

    this.money -= total;
  }

  sellShares(shares, sells) {
    this.shares[0] -= shares[0];
    this.shares[1] -= shares[1];
    this.shares[2] -= shares[2];

    this.money += sells;
  }
}

class Company {
  constructor(shares, price){
    this.shares = shares;
    this.price = price;
  }
}

class Game {
  constructor () {
    this.companies = [
      new Company(20 + Math.floor(Math.random() * 5), 10 + Math.floor(Math.random() * 5)),
      new Company(20 + Math.floor(Math.random() * 5), 10 + Math.floor(Math.random() * 5)),
      new Company(20 + Math.floor(Math.random() * 5), 10 + Math.floor(Math.random() * 5))
    ]

    this.players = [];
  }

  addNewPlayer(id) {
    const newPlayer = new Player(100, 0, [0,0,0], id)
    this.players.push(newPlayer);
    return newPlayer;
  }

  removePlayer(id) {
    const playerLeaving = this.players.find( (player) => {return player.id === id});
    const playerLeavingIndex = this.players.indexOf(playerLeaving);

    if (playerLeavingIndex > -1) {
      this.players.splice(playerLeavingIndex, 1);
    }
  }

  buyShares(shares, id, total) {
    for (let i = 0; i < 3; i++){
      this.companies[i].shares -= shares[i];
      this.companies[i].price += Math.ceil(shares[i] / 2)
    }

    const player = this.players.find( (player) => {return player.id === id});
    const playerIndex = this.players.indexOf(player);

    if (playerIndex > -1) {
      this.players[playerIndex].buyShares(shares, total)
    }

    return this.players[playerIndex]
  }

  sellShares(shares, id, sells) {
    for (let i = 0; i < 3; i++){
      this.companies[i].shares += shares[i];
      this.companies[i].price -= Math.ceil(shares[i] / 2)
    }

    const player = this.players.find( (player) => {return player.id === id});
    const playerIndex = this.players.indexOf(player);

    if (playerIndex > -1) {
      this.players[playerIndex].sellShares(shares, sells)
    }

    return this.players[playerIndex]
  }
}
exports.default = new Game();
