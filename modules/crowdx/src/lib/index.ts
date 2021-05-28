export type IObserverHandler<T> = (newValue: T, oldValue: T) => void

export type IRemoveHandler = () => void

export type DebugOptions = {
  debugName: string
}

export type Options = {
  // Add the options here
} & DebugOptions;

export interface IObservable<T = any> {
  onBecomeObserved(): void;
  onBecomeUnobserved(): void;
}

export interface IObserver<T = any> {
  onUpdate: IObserverHandler<T>
}
