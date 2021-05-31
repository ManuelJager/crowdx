import {Computed, IObservable, Kind, Observable, DepValues, Deps} from './index'
import Core from '../core'

const reservedKeywords = [
  '__crowdx_values__',
  '__crowdx_deriveds__',
  '__crowdx_observed__',
  'constructor',
  '__crowdx_assignProperty__',
  '__crowdx_assignDerived__',
  '__crowdx_sendChanges__',
  'onBecomeObserved',
  'onBecomeUnobserved',
  'get'
]

interface Derived<ValueT = any> {
  __crowdx_kind__: Kind.Derived
  handler: () => ValueT
}

interface DefInputParameters<StoreT> {
  /**
   * A property that depends on the state from the current store
   *
   * @param handler
   */
  derived: <ValueT>(handler: (state: StoreT) => ValueT) => Derived<ValueT>

  /**
   * A property that depends on the state from the current store, and the state of the dependency object
   *
   * @param deps
   * @param handler
   */
  computed: <ValueT, Deps extends {[key: string]: Observable}>(
    deps: Deps,
    handler: (deps: DepValues<Deps> & { store: StoreT }) => ValueT
  ) => Computed<ValueT, Deps>
}

// Store definition can be either a function that return a definition, or the definition itself
export type StoreDefInput<StoreT extends { [name: string]: any}> = ((input: DefInputParameters<StoreT>) => StoreT) | StoreT

export interface StoreDef {
  [key: string]: Computed<any, any> | any
}

const guardReservedKeyword = (name: string): void => {
  for (const keyword of reservedKeywords) {
    if (keyword === name) {
      throw new Error(`${keyword} is a reserved keyword`)
    }
  }
}

export class Store<StoreT extends StoreDef> implements IObservable<StoreT> {
  // We have to use these ridiculous and ugly names to prevent library consumers from using the same names

  // Current internal state
  private readonly __crowdx_values__: { [name: string]: any } = { }

  // Setter functions for the deriveds.
  // When a setter is called, the result of the derived's handler is store into the current state
  private readonly __crowdx_deriveds__: { [name: string]: () => void } = { }

  // Whether or not we are observed
  private __crowdx_observed__ = false

  /**
   * Creates a new store using a store definition, which may be an object, or a function that returns an object
   *
   * @param def
   */
  constructor (def: StoreDefInput<StoreT>) {
    // Get store definition from function
    if (typeof def === 'function') {
      def = def({
        derived: <ValueT>(handler: (state: StoreT) => ValueT): Derived<ValueT> => {
          // Use bound handler and use store as dependency
          return {
            __crowdx_kind__: Kind.Derived,
            handler: handler.bind(this, this as unknown as StoreT)
          }
        },
        computed: <ValueT, DepsT extends Deps>(
          deps: DepsT,
          handler: (deps: DepValues<DepsT> & { store: StoreT }) => ValueT
        ): Computed<ValueT, DepsT> => {
          if (deps.hasOwnProperty('store')) {
            throw new Error('store is a reserved keyword')
          }

          deps = { ...deps, store: this }
          // @ts-ignore
          return new Computed<ValueT, DepsT & { store: StoreT }>(deps, handler);
        }
      })
    }

    // Map entries in the definition
    for (const [name, value] of Object.entries(def)) {
      guardReservedKeyword(name)

      switch (value.__crowdx_kind__) {
        case Kind.Observable:
          throw new Error(`Direct observable usage for ${name} is not supported`)
        case Kind.Computed:
          this.__crowdx_assignComputed__(name, value)
          break
        case Kind.Derived:
          this.__crowdx_assignDerived__(name, value)
          break
        default:
          this.__crowdx_assignProperty__(name, value)
      }
    }
  }

  __crowdx_assignComputed__ (name: string, value: Computed<any, any>): void {
    throw new Error('Not implemented yet');
  }

  // Assign a derived
  __crowdx_assignDerived__ (name: string, value: Derived): void {
    // Define the setter for the derived as a function that stores the result of a derived into the store state
    const setter = (): void => {
      this.__crowdx_values__[name] = value.handler()
    }

    // Initialize default value
    setter()

    // Store the setter for the derived
    this.__crowdx_deriveds__[name] = setter

    // Define readonly property
    Object.defineProperty(this, name, {
      get: () => {
        return this.__crowdx_values__[name]
      }
    })
  }

  // Assign a property
  __crowdx_assignProperty__ (name: string, value: any): void {
    // Define property that notifies changes when setting a new value
    this.__crowdx_values__[name] = value
    Object.defineProperty(this, name, {

      // Get value from state
      get: () => {
        return this.__crowdx_values__[name]
      },

      // Set value to state, and send the changes
      set: (value: any) => {
        this.__crowdx_values__[name] = value
        this.__crowdx_sendChanges__()
      }
    })
  }

  onBecomeObserved (): void {
    this.__crowdx_observed__ = true
  }

  onBecomeUnobserved (): void {
    this.__crowdx_observed__ = false
  }

  /**
   * Updates deriveds, and push the state to the observers
   */
  __crowdx_sendChanges__ (): void {
    // Update derived values
    for (const derived in this.__crowdx_deriveds__) {
      this.__crowdx_deriveds__[derived]()
    }

    Core.notifyObservers(this, this.__crowdx_values__, undefined)
  }

  get (): StoreT {
    return this.__crowdx_values__ as unknown as StoreT
  }
}
