import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import * as R from 'ramda'

import { connect } from 'react-redux'

import { addMove, jumpTo } from './actions'


function calculateWinner(board) {
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
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]
    }
  }
  return null
}

const Square = R.curry(({onClick, board}, i) => (
	<button className="square" onClick={() => onClick(i)}>
		{board[i]}
	</button>
))

const BoardRow = ({onClick, board, indexes}) => {
	const squareComponents = R.map(Square({onClick, board}), indexes)
	return <div className="board-row"> {squareComponents } </div>
}

const Board = ({onClick, board}) => (
	<div>
		<BoardRow board={board} onClick={onClick} indexes={R.range(0, 3)} />
		<BoardRow board={board} onClick={onClick} indexes={R.range(3, 6)} />
		<BoardRow board={board} onClick={onClick} indexes={R.range(6, 9)} />
	</div>
)

const gameStateToProps = state => {
	return {
		history: state.history,
		board: state.history[state.index],
		player: state.nextPlayer
	}
}

const gameDispatchToProps = dispatch => {
	return {
		addMove: (index, player) => dispatch(addMove(index, player)),
		jumpTo: (index) => dispatch(jumpTo(index))
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props)
	}

	handleClick(i) {
		if (calculateWinner(this.props.board) || this.props.board[i]) {
			return
		}

		this.props.addMove(i, this.props.player)
	}

	jumpTo(step) {
		this.props.jumpTo(step)
	}

	render() {
		const winner = calculateWinner(this.props.board)

		const moves = R.init(this.props.history).map((_, index) => {
			const desc = index ? `Go to move # ${index}` : 'Go to start'
			return (
				<li key={index}>
					<button onClick={() => this.jumpTo(index)}>{desc}</button>
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
						board={this.props.board}
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

const ConnectedGame = connect(gameStateToProps, gameDispatchToProps)(Game)

const App = () => <ConnectedGame />

export default App
