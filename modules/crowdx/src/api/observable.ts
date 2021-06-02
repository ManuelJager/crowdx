import { IObservable } from '../lib'
import Core from '../core'
import { ObservableOptions } from '../lib/options';

export class Observable<ValueT = any> implements IObservable<ValueT> {
  private value: ValueT
  private readonly options: ObservableOptions

  constructor (value: ValueT, options: ObservableOptions) {
    this.value = value
    this.options = options
  }

  get (): ValueT {
    return this.value
  }

  set (value: ValueT): void {
    const old = this.value

    this.value = value

    Core.notifyObservers(this, value, old)
  }

  onBecomeObserved (): void {
    console.log(`observable ${this.options.debugName ?? ''} onBecomeObserved`)
  }

  onBecomeUnobserved (): void {
    console.log(`observable ${this.options.debugName ?? ''} onBecomeUnobserved`)
  }
}

const observable = <ValueT>(value: ValueT, options: ObservableOptions = {
  debugName: 'default'
}): Observable<ValueT> => {
  return new Observable(value, options)
}

export default observable
