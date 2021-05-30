import { IObservable, Kind } from '.'
import Core from '../core'

export class Observable<ValueT = unknown> implements IObservable<ValueT> {
  private readonly __crowdx_kind__: Kind = Kind.Observable

  private value: ValueT

  constructor (value: ValueT) {
    this.value = value
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
