let lastLoggedState = null;

export const updateDebug = (state) => {
	const currentState = JSON.stringify(state);

	if (currentState !== lastLoggedState) {
		console.clear();
		console.log('isPointerDown:', state.isPointerDown);
		console.log('hasPointerMoved:', state.hasPointerMoved);
		console.log('hasClickedOnBody:', state.hasClickedOnBody);
		console.log('pointerDownPosition:', state.pointerDownPosition);
		lastLoggedState = currentState;
	}
};
