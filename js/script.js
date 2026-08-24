// Portfolio interactions go here.

const serviceDetails = document.querySelector('#service-details');

const aboutTabs = document.querySelectorAll('.about-section-tabs__button');
const aboutPanels = document.querySelectorAll('.about-panel');

const resetAboutPanelState = () => {
	document.querySelectorAll('.step-item__trigger[aria-controls]').forEach((trigger) => {
		const description = document.querySelector(`#${trigger.getAttribute('aria-controls')}`);

		trigger.setAttribute('aria-expanded', 'false');
		description.hidden = true;
		trigger.closest('.step-item').classList.remove('is-open');
	});

	document.querySelectorAll('.timeline-card__trigger').forEach((trigger) => {
		trigger.setAttribute('aria-expanded', 'false');
		trigger.closest('.timeline-card').classList.remove('is-open');
	});
	document.querySelector('.timeline-grid')?.removeAttribute('hidden');
	document.querySelector('#timeline-details')?.setAttribute('hidden', '');

	serviceDetails?.setAttribute('hidden', '');
	document.querySelectorAll('.service-card__toggle').forEach((toggle) => {
		toggle.setAttribute('aria-expanded', 'false');
	});
	document.querySelectorAll('.service-card').forEach((card) => {
		card.classList.remove('is-active');
	});
	document.querySelectorAll('.service-connectors span').forEach((connector) => {
		connector.classList.remove('is-active');
	});
};

aboutTabs.forEach((tab) => {
	tab.addEventListener('click', () => {
		const selectedPanel = document.querySelector(`#about-panel-${tab.dataset.aboutTab}`);
		resetAboutPanelState();

		aboutTabs.forEach((button) => {
			button.classList.toggle('is-active', button === tab);
			button.setAttribute('aria-selected', String(button === tab));
		});
		aboutPanels.forEach((panel) => {
			panel.hidden = panel !== selectedPanel;
			panel.classList.remove('is-active');
		});
		selectedPanel.classList.add('is-active');
	});
});

