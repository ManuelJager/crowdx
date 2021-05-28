export type IObserverHandler<ValueT> = (newValue: ValueT, oldValue: ValueT) => void

export type IRemoveHandler = () => void

export interface IObservable<ValueT = any> {
  onBecomeObserved(): void;
  onBecomeUnobserved(): void;
}

export interface IObserver<ValueT = any> {
  onUpdate: IObserverHandler<ValueT>
}
