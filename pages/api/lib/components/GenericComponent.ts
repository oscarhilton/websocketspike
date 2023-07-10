import * as joint from 'jointjs';

/**
 * Options for creating a generic component.
 */
interface ComponentOptions {
  x: number; // The x-coordinate of the component's position.
  y: number; // The y-coordinate of the component's position.
  width: number; // The width of the component.
  height: number; // The height of the component.
  label: string; // The label of the component.
}

/**
 * Represents a generic functional component that outputs a JointJS node.
 */
export default class GenericComponent {
  private x: number; // The x-coordinate of the component's position.
  private y: number; // The y-coordinate of the component's position.
  private width: number; // The width of the component.
  private height: number; // The height of the component.
  private label: string; // The label of the component.
  private node: joint.shapes.basic.Rect | null; // The JointJS node associated with the component.

  /**
   * Creates a new instance of the GenericComponent class.
   * @param options - The options for creating the component.
   */
  constructor(options: ComponentOptions) {
    const { x, y, width, height, label } = options;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.label = label;
    this.node = null;
  }

  /**
   * Creates a JointJS node representing the component.
   * @returns The created JointJS node.
   */
  createNode(): joint.shapes.basic.Rect {
    this.node = new joint.shapes.basic.Rect({
      position: { x: this.x, y: this.y },
      size: { width: this.width, height: this.height },
      attrs: {
        rect: {
          fill: 'lightblue',
          stroke: 'black',
        },
        text: {
          text: this.label,
          fill: 'black',
        },
      },
    });

    return this.node;
  }

  /**
   * Updates the position of the component.
   * @param x - The new x-coordinate of the component's position.
   * @param y - The new y-coordinate of the component's position.
   */
  updatePosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
    if (this.node) {
      this.node.position(x, y);
    }
  }

  /**
   * Updates the size of the component.
   * @param width - The new width of the component.
   * @param height - The new height of the component.
   */
  updateSize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    if (this.node) {
      this.node.resize(width, height);
    }
  }

  /**
   * Updates the label of the component.
   * @param label - The new label of the component.
   */
  updateLabel(label: string): void {
    this.label = label;
    if (this.node) {
      this.node.attr('text/text', label);
    }
  }
}
