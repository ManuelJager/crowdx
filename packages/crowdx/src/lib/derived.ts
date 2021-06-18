export class Derived<ValueT = any> {
  readonly handler: () => ValueT

  constructor (handler: () => ValueT) {
    this.handler = handler
  }
}
