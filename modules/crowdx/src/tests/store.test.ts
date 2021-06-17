import {createStore, observe} from '../api'
import {Store} from '../lib'

describe('Store', () => {
  describe('Create store', () => {
    it('should allow for basic read and write operations', () => {
      const store = createStore({
        num1: 1,
        num2: 2,
      });

      store.num1 = 3

      expect(store.num1).toBe(3);
    })

    it('should call observables', () => {
      const store = createStore({
        num1: 1,
        num2: 2,
      })

      const handler = jest.fn(({ num1 }) => {
        expect(num1).toBe(3)
      });

      observe(store, handler)

      store.num1 = 3

      expect(handler).toBeCalled()
    })

    it('should work as a function call', () => {
      const store = createStore(() => ({
        num1: 1,
        num2: 2,
      }))

      const handler = jest.fn(({ num1 }) => {
        expect(num1).toBe(3)
      });

      observe(store, handler)

      store.num1 = 3

      expect(handler).toBeCalled()
    })

    it('should support deriveds', () => {
      const store = createStore(({ derived }) => ({
        num1: 1,
        num2: 2,
        sum: derived((state) => {
          return state.num1 + state.num2
        })
      }))

      store.num1 = 3

      expect(store.sum).toBe(5)

      const handler = jest.fn(({ sum }) => {
        expect(sum).toBe(7)
      })

      observe(store, handler)

      store.num1 = 5

      expect(handler).toBeCalled()
    })
  })

  describe('Set', () => {
    it('should not set values for a property that does not exist', () => {
      const store = createStore({
        num1: 1,
      })

      expect(() => {
        store.set({ num2: 2 })
      }).toThrow('num2 is not defined')
    })

    it('should not set values of a derived property', () => {
      const store = createStore(({ derived }) => ({
        num1: 1,
        num2: 2,
        sum: derived(({ num1, num2 }) => num1 + num2)
      }))

      expect(() => {
        store.set({ sum: 3 })
      }).toThrow('sum is readonly')
    })

    it('should call the handler once', () => {
      const store = createStore({
        num1: 1,
        num2: 2,
      })

      const handler = jest.fn(({ num1, num2 }) => {
        expect(num1).toBe(3)
        expect(num2).toBe(4)
      })

      observe(store, handler)

      store.set({
        num1: 3,
        num2: 4,
      })

      expect(handler).toBeCalledTimes(1)
    })
  })

  describe('Edge cases', () => {
    it('should not allow for reserved keyword usage', () => {
      const emptyStore = createStore({})
      const props = Object.getOwnPropertyNames(emptyStore)
        .concat(Object.getOwnPropertyNames(Store.prototype))
        .concat(Object.getOwnPropertyNames(Object.prototype))
        // Ignore __proto__, as this property is almost always set
        .filter((name) => name !== '__proto__')

      for (const prop of props) {
        expect(() => {
          createStore({ [prop]: 1 })
        }).toThrow(`${prop} is a reserved keyword`)
      }
    })
  })
})