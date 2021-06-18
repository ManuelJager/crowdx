import { IObservable, ObservableOptions } from '.'
import Core from '../core'

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

  onBecomeObserved (): void { }

  onBecomeUnobserved (): void { }
}
