import { IObservable, IObserver, IObserverHandler, IRemoveHandler } from '../lib'
import Core from '../core'

class Observer<T> implements IObserver<T> {
  public onUpdate: IObserverHandler<T>

  private readonly dep: IObservable<T>

  constructor (dep: IObservable<T>, handler: IObserverHandler<T>) {
    this.dep = dep
    this.onUpdate = handler
  }
}

const observe = <T>(dep: IObservable<T>, handler: IObserverHandler<T>): [Observer<T>, IRemoveHandler] => {
  const observer = new Observer(dep, handler)
  Core.registerObserver(dep, observer)
  return [
    observer,
    () => Core.unregisterObserver(dep, observer)
  ]
}

export default observe
