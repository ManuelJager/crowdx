import {Computed, Derived, IObservable, Kind} from "./index";
import Core from "../core";

const reservedKeywords = [
  '__v',
  '__s',
  '__o',
  'onBecomeObserved',
  'onBecomeUnobserved'
]

type FilteredKeys<T> = {
  [K in keyof T as T[K] extends Derived ? never : K]: T[K]
}

interface DefInputParameters<StoreT> {
  /**
   * A property that depends on the state from the current store
   *
   * @param handler
   */
  derived: <ValueT>(handler: (state: FilteredKeys<StoreT>) => ValueT) => Derived<ValueT>
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

  // Internal state
  private readonly __v: { [name: string]: any } = { }
  private readonly __d: { [name: string]: Derived } = { }

  // Whether or not we are observed
  private __o = false

  constructor (def: StoreDefInput<StoreT>) {
    // Get store definition from function
    if (typeof def === 'function') {
      def = def({
        derived: <ValueT>(handler: (state: FilteredKeys<StoreT>) => ValueT) => {
          // Use bound handler and use store as dependency
          return new Derived<ValueT>(handler.bind(this, this as unknown as FilteredKeys<StoreT>))
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
          // Define readonly property
          value.refresh()
          this.__d[name] = value;
          Object.defineProperty(this.__v, name, {
            get: () => {
              return this.__d[name].value;
            }
          })
          Object.defineProperty(this, name, {
            get: () => {
              return this.__d[name].value;
            }
          })
          break;
        default:
          // Define property that notifies changes when setting a new value
          this.__v[name] = value
          Object.defineProperty(this, name, {
            get: () => {
              return this.__v[name]
            },
            set: (value: any) => {
              this.__v[name] = value
              this.sendChanges()
            }
          })
      }
    }
  }

  onBecomeObserved (): void {
    this.__o = true
  }

  onBecomeUnobserved (): void {
    this.__o = false
  }

  sendChanges (): void {
    // Update derived values
    for (const derived in this.__d) {
      this.__d[derived].refresh()
    }

    Core.notifyObservers(this, this.__v, undefined)
  }
}