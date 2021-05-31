import { IObservable, IObservableValueType, IObserver, IObserverHandler, IRemoveHandler } from '../lib'
import Core from '../core'

class Observer<ValueT> implements IObserver<ValueT> {
  public onUpdate: IObserverHandler<ValueT>

  private readonly dep: IObservable<ValueT>

  constructor (dep: IObservable<ValueT>, handler: IObserverHandler<ValueT>) {
    this.dep = dep
    this.onUpdate = handler
  }
}

const observe = <Dep extends IObservable>(dep: Dep, handler: IObserverHandler<IObservableValueType<Dep>>): [Observer<IObservableValueType<Dep>>, IRemoveHandler] => {
  const observer = new Observer(dep, handler)
  Core.registerObserver(dep, observer)
  return [
    observer,
    () => Core.unregisterObserver(dep, observer)
  ]
}

export default observe
