const worksGrid = document.querySelector('#works-grid');
const tabs = document.querySelectorAll('.works-tab');

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

const renderCards = (projects) => {
  if (!worksGrid) return;

  worksGrid.innerHTML = '';

  projects.forEach((project, index) => {
    const card = document.createElement('article');
    card.className = `works-card works-card--${project.color}`;
    card.dataset.category = project.category;
    card.dataset.id = project.id;
    card.tabIndex = 0;
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
  const projects = await loadWorks();
  renderCards(projects);

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
};

initWorks();
