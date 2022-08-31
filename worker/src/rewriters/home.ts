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
import { HomeArticle, isArticle } from './HomeArticle';
import { HomeArticleList, isArticleList } from './HomeArticleList';

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

  let article: HomeArticle | undefined;
  let articleList: HomeArticleList | undefined;

  const { stream, writer } = makeBodyStream();

  return rewriter
    .onDocument({
      text: (t) => {
        const text = t.text.trim();
        if (text) {
          if (article?.hasKey()) {
            article.setValue(text);
          } else if (articleList?.hasKey()) {
            articleList.setValue(text);
          }
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
    .on(`a[href^="${ctx.env.CONTENT_ENDPOINT}"]`, {
      // replace hard links with local links
      element: (e) => {
        let href = e.getAttribute('href').replace(ctx.env.CONTENT_ENDPOINT, '');
        if (!href.startsWith('/')) {
          href = `/${href}`;
        }
        e.setAttribute('href', href);
      },
    })
    .on('body', {
      element: async (e) => {
        /**
         * @todo using ReadableStreams as Content replacement is not implemented in CF workers yet
         */
        // e.before(stream, { html: true });

        await writer.push(`
<body>
  <header></header>
  <main>`);

        e.onEndTag(async () => {
          await writer.push(`
  </main>
  <footer></footer>
</body>`);
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          writer.close();
        });
      },
    })
    .on('body > div.site-header-wrapper', {
      element: (e) => {
        articleList = new HomeArticleList('header');
        e.onEndTag(async () => {
          await writer.push(articleList.toString());
          articleList = undefined;
        });
      },
    })
    .on('section, section > :not(article), main div.opinion, main div.opinion > :not(article)', {
      element: (e) => {
        if (!articleList && isArticleList(e)) {
          articleList = new HomeArticleList(e);
          e.onEndTag(async () => {
            await writer.push(articleList.toString());
            articleList = undefined;
          });
        }

        if (articleList) {
          articleList.processElement(e);
        }
      },
    })
    .on('article, article *', {
      element: (e) => {
        if (!article && isArticle(e)) {
          article = new HomeArticle();
          e.onEndTag(() => {
            articleList.push(article);
            article = undefined;
          });
          return;
        }

        if (article) {
          article.processElement(e);
        }
      },
    })
    .on('script,body>a', {
      // remove anchor links and all scripts entirely
      element: (e) => {
        e.remove();
      },
    })
    .on('*', {
      // process all other nodes
      element: (e) => {
        e.removeAndKeepContent();
      },
    });
}
