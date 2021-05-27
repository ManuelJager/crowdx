import { observable, observe } from '../api'

describe('Observable', () => {
  test('Basic functionality', () => {
    const num1 = observable(1, { debugName: 'num1' })

    const [observer, stopObserving] = observe<number>(num1, (oldValue, newValue) => {
      expect(oldValue).toBe(1)
      expect(newValue).toBe(3)
    })

    num1.set(3)

    stopObserving()
  })

  test('Unsubscribing', () => {
    const num2 = observable(1, { debugName: 'num2' })
    let called = false

    const [_, stopObserving] = observe<number>(num2, (oldValue, newValue) => {
      called = true
    })

    stopObserving()

    num2.set(3)

    expect(called).toBe(false)
  })
})
