import { getIcon } from '../../scripts/scripts.js';

const SOCIALS = [
  { alt: 'Visit our Facebook page', href: 'https://www.facebook.com/TELEGRAPH.CO.UK/', icon: 'facebook' },
  { alt: 'Visit our Instagram page', href: 'https://www.instagram.com/telegraph/', icon: 'instagram' },
  { alt: 'Visit our Twitter page', href: 'https://twitter.com/@Telegraph', icon: 'twitter' },
  { alt: 'Visit our Snapchat page', href: 'https://www.snapchat.com/discover/The_Telegraph/8148798159', icon: 'snapchat' },
  { alt: 'Visit our LinkedIn page', href: 'https://www.linkedin.com/company/9053/', icon: 'linkedin' },
  { alt: 'Visit our YouTube page', href: 'https://www.youtube.com/channel/UCPgLNge0xqQHWM5B5EFH9Cg', icon: 'youtube' },
];

const SECONDARY_LINKS = [
  { label: 'Contact us', href: '/contact-us/' },
  { label: 'About us', href: 'https://corporate.telegraph.co.uk/' },
  { label: 'Telegraph Extra', href: 'https://extra.telegraph.co.uk/' },
  { label: 'Reader Prints', href: 'https://telegraph.newsprints.co.uk/' },
  { label: 'Branded Content', href: '/branded-content/' },
  { label: 'Syndication and Commissioning', href: '/syndication/' },
  { label: 'Guidelines', href: '/about-us/editorial-and-commercial-guidelines3/' },
  { label: 'Privacy', href: '/about-us/privacy-and-cookie-policy/' },
  { label: 'Terms and Conditions', href: '/about-us/terms-and-conditions/' },
  { label: 'Advertising Terms', href: '/about-us/advertising-terms-and-conditions/' },
  { label: 'Fantasy Sport', href: 'https://fantasyfootball.telegraph.co.uk/' },
  { label: 'UK Voucher Codes', href: '/vouchercodes' },
  { label: 'Betting Offers', href: '/betting/free-bets/' },
  { label: 'Modern Slavery', href: '/about-us/modern-slavery-statement/' },
  { label: 'Tax Strategy', href: '/about-us/press-acquisitions-limited-tax-strategy-financial-year-2021/' },
  { label: 'Broadband and Mobile Deals', href: '/compare' },
  { label: 'Manage Cookies', href: `${window.location.href}#` },
];

function templateSecondaryLink(link) {
  return `
<li class="secondary-link">
  <a href="${link.href}">${link.label}</a>
</li>`;
}

function templateSocial(social) {
  return `
<li class="social-link">
  <a href="${social.href}" target="_blank" aria-label="${social.label}" rel="noopener noreferrer">${getIcon(social.icon)}</a>
</li>`;
}

function templatePrimary() {
  return /* html */`
<div class="masthead">
  <div class="logo-wrapper">
    <a href="/">
      ${getIcon('logo')}
    </a>
  </div>
  <div class="back-to-top">
    <a href="#navigation">
      <span class="back-to-top-text">Back to top</span>
      ${getIcon('arrow-up')}
    </a>
  </div>
  <div class="socials">
    <span class="socials-description">Follow us on:</span>
    <ul>
      ${SOCIALS.map(templateSocial).join('\n')}
    </ul>
  </div>
</div> 
`;
}

function templateSecondary() {
  return /* html */`
<nav>
  <ul>
    ${SECONDARY_LINKS.map(templateSecondaryLink).join('\n')}
  </ul>
</nav>
<div class="copyright">
  © Telegraph Media Group Limited 2022
</div>
`;
}

function template() {
  return /* html */`
<div class="primary">
  ${templatePrimary()}
</div>
<div class="secondary">
  ${templateSecondary()}
</div>
`;
}

/**
 * loads and decorates the footer
 * @param {Element} block The header block element
 */

export default async function decorate(block) {
  block.innerHTML = template();
}
