import {
  ComputedOptions,
  Observable,
  ComputedHandler,
  Computed
} from '../lib'

const computed = <ValueT, Deps extends {[key: string]: Observable}>(deps: Deps, handler: ComputedHandler<ValueT, Deps>, options: ComputedOptions = {}): Computed<ValueT, Deps> => {
  return new Computed(deps, handler, options)
}

export default computed
