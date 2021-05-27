export type IObserverHandler<T> = (oldValue: T, newValue: T) => void

export type IRemoveHandler = () => void

export type Options = {
  debugName: string,
}

export interface IObservable<T = any> {
  onBecomeObserved(): void;
  onBecomeUnobserved(): void;
}

export interface IObserver<T = any> {
  onUpdate: IObserverHandler<T>
}
