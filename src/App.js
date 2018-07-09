import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import * as R from 'ramda'

import { connect } from 'react-redux'

import { addMove, jumpTo } from './actions'


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

const Square = R.curry(({onClick, squares}, i) => (
	<button className="square" onClick={() => onClick(i)}>
		{squares[i]}
	</button>
))

const BoardRow = ({onClick, squares, indexes}) => {
	const squareComponents = R.map(Square({onClick, squares}), indexes)
	return <div className="board-row"> {squareComponents } </div>
}

const Board = ({onClick, squares}) => (
	<div>
		<BoardRow squares={squares} onClick={onClick} indexes={R.range(0, 3)} />
		<BoardRow squares={squares} onClick={onClick} indexes={R.range(3, 6)} />
		<BoardRow squares={squares} onClick={onClick} indexes={R.range(6, 9)} />
	</div>
)

const mapStateToProps = state => {
	return {
		history: state.history,
		squares: state.history[state.stepNumber],
		player: state.nextSign
	}
}

const mapDispatchToProps = dispatch => {
	return {
		addMove: (pos, player) => dispatch(addMove(pos, player)),
		jumpTo: (index) => dispatch(jumpTo(index))
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props)
	}

	handleClick(i) {
		if (calculateWinner(this.props.squares) || this.props.squares[i]) {
			return
		}

		this.props.addMove(i, this.props.player)
	}

	jumpTo(step) {
		this.props.jumpTo(step)
	}

	render() {
		const winner = calculateWinner(this.props.squares)

		const moves = R.init(this.props.history).map((step, move) => {
			const desc = move ? `Go to move # ${move}` : 'Go to start'
			return (
				<li key={move}>
					<button onClick={() => this.jumpTo(move)}>{desc}</button>
				</li>
			)
		})

		let status
		if (winner) {
			status = 'Winner: ' + winner
		} else {
			status = 'Next player: ' + (this.props.player)
		}
		return (
			<div className="game">
				<div className="game-board">
					<Board
						squares={this.props.squares}
						onClick={(i) => this.handleClick(i)}
					/>
				</div>
				<div className="game-info">
					<div>{status}</div>
					<ol>{moves}</ol>
				</div>
			</div>
		)
	}
}

const ConnectedGame = connect(mapStateToProps, mapDispatchToProps)(Game)

const App = () => <ConnectedGame />

export default App
