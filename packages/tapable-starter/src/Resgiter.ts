import {
  AsyncParallelBailHook,
  AsyncParallelHook,
  AsyncSeriesBailHook,
  AsyncSeriesHook,
  AsyncSeriesWaterfallHook,
  SyncBailHook,
  SyncHook,
  SyncLoopHook,
  SyncWaterfallHook,
} from 'tapable'

class Car {
  hooks: {
    syncHook: SyncHook<[string]>
    syncBailHook: SyncBailHook<[string], string | void>
    syncWaterfallHook: SyncWaterfallHook<number, number>
    syncLoopHook: SyncLoopHook<any>
    asyncSeriesHook: AsyncSeriesHook<any>
    asyncParallelHook: AsyncParallelHook<any>
    asyncParallelBailHook: AsyncParallelBailHook<any, any>
    asyncSeriesBailHook: AsyncSeriesBailHook<any, any>
    asyncSeriesWaterfallHook: AsyncSeriesWaterfallHook<any>
  }

  constructor() {
    this.hooks = {
      syncHook: new SyncHook(['args']),
      syncBailHook: new SyncBailHook(['sum']),
      syncWaterfallHook: new SyncWaterfallHook(['score']),
      syncLoopHook: new SyncLoopHook(),
      asyncSeriesHook: new AsyncSeriesHook(),
      asyncParallelHook: new AsyncParallelHook(),
      asyncParallelBailHook: new AsyncParallelBailHook(),
      asyncSeriesBailHook: new AsyncSeriesBailHook(),
      asyncSeriesWaterfallHook: new AsyncSeriesWaterfallHook(['score']), // 标注一下，要传参数啦
    }
  }

  syncHook(args: string) {
    // 基本类型钩子
    return this.hooks.syncHook.call(args)
  }

  syncBailHook(sum: string) {
    // 同步熔断钩子
    return this.hooks.syncBailHook.call(sum)
  }

  syncWaterfallHook(score: any) {
    // 同步瀑布钩子
    return this.hooks.syncWaterfallHook.call(score)
  }

  syncLoopHook() {
    // 同步循环钩子
    return this.hooks.syncLoopHook.call()
  }

  asyncSeriesHook(callback: any) {
    // 异步串行钩子
    return this.hooks.asyncSeriesHook.callAsync(callback)
  }

  asyncParallelHook() {
    // 异步串行钩子
    return this.hooks.asyncParallelHook.promise()
  }

  asyncParallelBailHook() {
    // 异步并行钩子
    return this.hooks.asyncParallelBailHook.promise()
  }

  asyncSeriesBailHook() {
    // 异步并行熔断钩子
    return this.hooks.asyncSeriesBailHook.promise()
  }

  asyncSeriesWaterfallHook() {
    // 异步并行瀑布钩子
    return this.hooks.asyncSeriesWaterfallHook.promise()
  }
}

export default Car
