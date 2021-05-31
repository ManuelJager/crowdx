import { IObservable, Kind, ObservableOptions } from '.'
import Core from '../core'

export class Observable<ValueT = any> implements IObservable<ValueT> {
  private readonly __crowdx_kind__: Kind = Kind.Observable

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
