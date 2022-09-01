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

import video from './video';
import particle from './particle';
import image from './image';
import { BodyNode } from '../types';
import { Context } from '../../../types';

export const processNode = (ctx: Context, node: BodyNode): string => {
  switch (node.type) {
    case 'video':
      return video(node, ctx);
    case 'image':
      return image(node, ctx);
    case 'particle':
      return particle(node, ctx);
    default:
      return node['html-data'];
  }
};

export {
  image,
  video,
  particle,
};
