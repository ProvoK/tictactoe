import { createStore } from "redux"
import { devToolsEnhancer } from 'redux-devtools-extension';

import rootReducer from "./reducers"

function Store(debug) {
	if (debug) {
		return createStore(rootReducer, devToolsEnhancer())
	} else {
		return createStore(rootReducer)
	}
}

const store = Store(true)

export default store
