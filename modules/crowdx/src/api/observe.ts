import { IObservable, IObserver, IObserverHandler, IRemoveHandler } from '../lib'
import Core from '../core'

class Observer<ValueType> implements IObserver<ValueType> {
  public onUpdate: IObserverHandler<ValueType>

  private readonly dep: IObservable<ValueType>

  constructor (dep: IObservable<ValueType>, handler: IObserverHandler<ValueType>) {
    this.dep = dep
    this.onUpdate = handler
  }
}

const observe = <ValueType>(dep: IObservable<ValueType>, handler: IObserverHandler<ValueType>): [Observer<ValueType>, IRemoveHandler] => {
  const observer = new Observer(dep, handler)
  Core.registerObserver(dep, observer)
  return [
    observer,
    () => Core.unregisterObserver(dep, observer)
  ]
}

export default observe
