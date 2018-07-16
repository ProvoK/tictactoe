import * as R from 'ramda'

import {
	ADD_MOVE,
	JUMP_TO,
	PREVIOUS_MOVE,
	RESTART_GAME
} from './actions'

const initialState = {
	index: 0,
	history: [Array(9).fill(null)],
	nextPlayer: 'X'
}

const duplicateLast = (l) => R.append(R.last(l), l)
const updateLastAt = R.curry((item, index, l) => (
  R.update(l.length - 1, R.update(index, item, R.last(l)), l)
))

const addMove = (state, action) => {
	const transform = {
		history: R.pipe(
			R.take(state.index + 1),
			duplicateLast,
			updateLastAt(action.sign, action.index)
		),
		index: R.add(1),
		nextPlayer: (x) => x === 'X' ? 'O' : 'X'
	}
	return R.evolve(transform, state)

}

const isValidIndex = R.curry((index, list) => R.and(
  R.gte(index, 0),
  R.lt(index, R.length(list))
))

const jumpTo = (state, {index}) => {
	return R.ifElse(
		R.pipe(R.prop('history'), isValidIndex(index)),
		R.evolve({
			index: () => index,
			nextPlayer: () => index % 2 === 0 ? 'X' : 'O'
		}),
		R.identity
	)(state)
}

const previousMove = (state, action) => {
	return jumpTo(state, {index: state.index - 1})
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
		case RESTART_GAME:
			return restartGame(state, action)
		default:
			return state
	}
}

export default rootReducer
