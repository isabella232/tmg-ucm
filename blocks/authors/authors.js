/* eslint-disable no-nested-ternary */

/**
 * @typedef {Object} Author
 * @property {string} name
 * @property {string} url
 * @property {string?} role
 */

/**
 * Make author span string
 *
 * @param {Author} author
 * @param {number} index
 * @param {Author[]} authors
 *
 * @returns {string}
 */
function makeAuthor(author, index, authors) {
  const url = new URL(author.url);
  return `\
<span class="byline__meta" itemscope="" itemtype="https://schema.org/Person" itemprop="author">
  <a href="${url.pathname}" itemprop="url" class="e-byline__link" data-test="byline-link" rel="author">
    <span class="byline__bytext">${index === 0 ? 'By' : index === authors.length - 1 ? ' and ' : ', '}</span>
    <span class="byline__author" data-test="author-name" itemprop="name" content="${author.name}">${author.name}${author.role ? ', ' : ''}</span>
  </a>\
  ${author.role ? `
  <span class="byline__job-title" itemprop="jobTitle">${author.role}</span>` : ''}
</span>`;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const date = `${d.getDate()} ${d.toLocaleDateString('en-uk', { year: 'numeric', month: 'long' })}`;
  const time = d.toLocaleTimeString('en-uk', { hour12: true, hour: '2-digit', minute: '2-digit' });
  return `${date} • ${time}`;
}

/** @type {(block: HTMLDivElement) => any} */
export default function decorate(block) {
  const authorDivs = [...block.children];
  const authors = authorDivs.map((aDiv) => {
    const nameLink = aDiv.querySelector('a');
    const roleDiv = aDiv.childNodes.length > 1 ? aDiv.querySelectorAll(':scope > div')[1] : undefined;
    return {
      name: nameLink.innerText,
      url: nameLink.href,
      role: roleDiv ? roleDiv.innerText?.trim() : undefined,
    };
  });

  const publishedAt = document.head.querySelector('[name~=publication-date][content]').content;

  block.innerHTML = `\
<div class="byline-date">
  <div class="e-byline">
    <span class="byline">
      ${authors.map(makeAuthor).join('    \n')}
    </span>
  </div>
  <time class="e-published-date u-meta " itemprop="datePublished" datetime="${publishedAt}" data-test="time">
    ${formatDate(publishedAt)}
  </time>
</div>
`;
}
