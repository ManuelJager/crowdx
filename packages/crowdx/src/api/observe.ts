import {
  IObservable,
  IObservableValueType,
  Observer,
  IObserverHandler,
  applyDefaultObserverOptions,
  ObserverOptions
} from '../lib'

import Core from '../core'

const observe = <Dep extends IObservable>(
  dep: Dep,
  handler: IObserverHandler<IObservableValueType<Dep>>,
  options: ObserverOptions<IObservableValueType<Dep>> = { }
): Observer<IObservableValueType<Dep>> => {

  applyDefaultObserverOptions(options);

  const observer = new Observer(dep, handler, options)
  Core.registerObserver(dep, observer)
  return observer
}

export default observe
