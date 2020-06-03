import Extension from "../lib/Extension";

export default abstract class Node extends Extension {
  get type() {
    return "node";
  }

  abstract get schema();
}
