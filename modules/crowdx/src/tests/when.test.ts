import { observable, when } from '../api';

describe('When side effect', () => {

  describe('when', () => {

    it('should call the handler function when the observable value changed', (done) => {

      const num = observable(1);

      when(num, (val) => val === 2).then(() => {
        done();
      });

      num.set(2);
    })

  })

})
