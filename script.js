const setup3DLayers = (projectName) => {
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
			const depthDifference = shadow.depth - depth;
			shadowEl.style.setProperty('--blur', `${depthDifference / 10}em`);
			shadowEl.style.setProperty('--shadow-offset', `${depthDifference / 3}em`);
			el.appendChild(shadowEl);
		}),
	);
};

const setupRotationControls = () => {
	const ROTATION_SCALE = 400;
	const CLICK_THRESHOLD = 10;

	let pointerDownPosition = null;
	let willTriggerClick = true;
	let animationFrameId = null;

	document.addEventListener('pointerdown', (event) => {
		pointerDownPosition = { x: event.clientX, y: event.clientY };
		document.body.style.setProperty('--transition-duration', 0);
		document.documentElement.style.setProperty('--cursor', 'grabbing');
	});

	document.addEventListener('pointermove', (event) => {
		if (!pointerDownPosition) return;

		const distanceX = event.clientX - pointerDownPosition.x;
		const distanceY = event.clientY - pointerDownPosition.y;

		if (
			willTriggerClick &&
			(exceedsThreshold(distanceX) || exceedsThreshold(distanceY))
		) {
			willTriggerClick = false;
		}

		if (animationFrameId) return;

		animationFrameId = requestAnimationFrame(() => {
			const rotateX = -distanceToRotation(distanceY);
			const rotateY = distanceToRotation(distanceX);
			document.body.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;

			animationFrameId = null;
		});
	});

	document.addEventListener('pointerup', () => {
		resetView();

		if (willTriggerClick) {
			document.body.classList.toggle('disabled');
		}

		pointerDownPosition = null;
		willTriggerClick = true;
	});

	const exceedsThreshold = (distance) => Math.abs(distance) > CLICK_THRESHOLD;

	const distanceToRotation = (distance) =>
		Math.atan(distance / ROTATION_SCALE) * (180 / Math.PI);

	const resetView = () => {
		document.body.style.removeProperty('--transition-duration');
		document.body.style.removeProperty('transform');
		document.documentElement.style.removeProperty('--cursor');
	};
};

export const initializye3DViewer = (projectName) => {
	setup3DLayers(projectName);
	setupRotationControls();
};
