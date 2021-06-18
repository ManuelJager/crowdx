import { useStore } from '../api';
import { createStore } from 'crowdx';


describe('hooks', () => {

  describe('useStore', () => {

    it('should be defined', () => {

      expect(!!createStore).toBe(true)

      const store = createStore({
        a: 1,
      })

      expect(store.a).toBe(1)

    })

  })

})