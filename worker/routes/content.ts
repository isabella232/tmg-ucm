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

import type { Route } from '../types';

const makeQueryJSON = (url: string): string => {
  return JSON.stringify({
    booleanFilter: {
      filters: [{
        ranges: [{
          field: 'metadata.extensions.key',
          value: 'url',
          operator: 'EQ',
        }],
        operator: 'AND',
      }, {
        ranges: [{
          field: 'metadata.extensions.value',
          value: url,
          operator: 'EQ',
        }],
        operator: 'AND',
      }],
      operator: 'AND',
    },
  });
};

interface BodyNodeBase {
    type: string;
    data: string;
    'html-data': string;
    [key: string]: string | number;
}

interface ImageNode extends BodyNodeBase {
  type: 'image';
  'alt-text': string;
  credit: string;
  caption: string;
  'html-caption': string;
  width: number;
  height: number;
}

type BodyNode = ImageNode | BodyNodeBase;

interface Author {
  name: string;
  uri: string;
  url: string;
  role: string;
}

interface Hit {
  metadata: {
    type: string;
    extensions: {
      'key': string;
      'value': string;
    }[];
    annotations: {
      'name': string;
      'uri': string;
    }[];
    'tmg-created-date': string;
    [key: string]: unknown;
  }
  content: {
    headline: string;
    standfirst?: string;
    authors: Author[];
    body: BodyNode[];
  }
}

interface TemplateOptions {
  title: string;
  meta: {
    canonicalLink: string;
    description: string;
    tags: string[];
    createdDate: string;
    type: string;
  };
  image: {
    url: string;
    alt: string;
    credit?: string;
    width: number;
    height: number;
  };
  authors: Author[];
  extensions: {
    twitterSite: string;
    webChannelUrl: string;
  };
  headline: string;
  standfirst?: string;
  content: string;
}

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
        <meta property="og:site_name" content="The Telehgraph">
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
          <h1>${headline}</h1>${standfirst ? `
          <p>${standfirst}</p>` : ''}
        </header>
        <main>
          <div class="authors">
            <div>
${
  authors.map((author) => {
    return `\
              <div>
                <a href="${author.url}">${author.name}</a>
              </div>
              <div>
                ${author.role ?? ''}
              </div>`;
  }).join('\n')
}
            </div>
          </div>
          ${content}
        </main>
        <footer></footer>
    </body>
</html>`;
};

const flattenKV = (
  arr: Record<string, string>[],
  keyKey: string,
  valKey: string,
): Record<string, string> => {
  const obj = {};
  arr.forEach((a) => {
    obj[a[keyKey]] = a[valKey];
  });
  return obj;
};

const templateContent = (nodes: BodyNode[]): string => {
  const processNode = (node: BodyNode): string => {
    if (node.type === 'text') {
      return node['html-data'];
    }
    if (node.type === 'image') {
      if (!node['html-caption']) {
        return '';
      }

      return `${node['html-data']}\n${node['html-caption']}`;
    }
    return node['html-data'];
  };
  return nodes.map(processNode).filter((n) => !!n).join('\n');
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const generateHTML = (queryRes: any) => {
  const hit: Hit = queryRes.hits[0] as Hit;
  const { metadata, content } = hit;
  const extensions = flattenKV(metadata.extensions, 'key', 'value');
  const annotations = flattenKV(metadata.annotations, 'name', 'uri');
  const image = content.body.find((n) => n.type === 'image') as ImageNode;

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

const Content: Route = async (request, ctx) => {
  const { env, log } = ctx;
  log.debug('[Content]');

  const url = new URL(request.url);
  const path = url.pathname + url.search;
  const queryUrl = `${env.CONTENT_ENDPOINT}${path}`;
  const query = makeQueryJSON(queryUrl);

  let resp = await fetch(`${env.API_ENDPOINT}/content-reader/v3/content/search`, {
    headers: {
      app_key: API_KEY,
      'content-type': 'application/json',
    },
    method: 'POST',
    body: query,
  });

  if (!resp.ok) {
    return new Response('error', { status: resp.status });
  }

  const respBody = await resp.json();
  if (typeof respBody !== 'object' || !(respBody as Record<string, string>)?.results) {
    return new Response('Not found', { status: 404 });
  }

  resp = new Response(generateHTML(respBody), {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
    },
  });
  return resp;
};

export default Content;
