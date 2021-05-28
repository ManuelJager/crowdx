import { IObservable, IObserver } from "../lib";
import Core from '../core';
import {Kind} from "./index";
import {Observable} from "./observable";

type Deps = IObservable[]
type Handler<ValueT> = () => ValueT;

export const isComputed = (obj: any): obj is Computed => {
  return obj.__crowdx_kind__ === Kind.Computed;
}

export class Computed<ValueT = unknown> implements IObservable<ValueT>, IObserver {
  private readonly __crowdx_kind__: Kind = Kind.Computed;

  private readonly deps: Deps;
  private readonly handler: Handler<ValueT>
  private value: ValueT;
  private observed: boolean;

  constructor(deps: Deps, handler: Handler<ValueT>) {
    this.deps = deps;
    this.handler = handler;
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
    this.observed = true;

    for (const dep of this.deps) {
      Core.registerObserver(dep, this);
    }
  }

  onBecomeUnobserved(): void {
    this.observed = false;

    for (const dep of this.deps) {
      Core.unregisterObserver(dep, this);
    }
  }
}

const computed = <ValueT>(deps: Deps, handler: Handler<ValueT>): Computed<ValueT> => {
  return new Computed(deps, handler);
};

export default computed;
