import { applyDefaultObserverOptions, ComputedOptions, Observable, ComputedHandler, Computed } from '../lib'

const computed = <ValueT, Deps extends {[key: string]: Observable}>(
  deps: Deps,
  handler: ComputedHandler<ValueT, Deps>,
  options: ComputedOptions<ValueT> = { }
): Computed<ValueT, Deps> => {

  applyDefaultObserverOptions(options);

  return new Computed<ValueT, Deps>(deps, handler, options)
}

export default computed
