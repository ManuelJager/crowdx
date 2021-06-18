import { observable, observe } from '../api'
import { DoubleEquals } from '../lib/equality';

describe('Observable', () => {

  describe('Basic functionality', () => {

    it('should observe the observable number', (done) => {
      const num1 = observable(1)

      const observer = observe(num1, (newValue, oldValue) => {
        expect(oldValue).toBe(1)
        expect(newValue).toBe(3)

        done();
      })

      num1.set(3)

      observer.stop()
    })

  })

  describe('Unsubscribing', () => {

    it('should call the handler function if the stopObserving is not called', () => {
      const num2 = observable(1)
      const handler = jest.fn(() => {})

      observe(num2, handler)

      num2.set(3)

      expect(handler).toBeCalled()
    })

    it('should not call the handler function if the stopObserving is called', () => {
      const num2 = observable(1)
      const handler = jest.fn(() => {})

      observe(num2, handler).stop()

      num2.set(3)

      expect(handler).not.toBeCalled()
    })

  })

  describe('Same value updating', () => {

    it('should not update the value if set() is called with the same value twice', () => {

      const num = observable(1)
      const handler = jest.fn()

      observe(num, handler)

      num.set(5)
      num.set(5)
      num.set(5)

      expect(handler).toBeCalledTimes(1)

      num.set(6)

      expect(handler).toBeCalledTimes(2)
    })

    it('should not update the value if set() is called with the same value twice and the equality is set to DoubleEquals', () => {

      const num = observable(1)
      const handler = jest.fn()

      observe(num, handler, {equality: DoubleEquals})

      num.set(5)
      // @ts-ignore
      num.set('5')

      expect(handler).toBeCalledTimes(1)
    })

  })

})
