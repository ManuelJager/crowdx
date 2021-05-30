import { Computed, ComputedDeps, ComputedHandler } from '../lib'

const computed = <ValueT>(deps: ComputedDeps, handler: ComputedHandler<ValueT>): Computed<ValueT> => {
  return new Computed(deps, handler)
}

export default computed
