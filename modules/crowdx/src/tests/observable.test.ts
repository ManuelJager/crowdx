import { observable, observe } from '../api'

describe('Observable', () => {

  describe('Basic functionality', () => {

    it('should observe the observable number', (done) => {
      const num1 = observable(1, { debugName: 'num1' })

      const [_, stopObserving] = observe(num1, (newValue, oldValue) => {
        expect(oldValue).toBe(1)
        expect(newValue).toBe(3)

        done();
      })

      num1.set(3)

      stopObserving()
    })

  })

  describe('Unsubscribing', () => {

    it('should call the handler function if the stopObserving is not called', () => {
      const num2 = observable(1, { debugName: 'num2' })
      const handler = jest.fn(() => {})

      observe(num2, handler)

      num2.set(3)

      expect(handler).toBeCalled();
    })

    it('should not call the handler function if the stopObserving is called', () => {
      const num2 = observable(1, { debugName: 'num2' })
      const handler = jest.fn(() => {})

      const [_, stopObserving] = observe(num2, handler)

      stopObserving()

      num2.set(3)

      expect(handler).not.toBeCalled();
    })

  })

  describe('Same value updating', () => {

    it('should not update the value if set() is called with the same value twice', () => {

      const num = observable(1)

      const handler = jest.fn(() => {
        console.log('update');
      })

      observe(num, handler, {
        equality: (newVal, oldVal) => newVal == oldVal
      });

      num.set(5);
      // @ts-ignore
      num.set('5');

      expect(handler).toBeCalledTimes(1);
    })

  })

})
