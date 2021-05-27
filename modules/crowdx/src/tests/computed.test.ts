import { observe, computed, observable } from "../api";

describe('Computed', () => {
  test('Basic functionality', () => {

    const num1 = observable(1, { debugName: 'num1' });
    const num2 = observable(2, { debugName: 'num2' });

    const sum = computed([num1, num2], () => {
      return num1.get() + num2.get();
    }, {
      debugName: 'sum'
    })

    observe(sum, (oldValue, newValue) => {

      expect(oldValue).toBe(3)
      expect(newValue).toBe(5)

    })

    num1.set(3);

  })
})