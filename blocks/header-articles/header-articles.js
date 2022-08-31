import { createTag } from '../../scripts/scripts.js';

/**
 * @param {HTMLDivElement} block
 */
export default function decorate(block) {
  const articles = block.querySelectorAll(':scope > div');
  block.remove();

  document.addEventListener('loaded-header', () => {
    const nav = document.querySelector('body > header div.header nav');
    nav.classList.add('h-articles');
    const container = createTag('div', { class: 'h-articles-wrapper' });
    nav.append(container);
    articles.forEach((article) => {
      article.classList.add('h-article');
      container.append(article);
    });
  });
}
