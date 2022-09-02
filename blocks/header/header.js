/* eslint-disable no-use-before-define, no-plusplus */

import { getIcon } from '../../scripts/scripts.js';

/**
 * @typedef {import("./types").NavItem} NavItem
 * @typedef {import("./types").ButtonItem} ButtonItem
 */

let accordionCt = 0;

/** @type {NavItem[]} */
const PRIMARY_ITEMS = [
  {
    label: 'News',
    href: '/news/',
  },
  {
    label: 'Sport',
    href: '/sport/',
  },
  {
    label: 'Business',
    href: '/business/',
  },
  {
    label: 'Opinion',
    href: '/opinion/',
  },
  {
    label: 'Ukraine',
    href: '/russia-ukraine-war/',
  },
  {
    label: 'Money',
    href: '/money/',
  },
  {
    label: 'Life',
    href: '/lifestyle/',
  },
  {
    label: 'Style',
    href: '/style/',
  },
  {
    label: 'Travel',
    href: '/travel/',
  },
  {
    label: 'Culture',
    href: '/culture/',
  },
  {
    label: 'Plusword',
    href: '/news/plusword/',
  },
];

/** @type {NavItem[]} */
const SECONDARY_ITEMS = [
  {
    label: 'UK News',
    href: '/news/uk/',
    hasHomeItem: true,
    children: [
      { label: 'Scotland', href: '/scotland/' },
      { label: 'Wales', href: '/wales/' },
      { label: 'Northern Ireland', href: '/northern-ireland/' },
    ],
  },
  {
    label: 'Politics',
    href: '/politics/',
    children: [
      { label: 'Conservatives', href: '/conservative-party/' },
      { label: 'Brexit', href: '/brexit/' },
      { label: 'Labour', href: '/labour-party/' },
      { label: 'Lib Dems', href: '/liberal-democrats/' },
      { label: 'SNP', href: '/scottish-national-party/' },
      { label: 'US Politics', href: '/us-politics/' },

    ],
  },
  {
    label: 'World',
    href: '/world-news/',
    children: [
      { label: 'USA', href: '/usa/' },
      { label: 'Europe', href: '/europe/' },
      { label: 'Middle East', href: '/middle-east/' },
      { label: 'Asia', href: '/asia/' },
      { label: 'Australasia', href: '/australasia/' },
      { label: 'Africa', href: '/africa/' },
      { label: 'Latin America', href: '/latin-america/' },
    ],
  },

  {
    label: 'Royals',
    href: '/royal-family/',
    hasHomeItem: true,
    hasMoreItem: true,
    children: [
      { label: 'The Queen', href: '/queen-elizabeth-ii/' },
      { label: 'Prince Philip', href: '/prince-philip/' },
      { label: 'Prince Charles', href: '/prince-charles/' },
      { label: 'Duchess of Cornwall', href: '/camilla-duchess-of-cornwall/' },
      { label: 'Prince William', href: '/prince-william/' },
      { label: 'Duchess of Cambridge', href: '/duchess-of-cambridge/' },
      { label: 'Prince Harry', href: '/prince-harry/' },
      { label: 'Duchess of Sussex', href: '/duchess-of-sussex/' },
    ],
  },
  {
    label: 'Health',
    href: '/health/',
  },
  {
    label: 'Defence',
    href: '/news/defence/',
  },
  {
    label: 'Science',
    href: '/science/',
  },
  {
    label: 'Education',
    href: '/education-news/',
  },
  {
    label: 'Investigations',
    href: '/investigations/',
    hasHomeItem: true,
    children: [
      {
        label: 'Signals Network',
        href: '/bigdatacall/',
      },
      {
        label: 'Contact Us',
        href: '/news/investigations/contact-us/',
      },
    ],
  },
  {
    label: 'Global Health Security',
    href: '/global-health/',
    hasHomeItem: true,
    children: [
      {
        label: 'Climate & People',
        href: '/global-health/climate-and-people/',
      },
      {
        label: 'Science & Disease',
        href: '/global-health/science-and-disease/',
      },
      {
        label: 'Terror & Security',
        href: '/global-health/terror-and-security/',
      }, {
        label: 'Women & Girls',
        href: '/global-health/women-and-girls/',
      }, {
        label: 'Opinion & Analysis',
        href: '/global-health/opinion/',
      },
    ],
  },
];

