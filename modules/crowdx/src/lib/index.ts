export type IObserverHandler<ValueType> = (newValue: ValueType, oldValue: ValueType) => void

export type IRemoveHandler = () => void

export type DebugOptions = {
  debugName: string
}

export type Options = {
  // Add the options here
} & DebugOptions;

export interface IObservable<ValueType = any> {
  onBecomeObserved(): void;
  onBecomeUnobserved(): void;
}

export interface IObserver<ValueType = any> {
  onUpdate: IObserverHandler<ValueType>
}
