import { ComputedOptions, IObservable, IObservableValueType, IObserver, Kind, Observable } from '.'
import Core from '../core'

type DepValues<Deps extends {[key: string]: Observable}> = {
  [Property in keyof Deps]: IObservableValueType<Deps[Property]>;
}

export type ComputedHandler<ValueT, Deps extends {[key: string]: Observable}> = ((depValues: DepValues<Deps>) => ValueT) | ((depValues: DepValues<Deps>) => Promise<ValueT>)

export class Computed<ValueT, Deps extends {[key: string]: Observable}> implements IObservable<ValueT>, IObserver {
  private readonly __crowdx_kind__: Kind = Kind.Computed

  private readonly deps: Deps
  private readonly handler: ComputedHandler<ValueT, Deps>
  private readonly options: ComputedOptions
  private value: ValueT
  private observed: boolean

  private readonly promiseQueue: Array<Promise<ValueT>>
  private readonly awaitingValues: Array<{notifyObservers: boolean, value: ValueT}>

  constructor (deps: Deps, handler: ComputedHandler<ValueT, Deps>, options: ComputedOptions) {
    this.deps = deps
    this.handler = handler
    this.options = options
    this.observed = false
    this.promiseQueue = []
    this.awaitingValues = []

    this.updateValue(false)
  }

  /**
   * Gets the current values of the dependencies mapped to an object the following way: 'dependencyName' => 'value'
   * @private
   */
  private getDependencyValues (): DepValues<Deps> {
    const values: any = {}

    for (const [name, dep] of Object.entries(this.deps)) {
      values[name] = dep.get()
    }

    return values
  }

  /**
   * Loops over every awaiting value and notifies in to the observer.
   * @private
   */
  private notifyAwaitingValues (): void {
    for (const awaitingValue of this.awaitingValues) {
      const newOld = this.value
      this.value = awaitingValue.value

      if (awaitingValue.notifyObservers) {
        Core.notifyObservers(this, this.value, newOld)
      }
    }
  }

  /**
   * Updates the value of the computed.
   * If the value handler returns a promise, the value will update once the promise has resolved.
   * If the value handler does not return a promise, it simply updates the value synchronous.
   *
   * Extra async info:
   * It is possible that the value of a dependency changes while the promise of the previous value is still resolving.
   * In that case the new promise will be added to the promiseQueue, this promiseQueue makes sure that all values are always resolved in the right order.
   * So when a promise resolves while a previous promise is still resolving its value will be added to the awaitingValues.
   * When the other promise resolves, it will first update the value to its resolved value. Then check the awaiting values queue for more.
   *
   * @param notifyObservers If true, the observers of this computed will be notified once the value has updated.
   * @private
   */
  private updateValue (notifyObservers: boolean = true): void {
    const old = this.value
    const depValues = this.getDependencyValues()
    const val = this.handler(depValues)

    if (val instanceof Promise) {
      this.promiseQueue.push(val)
      const i = this.promiseQueue.indexOf(val)

      // TODO: In the future find a less ugly way to do this.
      val.then(function (this: Computed<ValueT, Deps>, newValue: ValueT) {
        if (this.promiseQueue[0] !== val) {
          this.awaitingValues.push({
            value: newValue,
            notifyObservers
          })
        } else {
          const newOld = this.value
          this.value = newValue

          if (notifyObservers) {
            Core.notifyObservers(this, this.value, newOld)
          }

          this.notifyAwaitingValues()
        }

        this.promiseQueue.splice(i, 1)
      }.bind(this))
        .catch((error) => {
          if (typeof this.options.errorHandler === 'function') {
            this.options.errorHandler(error)
          } else {
            console.error('Unhandled error', error)
          }
        })
    } else {
      this.value = val

      if (notifyObservers) {
        Core.notifyObservers(this, this.value, old)
      }
    }
  }

  get (): ValueT {
    if (!this.observed) {
      throw new Error('Cannot get value of unobserved computed')
    }

    return this.value
  }

  async onUpdate (): Promise<void> {
    this.updateValue()
  }

  onBecomeObserved (): void {
    console.log(`computed ${this.options.debugName ?? ''} onBecomeObserved`)
    this.observed = true

    for (const dep of Object.values(this.deps)) {
      Core.registerObserver(dep, this)
    }
  }

  onBecomeUnobserved (): void {
    console.log(`computed ${this.options.debugName ?? ''} onBecomeUnobserved`)
    this.observed = false

    for (const dep of Object.values(this.deps)) {
      Core.unregisterObserver(dep, this)
    }
  }
}
