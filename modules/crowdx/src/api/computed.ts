import { IObservable, IObserver, Options } from "../lib";
import Core from '../core';

type Deps = IObservable[]
type Handler<T> = () => T;

class Computed<ValueType> implements IObservable<ValueType>, IObserver {
  private readonly deps: Deps;
  private readonly handler: Handler<ValueType>
  private readonly options: Options;
  private value: ValueType;
  private observed: boolean;

  constructor(deps: Deps, handler: Handler<ValueType>, options: Options) {
    this.deps = deps;
    this.handler = handler;
    this.options = options;
    this.value = handler();
    this.observed = false;
  }

  get(): ValueType {
    if (!this.observed) {
      throw new Error('Cannot get value of unobserved computed')
    }

    return this.value;
  }

  onUpdate(): void {
    const old = this.value;
    this.value = this.handler();

    Core.notifyObservers(this, this.value, old)
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
