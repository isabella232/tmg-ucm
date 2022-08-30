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

import { HTTPMethod } from './types';

export const flattenKV = (
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

export const methodNotAllowed = (req: Request, allowed: HTTPMethod[]): undefined | Response => {
  if (allowed.includes(req.method.toUpperCase() as HTTPMethod)) {
    return undefined;
  }
  return new Response(undefined, {
    status: 405,
    headers: {
      allow: allowed.join(', '),
    },
  });
};

export const responseHTML = (text: string, headers: Record<string, string> = {}, status = 200) => {
  return new Response(text, {
    status,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      ...headers,
    },
  });
};

export const responseJS = (text: string, headers: Record<string, string> = {}, status = 200) => {
  return new Response(text, {
    status,
    headers: {
      'content-type': 'application/javascript; charset=utf-8',
      ...headers,
    },
  });
};

export function hexToBuf(hex: string): ArrayBuffer| undefined {
  const str = hex.replace(/^0x/, '');

  if (str.length % 2 !== 0) {
    return undefined;
  }

  if (str.match(/[G-Z\s]/i)) {
    return undefined;
  }

  return new Uint8Array(
    str.match(/[\dA-F]{2}/gi).map((s) => {
      return Number.parseInt(s, 16);
    }),
  ).buffer;
}

export function bufToHex(buf: ArrayBuffer): string {
  return [...new Uint8Array(buf)]
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('');
}
