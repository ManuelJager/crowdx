import { IObservable, IObserver, Options } from "../lib";
import Core from '../core';

type Deps = IObservable[]
type Handler<ValueT> = () => ValueT;

class Computed<ValueT> implements IObservable<ValueT>, IObserver {
  private readonly deps: Deps;
  private readonly handler: Handler<ValueT>
  private readonly options: Options;
  private value: ValueT;
  private observed: boolean;

  constructor(deps: Deps, handler: Handler<ValueT>, options: Options) {
    this.deps = deps;
    this.handler = handler;
    this.options = options;
    this.value = handler();
    this.observed = false;
  }

  get(): ValueT {
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

const computed = <ValueT>(deps: Deps, handler: Handler<ValueT>, options: Options = {
  debugName: 'default',
}): Computed<ValueT> => {
  return new Computed(deps, handler, options);
};

export default computed;
