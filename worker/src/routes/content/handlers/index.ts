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

import type { BodyNode, HeadingNode, ImageNode } from '../types';
import type { Context } from '../../../types';

import video from './video';
import particle from './particle';
import image from './image';
import heading from './heading';
import text from './text';

export const processNode = (ctx: Context, node: BodyNode): string => {
  switch (node.type) {
    case 'video':
      return video(node, ctx);
    case 'image':
      return image(node as ImageNode, ctx);
    case 'particle':
      return particle(node, ctx);
    case 'heading':
      return heading(node as HeadingNode, ctx);
    case 'text':
      return text(node, ctx);
    default:
      console.warn('!! WARNING: fallback to default node handler: ', node);
      return node['html-data'];
  }
};

export {
  image,
  video,
  particle,
};
