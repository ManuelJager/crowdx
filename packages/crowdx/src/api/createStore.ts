import { Store, StoreDef, StoreDefInput } from '../lib'

/**
 * Create an observable data store. Direct changes to any properties will push updates
 *
 * @param def
 */
const createStore = <StoreT extends StoreDef>(def: StoreDefInput<StoreT>): Store<StoreT> & StoreT => {
  return (new Store(def) as (Store<StoreT> & StoreT))
}

export default createStore
