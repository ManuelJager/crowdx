import { observable, when } from '../api';

describe('When side effect', () => {

  describe('when', () => {

    it('should resolve the promise condition was met', (done) => {
      const num = observable(1);

      when(num, (val) => val === 2).then((val) => {
        expect(val).toEqual(2);
        done();
      });

      num.set(2);
    })

    it('should not resolve the promise if the condition is not met but the observable is updated', (done) => {
      const num = observable(1);
      const handler = jest.fn();

      when(num, (val) => val === 2).then(handler);

      num.set(3);

      setTimeout(() => {
        expect(handler).not.toBeCalled();

        done();
      })
    })

  })

})
