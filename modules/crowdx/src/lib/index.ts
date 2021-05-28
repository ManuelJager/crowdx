export type IObserverHandler<ValueT> = (newValue: ValueT, oldValue: ValueT) => void

export type IRemoveHandler = () => void

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface IObservable<ValueT = any> {
  onBecomeObserved: () => void
  onBecomeUnobserved: () => void
}

export interface IObserver<ValueT = any> {
  onUpdate: IObserverHandler<ValueT>
}
