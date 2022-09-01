import { getIcon, getMetadata, toClassName } from '../../scripts/scripts.js';

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
function templateAuthor(author, index, authors) {
  const url = new URL(author.url);
  /* eslint-disable no-nested-ternary */
  return `\
<span class="byline-meta" itemscope="" itemtype="https://schema.org/Person" itemprop="author">
  <a href="${url.pathname}" itemprop="url" class="e-byline__link" data-test="byline-link" rel="author">
    <span class="bytext">${index === 0 ? 'By' : index === authors.length - 1 ? ' and ' : ', '}</span>
    <span class="author" data-test="author-name" itemprop="name" content="${author.name}">${author.name}${author.role ? ', ' : ''}</span>
  </a>\
  ${author.role ? `
  <span class="byline__job-title" itemprop="jobTitle">${author.role}</span>` : ''}
</span>`;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const date = `${d.getDate()} ${d.toLocaleDateString([], { year: 'numeric', month: 'long' })}`;
  window.cdate = d;

  const time = d.toLocaleTimeString('en-uk', {
    hour12: true, hour: 'numeric', minute: '2-digit', timeZone: 'Europe/London',
  });
  return `${date} • ${time}`;
}

function templateHeadline(h1) {
  return `
<div class="article-headline"><h1 class="headline">${h1.innerText}</p></div>`;
}

function templateStandfirst(p) {
  return `
<div class="article-standfirst"><p class="standfirst">${p.innerText}</p></div>`;
}

/**
 * @param {HTMLDivElement} authorsDiv
 * @returns {string}
 */
function templateByline(authorsDiv) {
  const authorDivs = [...authorsDiv.children];
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

  return `\
<div class="byline-date">
  <div class="byline">
    <span class="byline">
      ${authors.map(templateAuthor).join('    \n')}
    </span>
  </div>
  <time class="published-date" itemprop="datePublished" datetime="${publishedAt}" data-test="time">
    ${formatDate(publishedAt)}
  </time>
</div>
`;
}

function templateRelatedTag(tag) {
  return `<li><a href="/${toClassName(tag)}/">${tag}</a></li>`;
}

function templateSocials(headline) {
  const url = encodeURIComponent(window.location.href);
  const content = encodeURIComponent(headline);
  return `
<ul>
<li>
<a href="https://twitter.com/intent/tweet?url=${url};text=${content}" class="share-link" target="_blank" rel="nofollow noopener" aria-label="Share on twitter">
${getIcon('twitter')}
</a>
</li>
  <li>
    <a href="https://www.facebook.com/sharer.php?u=${url}" class="share-link" target="_blank" rel="nofollow noopener" aria-label="Share on facebook">
      ${getIcon('facebook')}
    </a>
  </li>
  <li>
    <a href="https://wa.me?text=${url}" class="share-link" target="_blank" rel="nofollow noopener" aria-label="Share on whatsapp">
      ${getIcon('whatsapp')}
    </a>
  </li>
  <li>
    <a href="mailto:?to=&subject=${content}&body=${url}" class="share-link" target="_blank" rel="nofollow noopener" aria-label="Share on email">
      ${getIcon('email')}
    </a>
  </li>
</ul>`;
}

function templateMeta(tags, headline) {
  return `\
<div class="article-meta-wrapper">
  <aside class="article-meta">
    <div class="article-related">
      <ul>
        ${tags.map(templateRelatedTag).join(', ')}
      </ul>
    </div>
    <div class="article-share">
      ${templateSocials(headline)}
    </div>
  </aside>
</div>`;
}

function templateBodyImage(picture, caption, credit) {
  return `
<div class="article-feature-image">
  <figure>
    ${picture.outerHTML}
    <figcaption>
      ${caption} | <span class="credit">${credit}</span>
    </figcaption>
  </figure>
</div>`;
}

function template({
  headline,
  standfirst,
  byline,
  bodyImage,
  related,
}) {
  return `
${headline}
${standfirst}
${byline}
${related}
${bodyImage}`;
}

/**
 * @param {HTMLDivElement} block
 */
export default function decorate(block) {
  const h1 = block.querySelector('h1');
  const headline = templateHeadline(h1);
  h1.remove();

  const p = block.querySelector('p');
  const standfirst = templateStandfirst(p);
  p.remove();

  const picture = block.querySelector('picture');
  let caption;
  let credit;
  if (picture) {
    caption = picture.nextElementSibling;
    if (caption) {
      credit = caption.querySelector('em');
      if (credit) {
        credit.remove();
        credit = credit.innerText;
      }
      caption.remove();
      caption = caption.innerText;
    }
    picture.remove();
  }
  const bodyImage = templateBodyImage(picture, caption, credit);

  const authorsDiv = block.querySelector('.authors');
  const byline = templateByline(authorsDiv);
  authorsDiv.remove();

  const tags = getMetadata('article:tag');
  const related = templateMeta(tags.split(', '), h1.innerText);

  block.innerHTML = template({
    headline, standfirst, byline, bodyImage, related,
  });
}
