import { ObserverOptions } from './observerOptions';
import { ObservableOptions } from './observableOptions';

export type ComputedOptions<ValueT> = {

  /**
   * When an error is thrown in the value promise this handler will be executed.
   * @param error
   */
  errorHandler?: (error?: unknown) => void
} & ObservableOptions & ObserverOptions<ValueT>
