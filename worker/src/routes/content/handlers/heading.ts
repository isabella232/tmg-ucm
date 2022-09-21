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

import type { Context } from '../../../types';
import type { HeadingNode } from '../types';

const LEVELS = {
  level1: 'h1',
  level2: 'h2',
  level3: 'h3',
  level4: 'h4',
  level5: 'h5',
  level6: 'h6',
};

export default (node: HeadingNode, _ctx: Context): string => {
  const { subtype, data } = node;
  const tag = LEVELS[subtype];
  return `<${tag}>${data}</${tag}>`;
};
