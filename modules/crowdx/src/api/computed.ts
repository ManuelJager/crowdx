import {
  ComputedOptions,
  Observable,
  ComputedHandler,
  Computed,
  Deps
} from '../lib'

const computed = <ValueT, DepsT extends Deps>(
  deps: DepsT,
  handler: ComputedHandler<ValueT, DepsT>,
  options: ComputedOptions | undefined = undefined
): Computed<ValueT, DepsT> => {
  return new Computed(deps, handler, options)
}

export default computed
