import {Observable, ObservableOptions} from '../lib'

const observable = <ValueT>(value: ValueT, options: ObservableOptions = {
  debugName: 'default'
}): Observable<ValueT> => {
  return new Observable(value, options)
}

export default observable
