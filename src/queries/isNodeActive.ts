import {
  findParentNode,
  findSelectedNodeOfType,
} from 'prosemirror-utils'

const isNodeActive = (type, attrs?: Record<string, any>) => state => {
  const predicate = node => node.type === type;
  
  const node = findSelectedNodeOfType(type)(state.selection)
    || findParentNode(predicate)(state.selection);
  
  
  if (!node) {
    return !!node
  }
  
  return node.node.hasMarkup(type, { ...node.node.attrs, ...attrs })
};

export default isNodeActive;
