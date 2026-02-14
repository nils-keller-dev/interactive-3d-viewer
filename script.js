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
let pointerDownPosition = undefined;
let willTriggerClick = true;
let distanceX = 0;
let distanceY = 0;
let animationFrameId = null;

document.addEventListener('pointerdown', (event) => {
	pointerDownPosition = { x: event.clientX, y: event.clientY };
	document.body.style.setProperty('--transition-duration', 0);
	document.documentElement.style.setProperty('--cursor', 'grabbing');

	isPointerDown = true;
});

document.addEventListener('pointermove', (event) => {
	if (!isPointerDown) return;

	distanceX = event.clientX - pointerDownPosition?.x;
	distanceY = event.clientY - pointerDownPosition?.y;

	if (calculateDistance(distanceX, distanceY) > 10) {
		willTriggerClick = false;
	}

	if (!animationFrameId) {
		animationFrameId = requestAnimationFrame(() => {
			document.body.style.setProperty(
				'--rotate-x',
				`${-distanceToRotation(distanceY)}deg`,
			);
			document.body.style.setProperty(
				'--rotate-y',
				`${distanceToRotation(distanceX)}deg`,
			);
			animationFrameId = null;
		});
	}
});

document.addEventListener('pointerup', () => {
	pointerDownPosition = undefined;

	resetView();

	if (willTriggerClick) {
		document.body.classList.toggle('disabled');
	}

	willTriggerClick = true;
	distanceX = 0;
	distanceY = 0;
	isPointerDown = false;
});

const calculateDistance = (distanceX, distanceY) =>
	Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));

const distanceToRotation = (distance) =>
	Math.atan(distance / 400) * (180 / Math.PI);

const resetView = () => {
	document.body.style.removeProperty('--transition-duration');
	document.body.style.removeProperty('--rotate-x');
	document.body.style.removeProperty('--rotate-y');
	document.documentElement.style.removeProperty('--cursor');
};
