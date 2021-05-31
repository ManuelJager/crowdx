import { observable, observe } from '../api'

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

      const observer = observe(num2, handler)

      observer.stop()

      num2.set(3)

      expect(handler).not.toBeCalled()
    })

  })

})
