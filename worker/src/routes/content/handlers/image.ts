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
import { BodyNode } from '../types';

export default (node: BodyNode, ctx: Context): string => {
  const {
    caption, credit, data, 'alt-text': alt,
  } = node;
  if (!caption) return '';

  return `\
  <p>
    <picture>
      <source media="(max-width: 400px)" srcset="${data}">
      <img src="${node.data.replace(ctx.env.CONTENT_ENDPOINT, '')}" alt="${alt ?? ''}" loading="lazy">
    </picture>
  </p>
  <p>${(caption as string).trim()}${credit ? `<em>${(credit as string).trim()}</em>` : ''}</p>`;
};
