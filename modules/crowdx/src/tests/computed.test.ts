import { observe, computed, observable } from '../api'

describe('Computed', () => {

  describe('Basic functionality', () => {

    it('should observe the computed value if it is updated', (done) => {

      const num1 = observable(1, { debugName: 'num1' });
      const num2 = observable(2, { debugName: 'num2' });

      const sum = computed({num1, num2}, ({num1, num2}) => {
        return num1 + num2;
      }, {
        debugName: 'sum'
      })

      observe(sum, (newValue, oldValue) => {
        expect(newValue).toBe(5)
        expect(oldValue).toBe(3)

        expect(num1.get()).toBe(3)
        expect(num2.get()).toBe(2)

        done()
      })

      num1.set(3);
    })

  })

  describe('Async support', () => {

    describe('Resolving promise', () => {

      it('should observe the new value synchronously while the computed handler is asynchronous', (done) => {

        const num1 = observable(1, { debugName: 'num1' });
        const num2 = observable(2, { debugName: 'num2' });

        const sum = computed({num1, num2}, async ({num1, num2}): Promise<number> => {
          return Promise.resolve(num1 + num2);
        })

        observe(sum, (newValue, oldValue) => {
          expect(newValue).toBe(5)
          expect(oldValue).toBe(3)

          expect(num1.get()).toBe(3)
          expect(num2.get()).toBe(2)

          done()
        })

        num1.set(3);
      })

      it('should observe the new value in the correct order while the second promise resolves first', (done) => {

        const num1 = observable(1, { debugName: 'num1' });
        const num2 = observable(2, { debugName: 'num2' });

        let i = 0;
        const sum = computed({num1, num2}, async (values): Promise<number> => {

          if(i++ == 0) {
            return new Promise<number>((resolve) => {
              setTimeout(() => {
                resolve(values.num1 + values.num2)
              }, 200);
            })
          } else {
            return new Promise<number>((resolve) => {
              setTimeout(() => {
                resolve(values.num1 + values.num2)
              }, 100);
            })
          }
        })

        observe(sum, (newValue, oldValue) => {
          expect(newValue).toBe(5)
          expect(oldValue).toBe(3)

          expect(num1.get()).toBe(3)
          expect(num2.get()).toBe(2)

          done()
        })

        num1.set(3);
      })

    })

    describe('Rejecting promise', () => {

      it('should execute the error handler when the promise is rejected', (done) => {

        const num1 = observable(1);
        const toThrow = 'error_01';

        computed({num1}, async (): Promise<number> => {
          return Promise.reject(toThrow);
        }, {
          errorHandler: (error: unknown) => {
            if(typeof error === 'string') {
              expect(error).toEqual(toThrow);
              done()
            }
          }
        })

        num1.set(3);
      })

    })

  })

})
