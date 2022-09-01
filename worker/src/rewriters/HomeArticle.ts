/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import type { AsyncKeySetter } from './util';
import { asyncKeySetter } from './util';

export interface HomeAuthor {
  name?: string;
  url?: string;
  image?: string;
}

export interface HomeArticleMeta {
  live: boolean;
  rating?: string;
  /** @note not handled - not specific enough in DOM */
  quote: boolean;
}

// eslint-disable-next-line no-use-before-define
const articleTemplate = (article: HomeArticle) => {
  return /* html */`\
  <div class="article">
${article.image ? /* html */`\
    <div>
      <div>
        <picture>
          <source media="(max-width: 400px)" srcset="${article.image}">
          <img src="${article.image}" alt="" loading="lazy">
        </picture>
      </div>
    </div>
` : ''}\
    <div>
      <div>
        <h3><a href="${article.url}">${article.headline}</a></h3>
        <p>${article.standfirst ? article.standfirst : ''}</p>
      </div>
    </div>
${article.author.name || article.author.image ? /* html */`\
    <div>
      <div>
        ${article.author.name ? /* html */`<a href="${article.author.url}">${article.author.name}</a>` : ''}
        ${article.author.image ? /* html */`<picture>
          <source media="(max-width: 400px)" srcset="${article.author.image}">
          <img src="${article.author.image}" alt="" loading="lazy">
        </picture>` : ''}
      </div>
    </div>
` : ''}\
${article.kicker ? /* html */`\
    <div>
      <div>kicker</div>
      <div>${article.kicker}</div>
    </div>
` : ''}\
  </div>`;
};

export function isArticle(e: Element): boolean {
  return e.tagName === 'article';
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface HomeArticle extends AsyncKeySetter<HomeArticle> {}

@asyncKeySetter
export class HomeArticle {
  public type?: string = '';

  public url = '';

  private _headline = '';

  public standfirst?: string;

  public image?: string;

  public kicker?: string;

  public author: HomeAuthor = {};

  public meta: HomeArticleMeta = {
    live: false,
    rating: '',
    quote: false,
  };

  public get headline(): string {
    if (this.meta.live && this._headline.substring(0, 4).toLowerCase() === 'live') {
      return this._headline.substring(4);
    }
    return this._headline;
  }

  public set headline(val: string) {
    this._headline = val;
  }

  public processElement(e: Element): void {
    const className = e.getAttribute('class');

    // set article properties
    if (className && (className.startsWith('e-utility__title') || className.startsWith('list-headline__text'))) {
      this.setKey(e, 'headline');
    } else if (className?.startsWith('e-kicker')) {
      this.setKey(e, 'kicker', 'headline');
    } else if (e.tagName === 'img' && className?.includes('author-image')) {
      const url = e.getAttribute('src');
      this.author.image = url;
    } else if (e.tagName === 'img') {
      const src = e.getAttribute('src');
      if (src) {
        this.image = src;
      }
    } else if (e.tagName.startsWith('h') && e.tagName.length === 2) {
      this.setKey(e, 'headline');
    } else if (e.tagName === 'p') {
      this.setKey(e, 'standfirst');
    } else if (e.tagName === 'a') {
      const url = e.getAttribute('href');
      const rel = e.getAttribute('rel');
      if (rel === 'author') {
        this.author.url = url;
      } else {
        this.url = url;
      }
    } else if (e.tagName === 'span') {
      if (className && className.includes('label-live')) {
        this.meta.live = true;
      } else {
        const itemtype = e.getAttribute('itemtype');
        if (itemtype && itemtype === 'https://schema.org/Person') {
          this.setKey(e, 'author.name');
        } else if (itemtype) {
          console.warn('[span] UNHANDLED SCHEMA: ', itemtype, className);
        }
      }
    } else if (e.tagName === 'div') {
      const itemtype = e.getAttribute('itemtype');
      if (itemtype && itemtype === 'https://schema.org/Rating') {
        this.setKey(e, 'meta.rating');
      } else if (itemtype) {
        console.warn('[div] UNHANDLED SCHEMA: ', itemtype, className);
      }
    }
  }

  public toString(index: number, total: number, row = false) {
    if (row) {
      return /* html */`
    <div>
      <div>
        <h4><a href="${this.url}">${this.headline}</a></h4>
        ${this.standfirst ? `<p>${this.standfirst}</p>` : ''}
      </div>
${this.image ? /* html */`\
      <div>
        <picture>
          <source media="(max-width: 400px)" srcset="${this.image}">
          <img src="${this.image}" alt="" loading="lazy">
        </picture>
      </div>` : ''}\
    </div>`;
    }

    return articleTemplate(this);
  }
}
