import {createStore, observe} from '../api';

describe('Store', () => {
  describe('Create store', () => {
    it('should allow for basic read and write operations', () => {
      const store = createStore({
        num1: 1,
        num2: 2,
      });

      store.num1 = 3;

      expect(store.num1).toBe(3);
    })

    it('should call observables', () => {
      const store = createStore({
        num1: 1,
        num2: 2,
      })

      const handler = jest.fn(({ num1 }) => {
        expect(num1).toBe(3);
      });

      observe(store, handler);

      store.num1 = 3;

      expect(handler).toBeCalled();
    })
  })
})