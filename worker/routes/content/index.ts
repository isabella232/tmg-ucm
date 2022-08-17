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

import type { Route } from '../../types';
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

const Content: Route = async (request, ctx) => {
  const { env, log } = ctx;
  log.debug('[Content]');

  const url = new URL(request.url);
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
      'content-type': 'text/html; charset=utf-8',
    },
  });
  return resp;
};

export default Content;
