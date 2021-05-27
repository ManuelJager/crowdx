import {IObservable, IRemoveHandler, Options} from '../lib'
import Core from '../core'

class Observable<T = any> implements IObservable<T> {
  private value: T
  private options: Options;

  constructor (value: T, options: Options) {
    this.value = value
    this.options = options
  }

  get () {
    return this.value
  }

  set (value: T) {
    Core.notifyObservers(this, this.value, value)
    this.value = value
  }

  onBecomeObserved(): void {
    console.log(`observable ${this.options.debugName} onBecomeObserved`);
  }

  onBecomeUnobserved(): void {
    console.log(`observable ${this.options.debugName} onBecomeUnobserved`);
  }
}

const observable = <T>(value: T, options: Options = {
  debugName: 'default'
}): Observable<T> => {
  return new Observable(value, options)
}

export default observable
