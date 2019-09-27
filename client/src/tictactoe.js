import React, { Component }  from 'react';

const num = '1'

var playerBalance

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

export class Game extends React.Component {

  constructor(props) {
    super(props);
    console.log("Props:", props)
    prepChannels(num, props.player1, props.address1, props.player2, props.address2)
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      player1: props.player1,
      player2: props.player2,
      address1: props.address1,
      address2: props.address2,
      selectedPlayer: 1,
    }
  }

  async componentDidMount() {
    const balance1 = await getBalance(this.props.player1)
    const balance2 = await getBalance(this.props.player2)
    this.setState({
        ...this.state,
        player1Balance: balance1,
        player2Balance: balance2,
    })
  }

  handleWinner = async (winnerSymbol) => {
      var payingClient
      var winningAddress
      const wagerAmount = '1'
      if (winnerSymbol === 'X') {
          payingClient = this.state.player1
          winningAddress = this.state.address2
      } else if (winnerSymbol === 'O') {
          payingClient = this.state.player2
          winningAddress = this.state.address1
      } else {
          throw "IMPOSSIBLE"
      }
  
      await sendPay(payingClient, winningAddress, wagerAmount)
  
      // Update player balances
      const balance1 = await getBalance(this.props.player1)
      const balance2 = await getBalance(this.props.player2)
      this.setState({
          ...this.state,
          player1Balance: balance1,
          player2Balance: balance2,
      })
  
      console.log("balances:", balance1, balance2)
      console.log("Pay sent to player", winnerSymbol == 'X' ? 1 : 2)
  }

  handleClick(i) {
    console.log("this:", this.state, this.state.player1Balance.freeBalance)
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    const symbol = this.state.xIsNext ? "X" : "O";
    squares[i] = symbol
    if (calculateWinner(squares)) {
        this.handleWinner(symbol)
    }
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {


    const handleWithdrawEthChange = (e) => {
        const numWei = e.target.value
        this.setState({
            ...this.state,
            ethWithdrawAmount: numWei,
        })
    }

    const handleDepositEthChange = (e) => {
        const numWei = e.target.value
        this.setState({
            ...this.state,
            ethDepositAmount: numWei,
        })
    }

    const handleSubmitDepositEth = async (e) => {
        // prevent form submission
        e.preventDefault()
        const player = this.state.selectedPlayer
        const amount = this.state.ethDepositAmount

        if (isNaN(amount)) {
            alert("Please specify an integer")
        } else if (amount <= 0) {
            alert("Please specify positive amount")
        }

        if (player !== 1 && player !== 2) {
            throw "Impossible!"
        }

        const playerClient = player === 1 ? this.props.player1 : this.props.player2

        console.log("AWAITING")
        await depositEth(playerClient, amount)
        console.log("AWAITED")
        const balances = await getBalance(playerClient)
        const playerBalance = "player" + player + "Balance"
        this.setState({
            ...this.state,
            [playerBalance]: balances,
        })
        console.log("Finished depositing Eth for player", player)
    }

    const handleSubmitWithdrawEth = async (e) => {
        // prevent form submission
        e.preventDefault()
        const player = this.state.selectedPlayer
        const amount = this.state.ethWithdrawAmount

        if (isNaN(amount)) {
            alert("Please specify an integer")
        } else if (amount <= 0) {
            alert("Please specify positive amount")
        }

        if (player !== 1 && player !== 2) {
            throw "Impossible!"
        }

        const playerClient = player === 1 ? this.props.player1 : this.props.player2

        await withdrawEth(playerClient, amount)
        const balances = await getBalance(playerClient)
        const playerBalance = "player" + player + "Balance"
        this.setState({
            ...this.state,
            [playerBalance]: balances,
        })
        console.log("Finished withdrawing Eth for player", player)
    }

    const changePlayer = (e) => {
        var player;
        if (e.target.value === "Player 1") {
            player = 1
        } else if (e.target.value === "Player 2") {
            player = 2
        } else {
            throw "WTF"
        }

        this.setState({
            ...this.state,
            selectedPlayer: player,
        })
    }


    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner + ". Sending eth to " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
        </div>

		<form onSubmit={handleSubmitDepositEth}>
		  <label>
		    Deposit Eth  
		    <input type="text" value={this.state.value} onChange={handleDepositEthChange} />
		  </label>
		  <input type="submit" value="Submit" />
		</form>

        <br />

		<form onSubmit={handleSubmitWithdrawEth}>
		  <label>
		    Withdraw Eth  
		    <input type="text" onChange={handleWithdrawEthChange} />
		  </label>
		  <input type="submit" value="Submit" />
		</form>

        <br />
        <div onChange={changePlayer}>
          <input defaultChecked type="radio" value="Player 1" name="player"/> Player 1
          <input type="radio" value="Player 2" name="player"/> Player 2
        </div>
        <br />

        <div>X is player 1</div>
        Player 1 Address: {this.state.address1}
        <div>
        Free Balance: {this.state.player1Balance && this.state.player1Balance.freeBalance}
        <br />
        Locked Balance: {this.state.player1Balance && this.state.player1Balance.lockedBalance}
        <br />
        Receiving Capacity: {this.state.player1Balance && this.state.player1Balance.receivingCapacity}
        </div>
        <br />
        <div>O is player 2</div>
        Player 2 Address: {this.state.address2}
        <div>
        Free Balance: {this.state.player2Balance && this.state.player2Balance.freeBalance}
        <br />
        Locked Balance: {this.state.player2Balance && this.state.player2Balance.lockedBalance}
        <br />
        Receiving Capacity: {this.state.player2Balance && this.state.player2Balance.receivingCapacity}
        </div>

      </div>
    );
  }
}

// ========================================


async function prepChannels(num, player1, address1, player2, address2) {
    try {
        const cid1 = await player1.openEthChannel(num, num)
        const cid2 = await player2.openEthChannel(num, num)
        console.log("channel id 1:", cid1, "channel id 2:", cid2)
    } catch (e) {
        console.log("Error with prepping channel:", e)
    }
}

async function sendPay(client, destinationAddress, amount) {
  try {
      await client.sendEth(amount, destinationAddress);
      console.log("Sent", amount, "wei to", destinationAddress)
  } catch (e) {
      console.log("error sending eth:", e)
  }
};

async function withdrawEth(client, amount) {
    try {
        await client.withdrawEth(amount)
        console.log("Eth withdrawn!")
    } catch (e) {
        console.log("Error with withdrawing eth", e)
    }
}

async function getBalance(client) {
    try {
        const balances = await client.getEthBalance()
        return balances
    } catch (e) {
        console.log("Error getting balance:", e)
    }
}

async function depositEth(client, amount) {
    try {
        console.log("Depositing", amount, "wei")
        await client.depositEth(amount)
    } catch (e) {
        console.log("Error depositing eth:", e)
    }
    console.log("Deposited eth")
}


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}


