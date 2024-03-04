export interface Deferred<T> {
  resolve: (value: T) => void
  reject: (error: Error) => void
  promise: Promise<T>
}

export const createDeferred = <T>(silent?: boolean): Deferred<T> => {
  let resolve: Deferred<T>['resolve']
  let reject: Deferred<T>['reject']
  const promise = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
  })

  if (silent) {
    promise.catch(() => {})
  }
  return { resolve: resolve!, reject: reject!, promise }
}
