import { IObservable, IObserver, IObserverHandler, ObserverOptions } from ".";
import Core from "../core";

export class Observer<ValueT> implements IObserver<ValueT> {
  public onUpdate: IObserverHandler<ValueT>
  public readonly options: ObserverOptions<ValueT>

  private readonly dep: IObservable<ValueT>

  constructor (dep: IObservable<ValueT>, handler: IObserverHandler<ValueT>, options: ObserverOptions<ValueT>) {
    this.dep = dep
    this.options = options
    this.onUpdate = handler
  }

  public stop (): void {
    return Core.unregisterObserver(this.dep, this)
  }
}
