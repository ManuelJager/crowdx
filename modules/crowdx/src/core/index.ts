import { IObservable, IObserver } from '../lib'
import { Observer } from '../api/observe';

/**
 * global state
 */
class Core {
  // All observers, with their respective observers
  private readonly observables: Map<IObservable, IObserver[]>

  constructor () {
    this.observables = new Map<IObservable, IObserver[]>()
  }

  /**
   * Registers an observer to a given observable
   *
   * @param observable - Observable
   * @param observer - Observer
   */
  registerObserver<ValueT>(observable: IObservable<ValueT>, observer: IObserver<ValueT>): void {
    let observers = this.observables.get(observable)

    if (typeof observers === 'undefined') {
      observers = []
      observable.onBecomeObserved()
    }

    observers.push(observer)
    this.observables.set(observable, observers)
  }

  /**
   * Unregisters an observer from a given observable
   *
   * @param observable - Observable
   * @param observer - Observer
   */
  unregisterObserver<ValueT>(observable: IObservable<ValueT>, observer: IObserver<ValueT>): void {
    const observers = this.observables.get(observable)

    if (typeof observers === 'undefined') {
      throw new Error('Cannot unregister observer for unobserved observable')
    }

    const index = observers.indexOf(observer)
    observers.splice(index, 1)

    if (observers.length === 0) {
      observable.onBecomeUnobserved()
      this.observables.delete(observable)
    } else {
      this.observables.set(observable, observers)
    }
  }

  unregisterAllObservers<ValueT>(observable: IObservable<ValueT>): void {
    const observers = this.observables.get(observable)

    if (typeof observers === 'undefined') {
      throw new Error('Cannot unregister observer for unobserved observable')
    }

    observable.onBecomeUnobserved()
    this.observables.delete(observable)
  }

  notifyObservers<ValueT>(observable: IObservable<ValueT>, newValue: ValueT, oldValue: ValueT): void {
    const observers = this.observables.get(observable)

    if (typeof observers !== 'undefined') {
      observers.map((observer) => {

        // We should only update the observer old and new values don't equal each other.
        const equal = !!observer.options.equality?.(newValue, oldValue)

        if(!equal) {
          // The values are not equal, thus they can be updated.
          observer.onUpdate(newValue, oldValue)
        }
      })
    }
  }
}

export default (new Core())
