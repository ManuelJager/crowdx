import { observe } from './index'
import { IObservable } from '../lib';

type WhenCondition<ValueT> = (value: ValueT) => boolean

const when = async <ValueT>(num: IObservable<ValueT>, condition: WhenCondition<ValueT>): Promise<ValueT> => {
  return await new Promise<ValueT>((resolve) => {
    const observer = observe(num, (val) => {
      if (condition(val as ValueT)) {
        observer.stop()
        resolve(val as ValueT)
      }
    })
  })
}

export default when
