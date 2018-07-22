import React from 'react'
import './App.css'
import * as R from 'ramda'

import { connect } from 'react-redux'

import { addMove, jumpTo, previousMove, restartGame } from './actions'


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
		history: state.moves,
		board: state.board,
		player: state.nextPlayer
	}
}

const gameDispatchToProps = dispatch => {
	return {
		addMove: (index, player) => dispatch(addMove(index, player)),
		jumpTo: (index) => dispatch(jumpTo(index)),
		restartGame: () => dispatch(restartGame()),
		previousMove: () => dispatch(previousMove())
	}
}

const LeftControlPanel = ({previousMove, restartGame}) => (
	<div class="tile is-vertical is-child">
		<div className="button" onClick={previousMove}>Back One</div>
		<div className="button" onClick={restartGame}>Restart game</div>
	</div>
)

class Game extends React.Component {
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

		const moves = R.clone(this.props.history).map((_, index) => {
			const desc = index ? `Go to move # ${index}` : 'Go to start'
			return (
				<button
					key={index}
					className="button"
					onClick={() => this.jumpTo(index)}
				>{desc}</button>
			)
		})

		let status
		if (winner) {
			status = `${this.props.player} wins!!!!`
		} else {
			status = `${this.props.player} turn`
		}
		return (
			<div className="tile is-ancestor">
				<div className="tile is-parent">
					<div className="tile is-parent is-2">
						<LeftControlPanel
							previousMove={this.props.previousMove}
							restartGame={this.props.restartGame}
						/>
					</div>
					<div className="tile is-4 is-parent is-vertical">
						<div className="tile title">{status}</div>
						<div className="tile game-board">
							<Board
								board={this.props.board}
								onClick={(i) => this.handleClick(i)}
							/>
						</div>
					</div>
					<div className="tile is-parent is-2">
						<ol>{moves}</ol>
					</div>
				</div>
			</div>
		)
	}
}

const ConnectedGame = connect(gameStateToProps, gameDispatchToProps)(Game)

const App = () => <ConnectedGame />

export default App
