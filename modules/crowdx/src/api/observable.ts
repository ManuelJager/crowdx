import {IObservable, IRemoveHandler, Options} from '../lib'
import Core from '../core'

class Observable<ValueType = any> implements IObservable<ValueType> {
  private value: ValueType
  private options: Options;

  constructor (value: ValueType, options: Options) {
    this.value = value
    this.options = options
  }

  get () {
    return this.value
  }

  set (value: ValueType) {
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

const observable = <ValueType>(value: ValueType, options: Options = {
  debugName: 'default'
}): Observable<ValueType> => {
  return new Observable(value, options)
}

export default observable
