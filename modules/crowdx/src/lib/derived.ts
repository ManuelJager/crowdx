import {Store} from "./store";
import {Kind} from "./index";

export class Derived<ValueT = any> {
  private readonly __crowdx_kind__: Kind = Kind.Derived

  private readonly handler: () => ValueT;

  value: ValueT | undefined;


  constructor(handler: () => ValueT) {
    this.handler = handler;
  }

  refresh() {
    this.value = this.handler();
  }
}