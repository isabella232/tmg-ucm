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

import { HomeArticle } from './HomeArticle';
import type { AsyncKeySetter } from './util';
import { asyncKeySetter, sectionMetadata } from './util';

export type HomeArticleListType = 'header' | 'list' | 'opinions' | 'package';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface HomeArticleList extends AsyncKeySetter<HomeArticleList> {}

export function isArticleList(e: Element): boolean {
  return e.tagName === 'section' || (e.tagName === 'div' && e.getAttribute('class') === 'opinion');
}

@asyncKeySetter
export class HomeArticleList {
  public type: HomeArticleListType;

  public variant: string;

  public heading = '';

  private articles: HomeArticle[] = [];

  constructor(eOrType: Element | HomeArticleListType) {
    if (typeof eOrType === 'string') {
      this.type = eOrType;
      return;
    }

    const e: Element = eOrType;
    const className = e.getAttribute('class');
    if (className.includes('package')) {
      this.type = 'package';
      if (className.includes('package--small')) {
        this.variant = 'small';
      } else if (className.includes('package--medium')) {
        this.variant = 'medium';
      } else if (className.includes('package--large')) {
        this.variant = 'large';
      }
    } else if (className.includes('article-list')) {
      this.type = 'list';
    } else {
      // default
      this.type = 'list';
    }
  }

  public processElement(e: Element): void {
    const className = e.getAttribute('class');

    // set ArticleList properties
    if (className.startsWith('package__heading ')) {
      this.setKey(e, 'heading');
    }
  }

  public push(article: HomeArticle) {
    this.articles.push(article);
  }

  public toString() {
    const indent = 4;
    if (this.type === 'header') {
      return `
<div>
  <div class="header-articles">\
${this.articles.map((a, i) => a.toString(i, this.articles.length, true)).join('')}
  </div>
</div>`.split('\n').map((l) => ''.padStart(indent, '  ') + l).join('\n');
    }

    if (this.type === 'package') {
      return `
<div>
  <div class="package${this.variant ? ` ${this.variant}` : ''}">
    <div><div><h3>${this.heading}</h3></div></div>\
${this.articles.map((a, i) => a.toString(i, this.articles.length, true)).join('')}
  </div>
</div>`.split('\n').map((l) => ''.padStart(indent, '  ') + l).join('\n');
    }

    return `
<div>
  <h3>${this.heading}</h3>
${this.articles.map((a, i) => a.toString(i, this.articles.length)).join('\n')}
${sectionMetadata({ style: this.type })}
</div>`.split('\n').map((l) => ''.padStart(indent, '  ') + l).join('\n');
  }
}