/** @type {ButtonItem[]} */
const BUTTONS = [
  {
    name: 'search',
    label: `<svg class="search-icon tmg-svg-icon" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 16">
  <title>Search Icon</title>
  <path d="M12,14.91l-3.24-5A5.5,5.5,0,1,0,5.5,11a5.27,5.27,0,0,0,1.44-.2L10.32,16ZM2,5.5A3.5,3.5,0,1,1,5.5,9,3.5,3.5,0,0,1,2,5.5Z"></path>
</svg>`,
    vbp: 'md',
  },
  {
    name: 'subscribe',
    href: 'https://premium.telegraph.co.uk/?ICID=news_premiumsub_generic_index_topnav',
    label: `<span class="sub-button-content">
      <span class="message">
        Subscribe now
      </span>
      <span class="subscript">
        Free for one month
      </span>
    </span>
    <span class="v-xl">
      ${getIcon('arrow-right')}
    </span>`,
    vbp: 'xs',
  },
  {
    name: 'login',
    label: 'Log in',
    href: `/auth#${encodeURIComponent(window.location.pathname)}`,
  },
  {
    name: 'menu',
    label: '<span class="hamburger"></span>',
    href: `${window.location.pathname}#menu`,
  },
];

/**
 * @param {NavItem} item
 * @param {number} depth
 * @returns {string}
 */
function accordionItem(item, depth) {
  const {
    href,
    label,
  } = item;
  return `
<li class="accordion-item ${depth ? `accordion-item-${depth} clickable-area` : ''}">
  ${depth ? `<a href="${href}" class="clickable-area-link">${label}</a>` : ''}
  ${accordion(item.children, item, depth + 1)}
</li>`;
}

/**
 * @param {NavItem[]} items
 * @param {NavItem} [parent]
 * @param {number} [depth=0]
 * @returns {string}
 */
function accordion(items, parent, depth = 0) {
  if (!items || !items.length) return '';

  const {
    hasHomeItem, hasMoreItem, href, label,
  } = (parent ?? {});

  const nextDepth = hasHomeItem ? depth + 1 : depth;

  return `
${parent ? `<a href="${parent.href}" class="accordion-trigger sub-accordion" id="accordion-trigger-${++accordionCt}">${parent.label}</a>` : ''}
<ul class="nav-accordion" id="accordion-${accordionCt}">
  ${hasHomeItem
    ? accordionItem({ href, label: `${label} home` }, depth)
    : ''}
  ${items.map((item) => accordionItem(item, nextDepth)).join('\n')}
  ${hasMoreItem
    ? accordionItem({ href, label: 'More...' })
    : ''}
</ul>`;
}

/**
 * @param {ButtonItem} param0
 * @returns {string}
 */
function makeButton({
  name, label, href, icon, vbp,
}) {
  return `
<div class="header-btn ${name}${vbp ? ` v-${vbp}` : ''}" id="btn-${name}">
  <a href="${href}">
    <span class="btn-content">
      ${label ? `${label}` : ''}
      ${icon ? getIcon(icon) : ''}
    </span>
  </a>
</div>`;
}

function primaryHeader() {
  return `
<div class="header-primary-wrapper">
  <div class="header-primary-content">
    <div class="header-masthead">
      <a href="/">
        ${getIcon('logo')}
      </a>
    </div>
    <div class="header-primary">
      <div class="primary-list-wrapper">
        <ul>
      ${PRIMARY_ITEMS.map((item) => `
          <li class="item-${item.label.toLowerCase()}">
            <a href=${item.href}>
              <span class="nav-item-content">${item.label}</span>
            </a>
          </li>`).join('\n')}
        </ul>
      </div>
    </div>

    <div class="header-buttons">
      ${BUTTONS.map(makeButton).join('\n')}
    </div>
  </div>
</div>`;
}

function secondaryHeader() {
  return `
<div class="header-secondary">
  <div class="header-accordion">
    <a class="accordion-trigger" id="accordion-trigger-0" href="/all-sections#news">
      See all News
    </a>
    <nav aria-label="navigation for all news">
      ${accordion(SECONDARY_ITEMS)}
    </nav>
  </div>
</div>`;
}

function template() {
  return `
<div class="header-wrapper">
  ${primaryHeader()}
  ${secondaryHeader()}
</div>`;
}

/**
 * @param {HTMLDivElement} wrapper
 */
function attachAccordionHandlers(wrapper) {
  wrapper.querySelectorAll('.accordion-trigger').forEach((trigger) => {
    const { id } = trigger;
    const num = id.split('-').pop();
    const list = wrapper.querySelector(`#accordion-${num}`);
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      list.classList.toggle('open');
      trigger.classList.toggle('open');
    });
  });
}

/**
 * @param {HTMLDivElement} wrapper
 */
function setSelectedPrimary(wrapper) {
  let [topic] = window.location.pathname.split('/');
  let item = wrapper.querySelector(`header .header-primary li.item-${topic.toLowerCase()}`);
  if (!item) {
    topic = 'news';
    item = wrapper.querySelector(`header .header-primary li.item-${topic}`);
  }
  item.classList.add('selected');
}

/**
 * @param {HTMLDivElement} block
 */
export default async function decorate(block) {
  const wrapper = block.parentElement;
  wrapper.innerHTML = template();
  attachAccordionHandlers(wrapper);
  setSelectedPrimary(wrapper);
}
