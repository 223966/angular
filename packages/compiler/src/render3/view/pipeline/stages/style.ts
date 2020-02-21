/**
* @license
* Copyright Google Inc. All Rights Reserved.
*
* Use of this source code is governed by an MIT-style license that can be
* found in the LICENSE file at https://angular.io/license
*/
import {Node, Transform, NodeKind, List, Property, StyleMap, StyleProp} from '../api/uir';
import {replaceNode} from './util';


/**
 * Converts empty elementStart/elementEnd instructions into element instruction
 */
export class StyleTransform implements Transform {
  visit(node: Node, list: List): Node {
    if (node.kind === NodeKind.Property && isStyleProp(node.name)) {
       node = convertStyleProperty(node);
    }
    return node;
  }
}

function isStyleProp(name: string) {
  return name.substring(0,5) === 'style';
}

function convertStyleProperty(node: Property): StyleMap|StyleProp {
  return node.name === 'style'
    ? convertStyleMapProperty(node)
    : convertStylePropProperty(node);
}

function convertStyleMapProperty(node: Property): StyleMap {
  const {prev, next, expression} = node;
  return {kind: NodeKind.StyleMap, expression, next, prev};
}

function convertStylePropProperty(node: Property): StyleProp {
  const {prev, next, expression} = node;
  const name = extractStylePropName(node.name);
  return {kind: NodeKind.StyleProp, name, expression, next, prev};
}

function extractStylePropName(name: string): string {
  return name.match(/style.(\w+)/)![1];
}