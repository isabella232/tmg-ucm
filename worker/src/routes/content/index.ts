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

import type { Context, Route } from '../../types';
import { homeHandler } from '../../rewriters';
import generateHTML from './transform';

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

const fetchIndex = async (ctx: Context): Promise<Response> => {
  const { env, log } = ctx;
  const res = await fetch(`${env.CONTENT_ENDPOINT}`);
  if (!res.ok) {
    return res;
  }
  return homeHandler(ctx).transform(
    new Response(res.body, {
      headers: {
        'cache-control': 'max-age=60, must-revalidate',
        'content-type': 'text/html; charset=utf-8',
      },
    }),
  );
};

export const fetchImage = async (ctx: Context): Promise<Response> => {
  const curl = ctx.url;

  const image:RequestInitCfPropertiesImage = {};
  if (curl.searchParams.has('imwidth')) {
    image.width = Number.parseInt(curl.searchParams.get('imwidth'), 10);
  }

  if (curl.searchParams.has('impolicy')) {
    const policy = curl.searchParams.get('impolicy');
    if (policy === 'utilities-thumbnail') {
      image.width = 60;
    }
  } else if (curl.searchParams.has('imheight')) {
    image.height = Number.parseInt(curl.searchParams.get('imheight'), 10);
  }

  const url = `${ctx.env.CONTENT_ENDPOINT}${curl.pathname}`;
  const res = await fetch(url, {
    cf: {
      image,
    },
  });
  return new Response(res.body, {
    headers: {
      'content-type': res.headers.get('content-type'),
    },
  });
};

const Content: Route = async (request, ctx) => {
  const { env, log } = ctx;

  log.debug('[Content]');

  const url = new URL(request.url);
  if (!url.pathname || url.pathname === '/') {
    return fetchIndex(ctx);
  }

  if (ctx.url.pathname.endsWith('.png') || ctx.url.pathname.endsWith('.jpg') || ctx.url.pathname.endsWith('.jpeg')) {
    return fetchImage(ctx);
  }

  const path = url.pathname + url.search;
  const queryUrl = `${env.CONTENT_ENDPOINT}${path}`;
  const query = makeQueryJSON(queryUrl);

  let resp = await fetch(`${env.API_ENDPOINT}/content-reader/v3/content/search`, {
    headers: {
      app_key: env.API_KEY,
      'content-type': 'application/json',
    },
    method: 'POST',
    body: query,
  });

  if (!resp.ok) {
    log.error(`[Content] query error (${resp.status}): `, await resp.text());
    return new Response(null, { status: resp.status });
  }

  const respBody = await resp.json();
  if (typeof respBody !== 'object' || !(respBody as Record<string, string>)?.results) {
    return new Response('Not found', { status: 404 });
  }

  resp = new Response(generateHTML(respBody), {
    status: 200,
    headers: {
      'cache-control': 'max-age=60, must-revalidate',
      'content-type': 'text/html; charset=utf-8',
    },
  });
  return resp;
};

export default Content;
