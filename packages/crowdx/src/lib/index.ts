import { PromiseValue } from 'type-fest'
import { ObserverOptions } from './options';

export type IObserverHandler<ValueT> = (newValue: PromiseValue<ValueT>, oldValue: PromiseValue<ValueT>) => void
export type IObservableValueType<Obs extends IObservable> = ReturnType<Obs['get']>
export type IRemoveHandler = () => void

export interface IObservable<ValueT = any> {
  get: () => ValueT
  onBecomeObserved: () => void
  onBecomeUnobserved: () => void
}

export interface IObserver<ValueT = any> {
  onUpdate: IObserverHandler<ValueT>
  options: ObserverOptions<ValueT>
}

export * from './derived'
export * from './computed'
export * from './store'
export * from './observable'
export * from './equality'
export * from './options'
export * from './observe'
