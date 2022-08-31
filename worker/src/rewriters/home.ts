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

/* eslint-disable no-underscore-dangle */

import { Context, DeepObjectKeys } from '../types';

interface Article {
  type?: string;
  url: string;
  headline: string;
  standfirst?: string;
  image?: string;
  kicker?: string;
  author: {
    name?: string;
    url?: string;
    image?: string;
  }
  meta: {
    live?: boolean;
    /**
     * eg. 4/5
     */
    rating?: string;
    quote?: boolean;
  }
  toString(this: Article, index: number, total: number, row?: boolean): string;
}

type ArticleListType = 'header' | 'list' | 'opinions' | 'package';
interface ArticleList {
  type: ArticleListType;
  variant?: string;
  heading: string;
  url?: string;
  image?: string;
  articles: Article[];
  push(this: ArticleList, article: Article): void;
  toString(this: ArticleList): string;
}

const headTemplate = (origin: string) => {
  return /* html */`\
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes">
  <title>The Telegraph - Telegraph Online, Daily Telegraph, Sunday Telegraph - Telegraph</title>
  <link rel="preload" as="font" crossorigin="crossorigin" type="font/woff2" href="/fonts/austin-news-uprights-vf-basic-web.woff2">
  <link rel="shortcut icon" type="image/x-icon" sizes="16x16" href="/icons/favicon.ico">
  <link rel="icon" type="image/svg+xml" href="/icons/favicon.svg">
  <link rel="icon" sizes="196x196" href="/icons/favicon-196x196.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon-180x180.png">
  <!-- Safari pinned tab icon -->
  <link rel="mask-icon" href="/icons/favicon.svg" color="#333333">
  <meta name="msapplication-TileColor" content="#2c769d">
  <meta name="msapplication-TileImage" content="/icons/mstile-144x144.png">
  <!-- Italic font not required -->
  <link rel="canonical" href="${origin}">
  <meta name="description" content="Latest news, business, sport, comment, lifestyle and culture from the Daily Telegraph and Sunday Telegraph newspapers and video from Telegraph TV.">
  <meta property="og:title" content="Telegraph">
  <meta property="og:description" content="Latest news, business, sport, comment, lifestyle and culture from the Daily Telegraph and Sunday Telegraph newspapers and video from Telegraph TV.">
  <meta property="og:type" content="homepage">
  <meta property="og:site_name" content="The Telegraph">
  <meta property="og:url" content="${origin}">
  <meta property="og:image">
  <meta name="twitter:title" content="@Telegraph">
  <meta name="twitter:url" content="${origin}">
  <meta name="twitter:image">
  <meta name="twitter:site" content="@Telegraph">
  <meta name="twitter:description" content="Latest news, business, sport, comment, lifestyle and culture from the Daily Telegraph and Sunday Telegraph newspapers and video from Telegraph TV.">
  <meta name="twitter:card" content="summary_large_image">
  <script src="/scripts/scripts.js" type="module"></script>
  <link rel="stylesheet" href="/styles/styles.css">
</head>`;
};

const sectionMetadata = (meta: Record<string, string>) => {
  return `\
<div class="section-metadata">
  ${
  Object.entries(meta).map(([k, v]) => {
    return `\
  <div>
    <div>${k}</div>
    <div>${v}</div>
  </div>`;
  }).join('\n')
}
</div>`;
};

const articleTemplate = (article: Article) => {
  return /* html */`\
<div class="article">
  ${article.image ? /* html */`
  <div>
    <div>
      <picture>
        <source media="(max-width: 400px)" srcset="${article.image}">
        <img src="${article.image}" alt="" loading="lazy">
      </picture>
    </div>
  </div>` : ''}
  <div>
    <div>
      <h3><a href="${article.url}">${article.headline}</a></h3>
      <p>${article.standfirst}</p>
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
    </div>` : ''}
  </div>

  ${article.kicker ? /* html */`\
  <div>
    <div>kicker</div>
    <div>${article.kicker}</div>
  </div>` : ''}

</div>
`;
};

const initArticleList = (type: ArticleListType): ArticleList => {
  return {
    type,
    heading: '',
    articles: [],
    push(article: Article) {
      this.articles.push(article);
    },
    toString() {
      if (this.type === 'header') {
        return `\
<div>
  <div class="header-articles">
    ${this.articles.map((a, i) => a.toString(i, this.articles.length, true)).join('\n')}
  </div>
</div>`;
      }

      return `\
<div>
  <h3>${this.heading}</h3>
  ${this.articles.map((a, i) => a.toString(i, this.articles.length)).join('\n')}
  ${sectionMetadata({ style: type })}
</div>`;
    },
  };
};

const initArticle = (type?: string): Article => {
  return {
    type,
    url: '',
    headline: '',
    standfirst: '',
    image: '',
    kicker: '',
    author: {
      name: '',
      url: '',
      image: '',
    },
    meta: {
      live: false,
      rating: '',
      quote: false,
    },
    toString(index: number, total: number, row = false) {
      if (row) {
        return /* html */`\
<div>
  <div>
    <h4><a href="${this.url}">${this.headline}</a></h4>
    <p>${this.standfirst}</p>
  </div>
  ${this.image ? /* html */`\
  <div>
    <picture>
      <source media="(max-width: 400px)" srcset="${this.image}">
      <img src="${this.image}" alt="" loading="lazy">
    </picture>
  </div>` : ''}
