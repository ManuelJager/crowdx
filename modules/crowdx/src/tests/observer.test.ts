import { observable, observe } from '../api';

describe('Observer', () => {

  describe('observe', () => {

    it('should call the handler function when the observable value changed', (done) => {
      const initialValue = 'initial';
      const updatedValue = 'updated';

      const testObs = observable(initialValue)

      observe<string>(testObs, (newValue, oldValue) => {
        expect(newValue).toBe(updatedValue)
        expect(oldValue).toBe(initialValue)

        done();
      })

      testObs.set(updatedValue);

    })

  })

})
