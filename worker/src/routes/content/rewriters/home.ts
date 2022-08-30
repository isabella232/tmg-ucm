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

import { Context } from '../../../types';

const headTemplate = (origin: string) => {
  return `\
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
</head>`;
};

export function attach(ctx: Context): HTMLRewriter {
  const { rewriter } = ctx;
  return rewriter
    .on('script', {
      element: (e) => {
        e.remove();
      },
    })
    .on('head', {
      element: (e) => {
        e.replace(headTemplate(ctx.url.origin), { html: true });
      },
    });
}
