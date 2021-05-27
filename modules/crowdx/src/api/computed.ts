import { IObservable, IObserver, Options } from "../lib";
import Core from '../core';

type Deps = IObservable[]
type Handler<T> = () => T;

class Computed<T> implements IObservable<T>, IObserver {
  private readonly deps: Deps;
  private readonly handler: Handler<T>
  private readonly options: Options;
  private value: T;
  private observed: boolean;

  constructor(deps: Deps, handler: Handler<T>, options: Options) {
    this.deps = deps;
    this.handler = handler;
    this.options = options;
    this.value = handler();
    this.observed = false;
  }

  get(): T {
    if (!this.observed) {
      throw new Error('Cannot get value of unobserved computed')
    }

    return this.value;
  }

  onUpdate(oldValue: any, newValue: any): void {
    this.value = this.handler();
  }

  onBecomeObserved(): void {
    console.log(`computed ${this.options.debugName} onBecomeObserved`);
    this.observed = true;

    for (const dep of this.deps) {
      Core.registerObserver(dep, this);
    }
  }

  onBecomeUnobserved(): void {
    console.log(`computed ${this.options.debugName} onBecomeUnobserved`);
    this.observed = false;

    for (const dep of this.deps) {
      Core.unregisterObserver(dep, this);
    }
  }
}

const computed = <T>(deps: Deps, handler: Handler<T>, options: Options = {
  debugName: 'default',
}): Computed<T> => {
  return new Computed(deps, handler, options);
};

export default computed;