import { IObservable, IObserver } from '../lib'

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
  registerObserver<T>(observable: IObservable<T>, observer: IObserver<T>) {
    let observers = this.observables.get(observable);

    if (typeof observers === 'undefined') {
      observers = [];
      observable.onBecomeObserved();
    }

    observers.push(observer)
    this.observables.set(observable, observers)
    console.log(observers);
  }

  /**
   * Unregisters an observer from a given observable
   *
   * @param observable - Observable
   * @param observer - Observer
   */
  unregisterObserver<T>(observable: IObservable<T>, observer: IObserver<T>) {
    let observers = this.observables.get(observable)

    if (typeof observers === 'undefined') {
      throw new Error('Cannot unregister observer for unobserved observable')
    }

    const index = observers.indexOf(observer);
    observers.splice(index, 1)

    if (observers.length === 0) {
      observable.onBecomeUnobserved()
      this.observables.delete(observable)
    } else {
      this.observables.set(observable, observers)
    }
  }

  unregisterAllObservers<T>(observable: IObservable<T>) {
    let observers = this.observables.get(observable)

    if (typeof observers === 'undefined') {
      throw new Error('Cannot unregister observer for unobserved observable')
    }

    observable.onBecomeUnobserved()
    this.observables.delete(observable);
  }

  notifyObservers<T>(observable: IObservable<T>, newValue: T, oldValue: T) {
    const observers = this.observables.get(observable)

    if (typeof observers !== 'undefined') {
      observers.map((observer) => observer.onUpdate(newValue, oldValue))
    }

  }
}

export default (new Core())
