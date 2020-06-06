import {
  findParentNode,
  findSelectedNodeOfType,
} from 'prosemirror-utils'

const isNodeActive = (type, attrs?: Record<string, any>) => state => {
  
  console.log("Selection", type, state.selection, state.selection.$from)
  const { $from } = state.selection;
  console.log($from.parent.hasMarkup(type))
  
  
  return false;
  
  
  // const { $from, to, node } = state.selection;
  // if (node) {
  //   return attrs ? node.hasMarkup(type, attrs) : node.type === type;
  // }

  // return (
  //   to <= $from.end() &&
  //   (attrs ? $from.parent.hasMarkup(type, attrs) : $from.parent.type === type)
  // );
};

export default isNodeActive;
