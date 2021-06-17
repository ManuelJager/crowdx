import { DefaultEqualityLambda, EqualityLambda } from '../equality';

export type ObserverOptions<ValueT> = {
  /**
   * Checks the equality of the new and old values.
   * If the function returns true, the values will not be sent to the observer.
   * If the function returns false, it means they are not equal so the values will be sent to the observer.
   * @param newValue
   * @param oldValue
   */
  equality?: EqualityLambda<ValueT>
}

export const applyDefaultObserverOptions = <ValueT>(options: ObserverOptions<ValueT>): void => {
  if(typeof options?.equality !== 'function') {
    options.equality = DefaultEqualityLambda;
  }
}
