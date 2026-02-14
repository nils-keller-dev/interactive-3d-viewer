let lastLoggedState = null;

export const updateDebug = (state) => {
	const currentState = JSON.stringify(state);

	if (currentState !== lastLoggedState) {
		console.clear();
		// console.log('isPointerDown:', state.isPointerDown);
		// console.log('hasPointerMoved:', state.hasPointerMoved);
		// console.log('hasClickedOnBody:', state.hasClickedOnBody);
		// console.log('pointerDownPosition:', state.pointerDownPosition);
		for (const [key, value] of Object.entries(state)) {
			console.log(`${key}:`, value);
		}
		lastLoggedState = currentState;
	}
};
