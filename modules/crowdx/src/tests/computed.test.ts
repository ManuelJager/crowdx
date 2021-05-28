import { observe, computed, observable } from '../api'

describe('Computed', () => {

  describe('Basic functionality', () => {

    it('should observe the computed value if it is updated', (done) => {

      const num1 = observable(1, { debugName: 'num1' });
      const num2 = observable(2, { debugName: 'num2' });

      const sum = computed([num1, num2], () => {
        return num1.get() + num2.get();
      }, {
        debugName: 'sum'
      })

      observe(sum, (newValue, oldValue) => {
        expect(newValue).toBe(5)
        expect(oldValue).toBe(3)

        expect(num1.get()).toBe(3)
        expect(num2.get()).toBe(2)

        done()
      })

      num1.set(3);
    })

  })

})
