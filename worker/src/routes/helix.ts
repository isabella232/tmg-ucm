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

import type { Context, Route } from '../types';

const fontsURL = (url: URL) => {
  const spl = url.pathname.split('/');
  url.pathname = spl[spl.length - 1];
};

const imageHandler = (ctx: Context): Promise<Response> => {
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
  return fetch(url, {
    cf: {
      image,
    },
  });
};

const Helix: Route = async (request, ctx) => {
  const { env, log } = ctx;

  if (ctx.url.pathname.endsWith('.png') || ctx.url.pathname.endsWith('.jpg')) {
    return imageHandler(ctx);
  }

  const url = new URL(request.url);
  if (ctx.url.pathname.endsWith('.woff')) {
    fontsURL(url);
  } else if (env.CACHE_GEN) {
    url.searchParams.set('gen', env.CACHE_GEN);
  }

  const upstream = `${env.UPSTREAM}${url.pathname}${url.search}`;

  log.debug('[Helix] fetching: ', upstream);

  const req = new Request(upstream, request);
  if (req.headers.has('host')) {
    req.headers.set('x-forwarded-host', req.headers.get('host'));
  }

  let resp = await fetch(req, { cf: { cacheTtl: 60 } });
  resp = new Response(resp.body, resp);
  resp.headers.set('access-control-allow-origin', '*');
  resp.headers.delete('age');
  resp.headers.delete('x-robots-tag');
  return resp;
};

export default Helix;
