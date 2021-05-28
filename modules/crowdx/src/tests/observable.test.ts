import { observable, observe } from '../api'

describe('Observable', () => {

  describe('Basic functionality', () => {

    it('should observe the observable number', (done) => {
      const num1 = observable(1, { debugName: 'num1' })

      const [_, stopObserving] = observe<number>(num1, (newValue, oldValue) => {
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

      observe<number>(num2, handler)

      num2.set(3)

      expect(handler).toBeCalled();
    })

    it('should not call the handler function if the stopObserving is called', () => {
      const num2 = observable(1, { debugName: 'num2' })
      const handler = jest.fn(() => {})

      const [_, stopObserving] = observe<number>(num2, handler)

      stopObserving()

      num2.set(3)

      expect(handler).not.toBeCalled();
    })

  })

})
