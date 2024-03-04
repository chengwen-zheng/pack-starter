import {Deferred, createDeferred} from './deferred';
import {SimpleUnwrapArray} from './types/base';

const concurrentify = <F extends (...args: any) => Promise<any>>(maxConcurrent: number, fn: F) =>{
  let queue = [] as {
    deferred: Deferred<void>;
    args: any;
    ctx: any;
  }[];;
  let concurrent = 0;

  const next = async () => {
    concurrent--;
    if (queue.length > 0) {
      const {ctx, deferred, args} = queue.shift()!;
      try {
        newFn.apply(ctx, args).then(deferred.resolve, deferred.reject);
      }catch (error: any) {
        deferred.reject(error);
      }
    }
  };

  function newFn (this: any) {
    const ctx = this;
    const args = arguments as any;

    if(concurrent >= maxConcurrent) {
      const deferred = createDeferred<void>();
      queue.push({deferred, args, ctx});
    }
    concurrent++;
    return fn.apply(ctx, args).finally(next);
  }

  return newFn as F;
}

export default concurrentify;

export const concurrentMap = <
  Arr extends readonly unknown[],
  F extends (item: SimpleUnwrapArray<Arr>, index: number, arr: Arr) => Promise<any>,
>(arr: Arr, maxConcurrent: number, cb: F) => arr.map(
  concurrentify(maxConcurrent, cb) as any,
) as ReturnType<F>[];

