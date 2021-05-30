import { IObservable, IObserver, Kind } from './index'
import Core from '../core'

export type ComputedDeps = IObservable[]
export type ComputedHandler<ValueT> = () => ValueT

export class Computed<ValueT = unknown> implements IObservable<ValueT>, IObserver {
  private readonly __crowdx_kind__: Kind = Kind.Computed

  private readonly deps: ComputedDeps
  private readonly handler: ComputedHandler<ValueT>
  private value: ValueT
  private observed: boolean

  constructor (deps: ComputedDeps, handler: ComputedHandler<ValueT>) {
    this.deps = deps
    this.handler = handler
    this.value = handler()
    this.observed = false
  }

  get (): ValueT {
    if (!this.observed) {
      throw new Error('Cannot get value of unobserved computed')
    }

    return this.value
  }

  onUpdate (): void {
    const old = this.value
    this.value = this.handler()

    Core.notifyObservers(this, this.value, old)
  }

  onBecomeObserved (): void {
    this.observed = true

    for (const dep of this.deps) {
      Core.registerObserver(dep, this)
    }
  }

  onBecomeUnobserved (): void {
    this.observed = false

    for (const dep of this.deps) {
      Core.unregisterObserver(dep, this)
    }
  }
}
