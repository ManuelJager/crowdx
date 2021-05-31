import { IObservable, IObservableValueType, IObserver, IObserverHandler } from '../lib'
import Core from '../core'

class Observer<ValueT> implements IObserver<ValueT> {
  public onUpdate: IObserverHandler<ValueT>

  private readonly dep: IObservable<ValueT>

  constructor (dep: IObservable<ValueT>, handler: IObserverHandler<ValueT>) {
    this.dep = dep
    this.onUpdate = handler
  }

  public stop (): void {
    return Core.unregisterObserver(this.dep, this)
  }
}

const observe = <Dep extends IObservable>(dep: Dep, handler: IObserverHandler<IObservableValueType<Dep>>): Observer<IObservableValueType<Dep>> => {
  const observer = new Observer(dep, handler)
  Core.registerObserver(dep, observer)
  return observer
}

export default observe
