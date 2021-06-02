import { Observable } from './observable'
import { observe } from './index'

type WhenCondition<ValueT> = (value: ValueT) => boolean

const when = async <ValueT>(num: Observable<ValueT>, condition: WhenCondition<ValueT>): Promise<ValueT> => {
  return await new Promise<ValueT>((resolve) => {
    observe(num, (val) => {
      if (condition(val as ValueT)) {
        resolve(val as ValueT)
      }
    })
  })
}

export default when