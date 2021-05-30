import { Observable } from '../lib'

const observable = <ValueT>(value: ValueT): Observable<ValueT> => {
  return new Observable(value)
}

export default observable
