import * as R from 'ramda'

import { ADD_MOVE, JUMP_TO } from './actions'

const initialState = {
	index: 0,
	history: [Array(9).fill(null)],
	nextPlayer: 'X'
}

const addMove = (state, action) => {
	const transform = {
		history: R.pipe(
			R.slice(0, state.index + 1),
			R.append(R.update(action.index, action.sign, R.nth(state.index, state.history)))
		),
		index: R.add(1),
		nextPlayer: (x) => R.equals(x, 'X') ? 'O' : 'X'
	}
	return R.evolve(transform, state)

}

const jumpTo = (state, action) => {
	const index = action.index
	if (index >= 0 && index <= state.history.length) {
		return R.merge(
			state,
			{
				index: action.index,
				nextPlayer: action.index % 2 === 0 ? 'X' : 'O'
			}
		)
	} else {
		return state
	}
}

const rootReducer = (state = initialState, action) => {
	switch (action.type) {
		case ADD_MOVE:
			return addMove(state, action)
		case JUMP_TO:
			return jumpTo(state, action)
		default:
			return state
	}
}

export default rootReducer
