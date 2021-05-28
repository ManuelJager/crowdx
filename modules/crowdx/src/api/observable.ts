import {IObservable, IRemoveHandler, Options} from '../lib'
import Core from '../core'

class Observable<ValueT = any> implements IObservable<ValueT> {
  private value: ValueT
  private options: Options;

  constructor (value: ValueT, options: Options) {
    this.value = value
    this.options = options
  }

  get () {
    return this.value
  }

  set (value: ValueT) {
    const old = this.value;
    this.value = value

    Core.notifyObservers(this, value, old)
  }

  onBecomeObserved(): void {
    console.log(`observable ${this.options.debugName} onBecomeObserved`);
  }

  onBecomeUnobserved(): void {
    console.log(`observable ${this.options.debugName} onBecomeUnobserved`);
  }
}

const observable = <ValueT>(value: ValueT, options: Options = {
  debugName: 'default'
}): Observable<ValueT> => {
  return new Observable(value, options)
}

export default observable
