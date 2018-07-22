import * as R from 'ramda'

import {
	ADD_MOVE,
	JUMP_TO,
	PREVIOUS_MOVE,
	NEXT_MOVE,
	RESTART_GAME
} from './actions'

const initialState = {
	nextPlayer: 'X',
	board: Array(9).fill(null),
	moves: [],
	moveIndex: 0
}

const addMove = (state, {sign, index}) => {
	const transform = {
		moves: R.pipe(
			R.take(state.moveIndex),
			R.append({sign, index})
		),
		board: R.update(index, sign),
		moveIndex: R.add(1),
		nextPlayer: (x) => x === 'X' ? 'O' : 'X'
	}
	return R.evolve(transform, state)

}

const isValidIndex = R.curry((index, list) => R.and(
  R.gte(index, 0),
  R.lte(index, R.length(list))
))

const applyMove = (board, move) => R.update(move.index, move.sign, board)

const applyMoves = R.curry((board, moves) => R.reduce(applyMove, board, moves))

const jumpTo = (state, {index}) => {
	return R.ifElse(
		R.pipe(R.prop('moves'), isValidIndex(index)),
		R.evolve({
			moveIndex: () => index,
			nextPlayer: () => index % 2 === 0 ? 'X' : 'O',
			board: () => applyMoves(
				R.clone(initialState.board),
				R.take(index, state.moves)
			)
		}),
		R.identity
	)(state)
}

const previousMove = (state, action) => {
	return jumpTo(state, {index: state.moveIndex - 1})
}

const nextMove = (state, action) => {
	return jumpTo(
		state,
		{
			index: state.moveIndex + 1
		}
	)
}

const restartGame = (state, action) => {
	return R.clone(initialState)
}

const rootReducer = (state = initialState, action) => {
	switch (action.type) {
		case ADD_MOVE:
			return addMove(state, action)
		case JUMP_TO:
			return jumpTo(state, action)
		case PREVIOUS_MOVE:
			return previousMove(state, action)
		case NEXT_MOVE:
			return nextMove(state, action)
		case RESTART_GAME:
			return restartGame(state, action)
		default:
			return state
	}
}

export default rootReducer
