export const ADD_MOVE = 'ADD_MOVE'
export const JUMP_TO = 'JUMP_TO'

export const addMove = (position, sign) => (
	{ type: ADD_MOVE, position, sign }
)

export const jumpTo = (index) => (
	{ type: JUMP_TO, index }
)
