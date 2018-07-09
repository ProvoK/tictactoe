export const ADD_MOVE = 'ADD_MOVE'
export const JUMP_TO = 'JUMP_TO'

export const addMove = (index, sign) => (
	{ type: ADD_MOVE, index, sign }
)

export const jumpTo = (index) => (
	{ type: JUMP_TO, index }
)
