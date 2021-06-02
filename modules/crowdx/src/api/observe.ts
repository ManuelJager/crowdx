import {
  IObservable,
  IObservableValueType,
  IObserver,
  IObserverHandler,
  IRemoveHandler,
} from '../lib'
import Core from '../core'
import { applyDefaultObserverOptions, ObserverOptions } from '../lib/options';

export class Observer<ValueT> implements IObserver<ValueT> {
  public onUpdate: IObserverHandler<ValueT>
  public readonly options: ObserverOptions<ValueT>

  private readonly dep: IObservable<ValueT>

  constructor (dep: IObservable<ValueT>, handler: IObserverHandler<ValueT>, options: ObserverOptions<ValueT>) {
    this.dep = dep
    this.options = options
    this.onUpdate = handler
  }
}

const observe = <Dep extends IObservable>(
  dep: Dep,
  handler: IObserverHandler<IObservableValueType<Dep>>,
  options: ObserverOptions<IObservableValueType<Dep>> = { }
): [Observer<IObservableValueType<Dep>>, IRemoveHandler] => {

  applyDefaultObserverOptions(options);

  const observer = new Observer(dep, handler, options)
  Core.registerObserver(dep, observer)

  return [
    observer,
    () => Core.unregisterObserver(dep, observer)
  ]
}

export default observe
