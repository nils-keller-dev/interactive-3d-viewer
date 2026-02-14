import { updateDebug } from './debug.js';

export const render3DAlbum = (projectName) => {
	const BASE_URL =
		'https://cdn.jsdelivr.net/gh/nils-keller-dev/cdn-resources@latest/images/';

	const generateImageUrl = (name) =>
		`url(${BASE_URL}${projectName}/${name}.webp)`;

	const getShadow = (childIndex, parentIndex, parentImage) => {
		if (!parentImage.classes.length) return parentIndex;

		const indexDelta = childIndex - parentIndex;

		let offset = 0;
		let hasShadow = true;

		for (const count of parentImage.classes) {
			if (indexDelta <= offset + count) {
				return hasShadow ? parentIndex : null;
			}

			offset += count;
			hasShadow = !hasShadow;
		}

		return hasShadow ? parentIndex : null;
	};

	const shadowTemplate = document.createElement('div');
	shadowTemplate.classList.add('shadow');

	const images = [];

	for (const [currentIndex, el] of [...document.querySelectorAll('div')]
		.reverse()
		.entries()) {
		const depth = Number(el.innerText);

		el.style.setProperty('--image', generateImageUrl(el.id));
		el.style.setProperty('--depth', `${depth}em`);

		const currentImage = {
			el,
			name: el.id,
			classes: el.classList.value
				? el.classList.value.split(' ').map(Number)
				: [],
			depth,
		};

		const shadows = [];
		images.forEach((parentImage, parentIndex) => {
			const shadow = getShadow(currentIndex, parentIndex, parentImage);
			shadow !== null && shadows.push(shadow);
		});

		images.push({
			...currentImage,
			shadows,
		});
	}

	images.forEach(({ shadows, el, depth }) =>
		shadows.forEach((shadowIndex) => {
			const shadow = images[shadowIndex];

			const shadowEl = shadowTemplate.cloneNode();
			shadowEl.style.backgroundImage = generateImageUrl(shadow.name);
			shadowEl.style.setProperty('--blur', `${(shadow.depth - depth) / 10}em`);
			el.appendChild(shadowEl);
		}),
	);
};

let isPointerDown = false;
let hasPointerMoved = false;
let hasClickedOnBody = false;

document.addEventListener('pointerdown', (event) => {
	hasClickedOnBody = !!event.target.closest('body');

	isPointerDown = true;
	hasPointerMoved = false;
	logState();
});

document.addEventListener('pointermove', () => {
	if (!isPointerDown) return;
	hasPointerMoved = true;
	logState();
});

document.addEventListener('pointerup', () => {
	if (!hasPointerMoved) {
		document.body.classList.toggle('disabled');
	}

	isPointerDown = false;
	hasPointerMoved = false;
	logState();
});

logState();

function logState() {
	updateDebug({
		isPointerDown,
		hasPointerMoved,
		hasClickedOnBody,
		pointerDownPosition,
	});
}
