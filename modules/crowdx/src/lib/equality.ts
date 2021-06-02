
export type EqualityLambda<ValueT> = (newValue: ValueT, oldValue: ValueT) => boolean

export const DoubleEquals: EqualityLambda<any> = (newValue: any, oldValue: any) => newValue == oldValue;
export const TripleEquals: EqualityLambda<any> = (newValue: any, oldValue: any) => newValue === oldValue;
export const NoEquality: EqualityLambda<any> = () => false;

export const DefaultEqualityLambda: EqualityLambda<any> = TripleEquals;