</div>`;
      }

      return articleTemplate(this);
    },
  };
};

const makeBodyStream = (): {
  stream: ReadableStream;
  writer: { close: () => Promise<void>; push: (chunk: string) => Promise<void> };
} => {
  const encoder = new TextEncoder();
  const { readable, writable } = new TransformStream();
  const _writer = writable.getWriter();

  /**
   * @note temp workaround for missing transform streams
   */
  let val = '';

  return {
    stream: readable,
    writer: {
      close: async () => {
        // return _writer.close();

        await _writer.write(encoder.encode(val));
        return _writer.close();
      },
      push: (chunk: string) => {
        // return _writer.write(encoder.encode(chunk));
        val += chunk;
        return Promise.resolve();
      },
    },
  };
};

export function attach(ctx: Context): HTMLRewriter {
  const { rewriter } = ctx;

  let article: Article | undefined;
  let articles: ArticleList | undefined;

  let keyType: 'article' | 'list';
  let key: DeepObjectKeys<Article> | DeepObjectKeys<ArticleList>;
  const setKey = (
    e: Element,
    _key: DeepObjectKeys<Article> | DeepObjectKeys<ArticleList>,
    _keyType: 'article' | 'list' = 'article',
    revertKey: DeepObjectKeys<Article> = undefined,
  ) => {
    key = _key;
    keyType = _keyType;
    e.onEndTag(() => {
      key = revertKey;
      if (!revertKey) {
        keyType = undefined;
      }
    });
  };
  const { stream, writer } = makeBodyStream();

  return rewriter
    .onDocument({
      text: (t) => {
        const text = t.text.trim();

        if (text && key) {
          const spl = key.split('.');
          let k = spl.shift();
          let obj = keyType === 'article' ? article : articles as unknown as Record<string, string>;
          while (spl.length) {
            obj = obj[k] as unknown as Record<string, string>;
            k = spl.shift();
          }
          obj[k] += t.text;
        }
        t.remove();
      },
      end: async (e) => {
        const res = new Response(stream);
        const text = await res.text();
        e.append(text, { html: true });
      },
    })
    .on('head', {
      element: (e) => {
        e.remove();
        e.before(headTemplate(ctx.url.origin), { html: true });
      },
    })
    .on('script', {
      element: (e) => {
        e.remove();
      },
    })
    .on('body>a', {
      element: (e) => {
        e.remove();
      },
    })
    .on('a[href^="https://www.telegraph.co.uk"]', {
      element: (e) => {
        e.setAttribute('href', e.getAttribute('href').replace('https://www.telegraph.co.uk', ctx.url.origin));
      },
    })
    .on('body', {
      element: async (e) => {
        /**
         * @todo using ReadableStreams as Content replacement is not implemented in CF workers yet
         */
        // e.after(stream, { html: true });

        await writer.push(`
<header></header>
<main><div>
`);

        e.onEndTag(async () => {
          await writer.push(`\
</div></main>
<footer></footer>`);
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          writer.close();
        });
      },
    })
    .on('body > div.site-header-wrapper', {
      element: (e) => {
        articles = initArticleList('header');
        e.onEndTag(async () => {
          // push header articles
          await writer.push(articles.toString());
          articles = undefined;
        });
      },
    })
    .on('section, section > :not(article), main div.opinion, main div.opinion > :not(article)', {
      element: (e) => {
        const className = e.getAttribute('class');
        if (!articles && (e.tagName === 'section' || (e.tagName === 'div' && className === 'opinion'))) {
          // initialize ArticleList
          if (className.includes('package')) {
            articles = initArticleList('package');
          } else if (className.includes('article-list')) {
            articles = initArticleList('list');
          } else {
            articles = initArticleList('list');
          }
          e.onEndTag(async () => {
            // push current ArticleList
            await writer.push(articles.toString());
            articles = undefined;
          });
        } else if (articles) {
          // set ArticleList properties
          if (className.startsWith('package__heading ')) {
            setKey(e, 'heading', 'list');
          }
        }
      },
    })
    .on('article, article *', {
      element: (e) => {
        const className = e.getAttribute('class');

        if (!article && e.tagName === 'article') {
          // initialize current article
          article = initArticle();
          e.onEndTag(() => {
            articles.push(article);
            article = undefined;
          });
        } else if (article) {
          // set article properties
          if (className?.startsWith('e-utility__title') || className?.startsWith('list-headline__text')) {
            setKey(e, 'headline');
          } else if (className?.startsWith('e-kicker')) {
            setKey(e, 'kicker', 'article', 'headline');
          } else if (e.tagName === 'img' && className?.includes('author-image')) {
            const url = e.getAttribute('src');
            article.author.image = url;
          } else if (e.tagName === 'img') {
            const src = e.getAttribute('src');
            if (src) {
              article.image = src;
            }
          } else if (e.tagName.startsWith('h') && e.tagName.length === 2) {
            setKey(e, 'headline');
          } else if (e.tagName === 'p') {
            setKey(e, 'standfirst');
          } else if (e.tagName === 'a') {
            const url = e.getAttribute('href');
            const rel = e.getAttribute('rel');
            if (rel === 'author') {
              article.author.url = url;
            } else {
              article.url = url;
            }
          } else if (e.tagName === 'span') {
            const itemtype = e.getAttribute('itemtype');
            if (itemtype && itemtype === 'https://schema.org/Person') {
              setKey(e, 'author.name');
            }
          }
        }
      },
    })
    .on('*', {
      element: (e) => {
        e.removeAndKeepContent();
      },
    });
}
