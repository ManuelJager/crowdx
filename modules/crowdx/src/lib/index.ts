import { PromiseValue } from 'type-fest';
export type IObserverHandler<ValueT> = (newValue: PromiseValue<ValueT>, oldValue: PromiseValue<ValueT>) => void
export type IObservableValueType<Obs extends IObservable> = ReturnType<Obs['get']>

export type IRemoveHandler = () => void

export type DebugOptions = {
  debugName?: string
}

export type ObservableOptions = {
  // Add the options here
} & DebugOptions;

export type ComputedOptions = {

  /**
   * When an error is thrown in the value promise this handler will be executed.
   * @param error
   */
  errorHandler?: (error?: unknown) => void;
} & ObservableOptions;

export interface IObservable<ValueT = any> {
  get(): ValueT;
  onBecomeObserved(): void;
  onBecomeUnobserved(): void;
}

export interface IObserver<ValueT = any> {
  onUpdate: IObserverHandler<ValueT>
}
