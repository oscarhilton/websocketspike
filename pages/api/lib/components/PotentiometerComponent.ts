import GenericComponent from './GenericComponent';
import * as joint from 'jointjs';

/**
 * Options for creating a potentiometer component.
 */
interface PotentiometerOptions {
  x: number; // The x-coordinate of the component's position.
  y: number; // The y-coordinate of the component's position.
  width: number; // The width of the component.
  height: number; // The height of the component.
  label: string; // The label of the component.
}

/**
 * Represents a potentiometer component that extends the GenericComponent class.
 */
export class PotentiometerComponent extends GenericComponent {
  private value: number; // The current value of the potentiometer.

  /**
   * Creates a new instance of the PotentiometerComponent class.
   * @param options - The options for creating the potentiometer component.
   */
  constructor(options: PotentiometerOptions) {
    super(options);
    this.value = 0;
  }

  /**
   * Sets the value of the potentiometer.
   * @param value - The value to set. Should be between 0 and 1.
   */
  setValue(value: number): void {
    if (value < 0 || value > 1) {
      throw new Error('Value must be between 0 and 1.');
    }
    this.value = value;
  }

  /**
   * Gets the current value of the potentiometer.
   * @returns The current value of the potentiometer.
   */
  getValue(): number {
    return this.value;
  }

  /**
   * Creates a JointJS node representing the potentiometer component.
   * @returns The created JointJS node.
   */
  createNode(): joint.shapes.basic.Rect {
    const node = super.createNode();
    // Add additional attributes or modify the existing ones to represent a potentiometer
    node.attr({
      rect: {
        fill: 'lightgray',
      },
    });
    return node;
  }
}