if (serviceDetails) {
	const loadData = async (path) => {
		const response = await fetch(path);

		if (!response.ok) {
			throw new Error(`Unable to load ${path}.`);
		}

		return response.json();
	};
	const [serviceData, approachData, timelineData, philosophyData] = await Promise.all([
		loadData('data/services.json'),
		loadData('data/approach.json'),
		loadData('data/timeline.json'),
		loadData('data/philosophy.json')
	]);
	const serviceList = document.querySelector('.service-list');
	const approachSteps = document.querySelector('[data-steps-list="approach"]');
	const philosophySteps = document.querySelector('#philosophy-steps');
	const iconTemplates = {
		uiux: '<rect x="3" y="4" width="18" height="16" rx="2"></rect><path d="M3 9h18M8 4v5"></path><path d="M7 13h4M7 16h7"></path>',
		graphic: '<path d="M12 3 4 7v10l8 4 8-4V7l-8-4Z"></path><path d="m4 7 8 4 8-4M12 11v10"></path><path d="m8 5 8 4"></path>',
		visual: '<circle cx="12" cy="12" r="8.5"></circle><path d="M12 3.5v17M3.5 12h17M6 6l12 12M18 6 6 18"></path>'
	};

	serviceList.replaceChildren(...Object.entries(serviceData)
		.map(([key, data]) => {
			const card = document.createElement('article');
			card.className = 'service-card';
			card.dataset.service = key;
			card.tabIndex = 0;
			card.innerHTML = `
				<div class="service-card__icon" aria-hidden="true">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${iconTemplates[data.icon]}</svg>
				</div>
				<div>
					<h3>${data.title}</h3>
					<p>${data.description}</p>
					<button class="service-card__toggle" type="button" aria-expanded="false" aria-controls="service-details">Click to Show Skills <span aria-hidden="true">&rarr;</span></button>
				</div>
			`;
			return card;
		}));

	const renderSteps = (container, items, variant) => {
		const isQuoteList = variant === 'quotes';
		const itemClass = isQuoteList ? 'step-item step-item--quote' : 'step-item';

		container.replaceChildren(...items.map((item, index) => {
		const article = document.createElement('article');
			const contentId = `${container.id || container.dataset.stepsList}-step-${index + 1}`;
			article.className = itemClass;
			article.innerHTML = isQuoteList ? `
				<button class="step-item__trigger" type="button" aria-expanded="false" aria-controls="${contentId}">
					<strong>${item.title}</strong><span class="step-item__icon" aria-hidden="true">+</span>
				</button>
				<div class="step-item__description" id="${contentId}" hidden>
					<strong>${item.name}</strong><p class="step-item__quote">${item.qoute}</p>
				</div>
			` : `
				<button class="step-item__trigger" type="button" aria-expanded="false" aria-controls="${contentId}">
					<span>${item.number}</span><strong>${item.title}</strong><span class="step-item__icon" aria-hidden="true">+</span>
				</button>
				<div class="step-item__description" id="${contentId}" hidden><p>${item.description}</p></div>
			`;
		return article;
		}));
	};

	renderSteps(approachSteps, approachData, 'approach');
	if (philosophySteps) renderSteps(philosophySteps, philosophyData, 'quotes');

	const setupAccordion = (container) => {
		const triggers = container.querySelectorAll('.step-item__trigger[aria-controls]');

		const reset = () => {
			triggers.forEach((trigger) => {
				const description = document.querySelector(`#${trigger.getAttribute('aria-controls')}`);

				trigger.setAttribute('aria-expanded', 'false');
				description.hidden = true;
				trigger.closest('.step-item').classList.remove('is-open');
			});
		};

		triggers.forEach((trigger) => {
			trigger.addEventListener('click', () => {
				const description = document.querySelector(`#${trigger.getAttribute('aria-controls')}`);
				const isOpen = trigger.getAttribute('aria-expanded') === 'true';

				triggers.forEach((otherTrigger) => {
					const otherDescription = document.querySelector(`#${otherTrigger.getAttribute('aria-controls')}`);

					if (otherTrigger !== trigger) {
						otherTrigger.setAttribute('aria-expanded', 'false');
						otherDescription.hidden = true;
						otherTrigger.closest('.step-item').classList.remove('is-open');
					}
				});

				trigger.setAttribute('aria-expanded', String(!isOpen));
				description.hidden = isOpen;
				trigger.closest('.step-item').classList.toggle('is-open', !isOpen);
			});
		});

		container.addEventListener('focusout', (event) => {
			if (!container.contains(event.relatedTarget)) {
				reset();
			}
		});
	};

	setupAccordion(approachSteps);
	if (philosophySteps) {
		setupAccordion(philosophySteps);
	}

	const timelineGrid = document.querySelector('.timeline-grid');
	const timelineDetails = document.querySelector('#timeline-details');
	const timelineDetailsTitle = document.querySelector('#timeline-details-title');
	const timelineDetailsSubtitle = document.querySelector('#timeline-details-subtitle');
	const timelineDetailsEntries = document.querySelector('#timeline-details-entries');
	const timelineDetailsBack = document.querySelector('#timeline-details-back');

	if (timelineGrid && timelineDetails && timelineDetailsEntries) {
		let selectedTimelineCard;

		document.querySelectorAll('.timeline-card__trigger').forEach((trigger) => {
			trigger.addEventListener('click', () => {
				const selectedTimelineData = timelineData[trigger.dataset.timelineKey];
				selectedTimelineCard = trigger.closest('.timeline-card');
				timelineDetailsTitle.textContent = selectedTimelineData.title;
				timelineDetailsSubtitle.textContent = selectedTimelineData.subtitle;
				timelineDetailsEntries.replaceChildren(...selectedTimelineData.entries.map((entry) => {
					const row = document.createElement('div');
					row.className = 'timeline-details__entry';
					row.innerHTML = `
						<div class="timeline-details__meta">
							<div class="timeline-details__entry-title">
								<strong>${entry.title}</strong>
								<span class="timeline-details__year">${entry.year}</span>
							</div>
							<div class="timeline-details__major">${entry.major}</div>
						</div>
						<div class="timeline-details__marker" aria-hidden="true"><span></span></div>
						<div class="timeline-details__description"><p>${entry.description}</p></div>
					`;
					return row;
				}));
				timelineGrid.hidden = true;
				timelineDetails.hidden = false;
				selectedTimelineCard.classList.add('is-open');
				trigger.setAttribute('aria-expanded', 'true');
				timelineDetails.scrollIntoView({ behavior: 'smooth', block: 'start' });
				timelineDetailsBack.focus({ preventScroll: true });
			});
		});

		timelineDetailsBack.addEventListener('click', () => {
			timelineDetails.hidden = true;
			timelineGrid.hidden = false;
			selectedTimelineCard?.classList.remove('is-open');
			selectedTimelineCard?.querySelector('.timeline-card__trigger').setAttribute('aria-expanded', 'false');
			selectedTimelineCard?.querySelector('.timeline-card__trigger').focus();
		});
	}

	const title = document.querySelector('#service-details-title');
	const skills = document.querySelector('#service-skills');
	const tools = document.querySelector('#service-tools');
	const cards = [...document.querySelectorAll('.service-card')];
	const toggles = document.querySelectorAll('.service-card__toggle');
	const connectors = document.querySelectorAll('.service-connectors span');

	const selectService = (card) => {
		const toggle = card.querySelector('.service-card__toggle');
		const data = serviceData[card.dataset.service];
		const isOpen = !serviceDetails.hidden && toggle.getAttribute('aria-expanded') === 'true';

		toggles.forEach((button) => {
			button.setAttribute('aria-expanded', 'false');
		});
		cards.forEach((serviceCard) => {
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
		connectors[cards.indexOf(card)].classList.add('is-active');
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
