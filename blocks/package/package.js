import { createTag } from '../../scripts/scripts.js';

function cardTemplate(
  {
    headline,
    standfirst,
    image,
  },
  index,
  total,
) {
  const first = index === 0;
  const link = headline.querySelector('a');
  if (link) {
    link.classList.add('clickable-area-link');
  }

  const size = 's';
  let col = 12;
  if (!first) {
    col = 12 / (total - 1);
  }

  if (first && image) {
    return `
<article class="card clickable-area grid-col grid-col-8">
  <div class="grid-col grid-col-12 grid-col-${size}">
    ${first ? `<h2>${headline.innerHTML}</h2>` : `<h3>${headline.innerHTML}<h3>`}
    ${standfirst && standfirst.innerText ? `<p class="standfirst">${standfirst.innerText}</p>` : ''}
  </div>
  <div class="grid-col grid-col-4 package__image">
    ${image.outerHTML}
  </div>
</article>`;
  }

  return `
<article class="card clickable-area grid-col grid-col-${col} grid-col-${size}-${col}">
  <div class="grid-col grid-col-12">
    ${first ? `<h2>${headline.innerHTML}</h2>` : `<h3>${headline.innerHTML}<h3>`}
    ${standfirst && standfirst.innerText ? `<p class="standfirst">${standfirst.innerText}</p>` : ''}
  </div>
</article>`;
}

function template({
  heading,
  variants,
  articles,
  image,
}) {
  let col = 4;
  if (variants.includes('medium')) {
    col = 8;
  } else if (variants.includes('large')) {
    col = 12;
  }
  return `
<section class="${variants.join(' ')} grid grid-col-12 grid-col-sm-${col}">
  <h3 class="package-heading">${heading.innerText}</h3>
${articles.map((article, i) => cardTemplate({ image, ...article }, i, articles.length)).join('\n')}
</section>`;
}

/**
 * @param {HTMLDivElement} block
 */
export default function decorate(block) {
  const variants = block.className.split(' ');
  const heading = block.querySelector('h2,h3,h4');
  const articles = [...block.querySelectorAll(':scope > div:not(:first-child) > div')].map((article) => {
    const headline = article.querySelector('h3,h4');
    const image = article.querySelector('picture');
    const standfirst = article.querySelector('p');
    return {
      headline,
      image,
      standfirst,
    };
  });

  const image = block.querySelector('picture');
  const wrapper = block.parentElement;
  wrapper.innerHTML = template({
    image, heading, variants, articles,
  });

  // combine all packages into one section
  const section = document.querySelector('main > div.section.package-container:first-child');
  let packages = section.querySelector(':scope > div.packages');
  if (!packages) {
    section.classList.add('grid');
    packages = createTag('div', { class: 'packages grid-col grid-col-12' });
    section.append(packages);
  }
  wrapper.remove();
  wrapper.classList.add('grid-col-12', 'grid-col-md-8');
  packages.append(wrapper.firstElementChild);

  // cleanup empty sections
  document.querySelectorAll('main > div.section.package-container:not(:first-child)').forEach((sect) => {
    if (!sect.childElementCount) {
      sect.remove();
    }
  });
}
