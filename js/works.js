const worksGrid = document.querySelector('#works-grid');
const tabs = document.querySelectorAll('.works-tab');
const modalBackdrop = document.querySelector('#works-modal-backdrop');
const modalClose = document.querySelector('#modal-close');
const modalContent = document.querySelector('#modal-content');

let projectsData = [];
let lastFocusedCard = null;

const loadWorks = async () => {
  try {
    const response = await fetch('data/works.json');
    if (!response.ok) {
      throw new Error('Failed to load portfolio works.');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

const openModal = (project, sourceCard) => {
  if (!modalBackdrop || !modalContent) return;

  lastFocusedCard = sourceCard;

  const techBadges = (project.techStack || [])
    .map((tech) => `<span class="works-modal__tech-item">${tech}</span>`)
    .join('');

  const featureItems = (project.features || [])
    .map((feature) => `<li>${feature}</li>`)
    .join('');

  modalContent.innerHTML = `
    <div class="works-modal__banner" aria-hidden="true">
      <div class="works-modal__banner-placeholder">
        <span class="preview-bar" style="width: 50%;"></span>
        <span class="preview-box" style="height: 54px;"></span>
        <span class="preview-lines" style="width: 85%;"></span>
      </div>
    </div>

    <div class="works-modal__meta">
      <span class="works-modal__badge">${project.categoryName || 'Design'}</span>
      <span class="works-modal__tag">${project.tag || ''}</span>
      ${project.year ? `<span class="works-modal__dot">&#8226;</span><span class="works-modal__tag">${project.year}</span>` : ''}
      ${project.role ? `<span class="works-modal__dot">&#8226;</span><span class="works-modal__tag">${project.role}</span>` : ''}
    </div>

    <h2 class="works-modal__title" id="modal-title">${project.title}</h2>
    
    <p class="works-modal__description">
      ${project.fullDescription || project.description}
    </p>

    ${
      project.techStack && project.techStack.length
        ? `
      <div class="works-modal__section">
        <h3 class="works-modal__section-title">Tools &amp; Technologies</h3>
        <div class="works-modal__tech-list">${techBadges}</div>
      </div>
    `
        : ''
    }

    ${
      project.features && project.features.length
        ? `
      <div class="works-modal__section">
        <h3 class="works-modal__section-title">Key Highlights &amp; Scope</h3>
        <ul class="works-modal__features">${featureItems}</ul>
      </div>
    `
        : ''
    }

    <div class="works-modal__actions">
      <a href="${project.liveUrl || '#'}" class="works-modal__btn works-modal__btn--primary" target="_blank" rel="noopener noreferrer">
        Live Demo <span aria-hidden="true">&rarr;</span>
      </a>
      <a href="${project.githubUrl || '#'}" class="works-modal__btn works-modal__btn--secondary" target="_blank" rel="noopener noreferrer">
        Project Details <span aria-hidden="true">&rarr;</span>
      </a>
    </div>
  `;

  modalBackdrop.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
  modalClose?.focus();
};

const closeModal = () => {
  if (!modalBackdrop || modalBackdrop.hasAttribute('hidden')) return;

  modalBackdrop.setAttribute('hidden', '');
  document.body.style.overflow = '';

  if (lastFocusedCard) {
    lastFocusedCard.focus();
    lastFocusedCard = null;
  }
};

const attachCardListeners = () => {
  const cards = worksGrid.querySelectorAll('.works-card');
  cards.forEach((card) => {
    const projectId = card.dataset.id;
    const project = projectsData.find((p) => p.id === projectId);

    if (!project) return;

    card.addEventListener('click', () => {
      openModal(project, card);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(project, card);
      }
    });
  });
};

const renderCards = (projects) => {
  if (!worksGrid) return;

  worksGrid.innerHTML = '';

  projects.forEach((project, index) => {
    const card = document.createElement('article');
    card.className = `works-card works-card--${project.color || 'teal'}`;
    card.dataset.category = project.category;
    card.dataset.id = project.id;
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `View details for ${project.title}`);
    card.style.animationDelay = `${(index % 8) * 60 + 100}ms`;

    card.innerHTML = `
      <div class="works-card__media">
        <div class="works-card__placeholder" aria-hidden="true">
          <div class="works-card__wireframe-preview">
            <span class="preview-bar"></span>
            <span class="preview-box"></span>
            <span class="preview-lines"></span>
          </div>
        </div>
      </div>
      <div class="works-card__info">
        <div class="works-card__header">
          <span class="works-card__tag">${project.tag}</span>
          <span class="works-card__category">${project.categoryName}</span>
        </div>
        <h2 class="works-card__title">${project.title}</h2>
        <p class="works-card__desc">${project.description}</p>
      </div>
    `;

    worksGrid.appendChild(card);
  });

  attachCardListeners();
};

const filterWorks = (category) => {
  const cards = worksGrid.querySelectorAll('.works-card');
  cards.forEach((card) => {
    const matches = category === 'all' || card.dataset.category === category;
    if (matches) {
      card.classList.remove('is-hidden');
    } else {
      card.classList.add('is-hidden');
    }
  });
};

const initWorks = async () => {
  projectsData = await loadWorks();

  if (projectsData.length > 0) {
    renderCards(projectsData);
  } else {
    attachCardListeners();
  }

  // Tab switching
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });

      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');

      const category = tab.dataset.category || 'all';
      filterWorks(category);
    });

    // Keyboard support for tabs
    tab.addEventListener('keydown', (e) => {
      let targetTab = null;
      const tabList = Array.from(tabs);
      const currentIndex = tabList.indexOf(tab);

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        targetTab = tabList[(currentIndex + 1) % tabList.length];
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        targetTab = tabList[(currentIndex - 1 + tabList.length) % tabList.length];
      }

      if (targetTab) {
        e.preventDefault();
        targetTab.focus();
        targetTab.click();
      }
    });
  });

  // Modal events
  modalClose?.addEventListener('click', closeModal);

  modalBackdrop?.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop && !modalBackdrop.hasAttribute('hidden')) {
      closeModal();
    }
  });
};

initWorks();
