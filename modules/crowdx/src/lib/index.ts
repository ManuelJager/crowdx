export type IObserverHandler<ValueT> = (newValue: ValueT, oldValue: ValueT) => void

export type IRemoveHandler = () => void

export type DebugOptions = {
  debugName: string
}

export type Options = {
  // Add the options here
} & DebugOptions;

export interface IObservable<ValueT = any> {
  onBecomeObserved(): void;
  onBecomeUnobserved(): void;
}

export interface IObserver<ValueT = any> {
  onUpdate: IObserverHandler<ValueT>
}
