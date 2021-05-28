import {IObservable, IObserver} from '../lib';
import { Computed, isComputed } from './computed';
import { Observable, isObservable } from "./observable";
import Core from "../core";

const reservedKeywords = [
  '__v',
  '__s',
  '__o',
  'onBecomeObserved',
  'onBecomeUnobserved'
]

const guardReservedKeyword = (name: string): void => {
  for (const keyword of reservedKeywords) {
    if (keyword === name) {
      throw new Error(`${keyword} is a reserved keyword`)
    }
  }
}

const defineProperties = <ValueT extends StoreDefinition>(thisValue: Store<ValueT>, def: ValueT): void => {
  for (const [name, value] of Object.entries(def)) {
    guardReservedKeyword(name)

    if (isObservable(value)) {
      throw new Error(`Direct observable usage for ${name} is not supported`)
    } else if (isComputed(value)) {
      throw new Error('Computed not supported');
    } else {
      // @ts-ignore
      thisValue.__v[name] = value;
      Object.defineProperty(thisValue, name, {
        get: () => {
          // @ts-ignore
          return thisValue.__v[name];
        },
        set: (value: any) => {
          // @ts-ignore
          thisValue.__v[name] = value;
          thisValue.sendChanges();
        }
      })
    }
  }
}

class Store<ValueT extends StoreDefinition> implements IObservable<ValueT> {
  // We have to use these ridiculous and ugly names to prevent library consumers from using the same names

  // Internal state
  private __v = { }

  // Whether or not we are observed
  private __o = false;

  constructor(def: ValueT) {
    defineProperties(this, def);
  }

  onBecomeObserved(): void {
    this.__o = true;
  }

  onBecomeUnobserved(): void {
    this.__o = false;
  }

  sendChanges(): void {
    if (this.__o) {
      Core.notifyObservers(this, this.__v, undefined)
    }
  }
}

type StoreDefinition = {
  [key: string]: Computed | any
}

const createStore = <ValueT extends StoreDefinition>(def: ValueT): Store<ValueT> & ValueT => {
  return (new Store(def) as (Store<ValueT> & ValueT));
}

export default createStore;