import { Computed, IObservable, Kind } from './index'
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
  'onBecomeUnobserved'
]

interface Derived<ValueT = any> {
  __crowdx_kind__: Kind.Derived
  __handler: () => ValueT
}

interface DefInputParameters<StoreT> {
  /**
   * A property that depends on the state from the current store
   *
   * @param handler
   */
  derived: <ValueT>(handler: (state: StoreT) => ValueT) => Derived<ValueT>
}

// Store definition can be either a function that return a definition, or the definition itself
export type StoreDefInput<StoreT> = ((input: DefInputParameters<StoreT>) => StoreT) | StoreT

export interface StoreDef {
  [key: string]: Computed | any
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
            __handler: handler.bind(this, this as unknown as StoreT)
          }
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
          throw new Error(`Direct computed usage for ${name} is not supported`)
        case Kind.Derived:
          this.__crowdx_assignDerived__(name, value)
          break
        default:
          this.__crowdx_assignProperty__(name, value)
      }
    }
  }

  // Assign a derived
  __crowdx_assignDerived__ (name: string, value: Derived): void {
    // Get handler for the derived
    const handler = value.__handler

    // Define the setter for the derived as a function that stores the result of a derived into the store state
    const setter = (): void => {
      this.__crowdx_values__[name] = handler()
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
}
