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
		selectedPanel.setAttribute('tabindex', '-1');
		selectedPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
		selectedPanel.focus({ preventScroll: true });
	});
});

const loadData = async (path) => {
	const response = await fetch(path);

	if (!response.ok) {
		throw new Error(`Unable to load ${path}.`);
	}

	return response.json();
};

const [serviceData, approachData, timelineData, philosophyData, toolsSkillsData] = await Promise.all([
	loadData('data/services.json'),
	loadData('data/approach.json'),
	loadData('data/timeline.json'),
	loadData('data/philosophy.json'),
	loadData('data/toolsskills.json')
]);

const serviceList = document.querySelector('.service-list');
const skillsTools = document.querySelector('.skills-tools');
const skillsList = document.querySelector('[data-skills-list]');
const toolsList = document.querySelector('[data-tools-list]');
const approachSteps = document.querySelector('[data-steps-list="approach"]');
const philosophySteps = document.querySelector('#philosophy-steps');
const iconTemplates = {
	uiux: '<rect x="3" y="4" width="18" height="16" rx="2"></rect><path d="M3 9h18M8 4v5"></path><path d="M7 13h4M7 16h7"></path>',
	graphic: '<path d="M12 3 4 7v10l8 4 8-4V7l-8-4Z"></path><path d="m4 7 8 4 8-4M12 11v10"></path><path d="m8 5 8 4"></path>',
	visual: '<circle cx="12" cy="12" r="8.5"></circle><path d="M12 3.5v17M3.5 12h17M6 6l12 12M18 6 6 18"></path>'
};

if (serviceList) {
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
				</div>
			`;
			return card;
		}));
}

const toolIconTemplates = {
	'Figma': '<circle cx="12" cy="5" r="2.5"></circle><circle cx="9.5" cy="9.5" r="2.5"></circle><circle cx="14.5" cy="9.5" r="2.5"></circle><circle cx="9.5" cy="14.5" r="2.5"></circle><path d="M12 17v2.5a2.5 2.5 0 1 1-2.5-2.5Z"></path>',
	'HTML': '<path d="m5 4 2 16 5 1 5-1 2-16H5Z"></path><path d="M8.5 8h7M9 12h6.5M9.5 16h5"></path>',
	'CSS': '<path d="m5 4 2 16 5 1 5-1 2-16H5Z"></path><path d="M8 8h8M8.5 12h7M9 16h6"></path>',
	'JavaScript': '<path d="M5 5h14v14H5z"></path><path d="M9 9v4.5a1.5 1.5 0 0 1-2 1.4M13 14.5c.5.5 1.1.7 1.8.7 1.7 0 2.2-1.7.7-2.4l-1.2-.5c-1.5-.6-1-2.4.6-2.4.8 0 1.4.3 1.8.8"></path>',
	'Tailwind CSS': '<path d="M5 9c1.4-2.7 4.1-2.7 5.5 0 1.4 2.7 4.1 2.7 5.5 0M5 15c1.4-2.7 4.1-2.7 5.5 0 1.4 2.7 4.1 2.7 5.5 0"></path>',
	'React': '<circle cx="12" cy="12" r="1.5"></circle><ellipse cx="12" cy="12" rx="8" ry="3.5"></ellipse><ellipse cx="12" cy="12" rx="8" ry="3.5" transform="rotate(60 12 12)"></ellipse><ellipse cx="12" cy="12" rx="8" ry="3.5" transform="rotate(120 12 12)"></ellipse>',
	'Adobe Photoshop': '<path d="M5 5h14v14H5z"></path><path d="M8.5 16V9h2.2a2.4 2.4 0 0 1 0 4.8H8.5M14 16v-4.4M14 11.6c.5-.5 1.8-.7 2.3.2.5.9-.2 1.4-1 1.7-1 .3-1.5.9-.8 1.7.5.5 1.5.5 2.1 0"></path>',
	'Adobe Illustrator': '<path d="M5 5h14v14H5z"></path><path d="m9 16 3-8 3 8M10 13.5h4M16 10v6"></path>',
	'Canva': '<circle cx="12" cy="12" r="7"></circle><path d="M15 9.5c-.7-.6-1.5-.9-2.5-.9-2 0-3.5 1.5-3.5 3.5s1.5 3.5 3.5 3.5c1 0 1.8-.3 2.5-.9"></path>',
	'CapCut': '<path d="M5 7h14M5 17h14M7 5l10 14M17 5 7 19"></path>'
};

if (skillsList) {
	skillsList.replaceChildren(...toolsSkillsData.skills.map((skill) => {
		const item = document.createElement('div');
		item.className = 'skills-tools__item';
		item.textContent = skill;
		return item;
	}));
}

if (toolsList) {
	toolsList.replaceChildren(...toolsSkillsData.tools.map((tool) => {
		const item = document.createElement('div');
		item.className = 'skills-tools__item skills-tools__item--tool';
		item.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${toolIconTemplates[tool]}</svg><span>${tool}</span>`;
		return item;
	}));
}

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
			const stepItem = trigger.closest('.step-item');

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
			stepItem.classList.toggle('is-open', !isOpen);
			stepItem.scrollIntoView({ behavior: 'smooth', block: 'start' });
			trigger.focus({ preventScroll: true });
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
if (skillsTools) {
	setupAccordion(skillsTools);
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
			trigger.focus({ preventScroll: true });
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

document.querySelectorAll('.work-card').forEach((card) => {
	const trigger = card.querySelector('.work-card__trigger');

	trigger.addEventListener('click', () => {
		const isOpen = card.classList.toggle('is-open');
		trigger.setAttribute('aria-expanded', String(isOpen));
		card.scrollIntoView({ behavior: 'smooth', block: 'start' });
		trigger.focus({ preventScroll: true });
	});
});
