import { IObservable, IObserver, IObserverHandler, IRemoveHandler } from '../lib'
import Core from '../core'

class Observer<ValueT> implements IObserver<ValueT> {
  public onUpdate: IObserverHandler<ValueT>

  private readonly dep: IObservable<ValueT>

  constructor (dep: IObservable<ValueT>, handler: IObserverHandler<ValueT>) {
    this.dep = dep
    this.onUpdate = handler
  }
}

const observe = <ValueT>(dep: IObservable<ValueT>, handler: IObserverHandler<ValueT>): [Observer<ValueT>, IRemoveHandler] => {
  const observer = new Observer(dep, handler)
  Core.registerObserver(dep, observer)
  return [
    observer,
    () => Core.unregisterObserver(dep, observer)
  ]
}

export default observe
