import {IObservable} from '../lib'
import Core from '../core'
import {Kind} from '.';

export const isObservable = (obj: any): obj is Observable => {
  return obj.__crowdx_kind__ === Kind.Observable;
}

export class Observable<ValueT = unknown> implements IObservable<ValueT> {
  private readonly __crowdx_kind__: Kind = Kind.Observable

  private value: ValueT

  constructor (value: ValueT) {
    this.value = value
  }

  get () {
    return this.value
  }

  set (value: ValueT) {
    const old = this.value;
    this.value = value

    Core.notifyObservers(this, value, old)
  }

  onBecomeObserved(): void { }

  onBecomeUnobserved(): void { }
}

const observable = <ValueT>(value: ValueT): Observable<ValueT> => {
  return new Observable(value)
}

export default observable
