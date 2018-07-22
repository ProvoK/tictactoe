export const ADD_MOVE = 'ADD_MOVE'
export const JUMP_TO = 'JUMP_TO'
export const PREVIOUS_MOVE = 'PREVIOUS_MOVE'
export const NEXT_MOVE = 'NEXT_MOVE'
export const RESTART_GAME = 'RESTART_GAME'

export const addMove = (index, sign) => (
	{ type: ADD_MOVE, index, sign }
)

export const jumpTo = (index) => (
	{ type: JUMP_TO, index }
)

export const previousMove = () => ({ type: PREVIOUS_MOVE })

export const nextMove = () => ({ type: NEXT_MOVE })

export const restartGame = () => ({ type: RESTART_GAME })
