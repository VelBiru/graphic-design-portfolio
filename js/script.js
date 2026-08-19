// Portfolio interactions go here.

const serviceDetails = document.querySelector('#service-details');

if (serviceDetails) {
	const serviceData = await fetch('data/services.json').then((response) => {
		if (!response.ok) {
			throw new Error('Unable to load service data.');
		}

		return response.json();
	});

	const title = document.querySelector('#service-details-title');
	const skills = document.querySelector('#service-skills');
	const tools = document.querySelector('#service-tools');
	const cards = document.querySelectorAll('.service-card');
	const toggles = document.querySelectorAll('.service-card__toggle');
	const connectors = document.querySelectorAll('.service-connectors span');

	const selectService = (card) => {
		const toggle = card.querySelector('.service-card__toggle');
		const data = serviceData[card.dataset.service];
		const isOpen = !serviceDetails.hidden && toggle.getAttribute('aria-expanded') === 'true';

		toggles.forEach((button) => {
			button.setAttribute('aria-expanded', 'false');
		});
		document.querySelectorAll('.service-card').forEach((serviceCard) => {
			serviceCard.classList.remove('is-active');
		});
		connectors.forEach((connector) => {
			connector.classList.remove('is-active');
		});

		if (isOpen) {
			serviceDetails.hidden = true;
			return;
		}

		title.textContent = data.title;
		skills.replaceChildren(...data.skills.map((skill) => {
			const item = document.createElement('li');
			item.textContent = skill;
			return item;
		}));
		tools.replaceChildren(...data.tools.map((tool) => {
			const item = document.createElement('li');
			item.textContent = tool;
			return item;
		}));
		toggle.setAttribute('aria-expanded', 'true');
		card.classList.add('is-active');
		connectors[[...document.querySelectorAll('.service-card')].indexOf(card)].classList.add('is-active');
		serviceDetails.hidden = false;
		serviceDetails.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
	};

	cards.forEach((card) => {
		card.addEventListener('click', () => selectService(card));
		card.addEventListener('keydown', (event) => {
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				selectService(card);
			}
		});
	});

	toggles.forEach((toggle) => {
		toggle.addEventListener('click', (event) => {
			event.stopPropagation();
			selectService(toggle.closest('.service-card'));
		});
	});
}

document.querySelectorAll('.work-card').forEach((card) => {
	const trigger = card.querySelector('.work-card__trigger');

	trigger.addEventListener('click', () => {
		const isOpen = card.classList.toggle('is-open');
		trigger.setAttribute('aria-expanded', String(isOpen));
	});
});
