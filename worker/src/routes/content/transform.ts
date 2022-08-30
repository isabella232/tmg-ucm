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

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import type { AnyOk } from '../../types';
import { flattenKV } from '../../util';
import type {
  BodyNode,
  Hit,
  ImageNode,
  TemplateOptions,
} from './types';
import { processNode } from './handlers';

/**
 * Create HTML document from data using template
 */
const template = ({
  title,
  meta,
  image,
  authors,
  extensions,
  headline,
  standfirst,
  content,
}: TemplateOptions) => {
  return /* html */`<!DOCTYPE html>
<html>
    <head>
        <title>${title}</title>
        <link rel="canonical" href="${meta.canonicalLink}">
        <meta name="description" content="${meta.description}">
        <meta property="og:title" content="${title}">
        <meta property="og:description" content="${meta.description}">
        <meta property="og:url" content="${meta.canonicalLink}">
        <meta property="og:image" content="${image.url}?width=1200&#x26;format=pjpg&#x26;optimize=medium">
        <meta property="og:image:secure_url" content="${image.url}?width=1200&#x26;format=pjpg&#x26;optimize=medium">
        <meta property="og:image:alt" content="${image.alt}">
        ${meta.tags.map((tag) => {
    return `<meta property="article:tag" content="${tag}">`;
  }).join('        \n')}
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="${title}">
        <meta name="twitter:description" content="${meta.description}">
        <meta name="twitter:image" content="${image.url}?width=1200&#x26;format=pjpg&#x26;optimize=medium">
        ${authors.map((author) => {
    return `<meta property="author" content="${author.name}">`;
  }).join('        \n')}
        <meta name="publication-date" content="${meta.createdDate}">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta property="og:type" content="${meta.type}">
        <meta property="og:site_name" content="The Telegraph">
        <meta name="twitter:site" content="${extensions.twitterSite}">
        <meta name="twitter:creator" content="${extensions.twitterSite}">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="serp-content-type" content="${meta.type}">
        <script src="/scripts/scripts.js" type="module"></script>
        <link rel="stylesheet" href="/styles/styles.css">
        <link rel="icon" href="data:,">
    </head>
    <body>
      <header>
      </header>
      <main>
        <div>
          <h1>${headline}</h1>${standfirst ? `
          <p>${standfirst}</p>` : ''}
          <div class="authors">
${
  authors.map((author) => {
    return `\
            <div>
              <div>
                <a href="${author.url}">${author.name}</a>
              </div>
              <div>
                ${author.role ?? ''}
              </div>
            </div>`;
  }).join('\n')
}
          </div>
          ${content}
        </div>
      </main>
    <footer></footer>
  </body>
</html>`;
};

/**
 * Convert each body node to corresponding HTML
 */
const templateContent = (nodes: BodyNode[]): string => {
  return nodes.map(processNode).filter((n) => !!n).join('\n');
};

const getOgImage = (nodes: BodyNode[]): ImageNode & { url: string } => {
  // https://img.youtube.com/vi/6AKdwmm2ap0/maxresdefault.jpg
  const imageOrVideo = nodes.find((n) => n.type === 'image' || n.type === 'video') as ImageNode;
  if (imageOrVideo.type === 'image') {
    return {
      ...imageOrVideo,
      url: imageOrVideo.data,
    };
  }

  return {
    ...imageOrVideo,
    url: `https://img.youtube.com/vi/${imageOrVideo.data}/maxresdefault.jpg`,
  };
};

const generateHTML = (queryRes: AnyOk) => {
  const hit: Hit = queryRes.hits[0] as Hit;
  const { metadata, content } = hit;
  const extensions = flattenKV(metadata.extensions, 'key', 'value');
  const annotations = flattenKV(metadata.annotations, 'name', 'uri');
  const image = getOgImage(content.body);

  const opts: TemplateOptions = {
    meta: {
      canonicalLink: extensions.url,
      description: content.standfirst || content.headline,
      tags: Object.keys(annotations),
      createdDate: metadata['tmg-created-date'] ?? '',
      type: metadata.type,
    },
    image: {
      url: image.data,
      alt: image['alt-text'],
      credit: image.credit,
      width: image.width,
      height: image.height,
    },
    authors: content.authors,
    extensions: extensions as TemplateOptions['extensions'],
    title: content.headline,
    headline: content.headline,
    standfirst: content.standfirst,
    content: templateContent(content.body),
  };
  return template(opts);
};

export default generateHTML;
