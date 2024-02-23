class AsyncParallelHook {
  tasks: Function[]
  constructor() {
    this.tasks = []
  }

  tapAsync(name: string, task: Function) {
    this.tasks.push(task)
  }

  callAsync(...args: any[]) {
    // 最后一个参数为，流程结束的回调
    const finalCB = args.pop()
    let index = 0
    // 这就是每个task执行完成时调用的回调函数
    const CB = () => {
      ++index
      // 当这个回调函数调用的次数等于tasks的个数时，说明任务都执行完了
      if (index === this.tasks.length) {
        // 调用流程结束的回调函数
        finalCB()
      }
    }
    this.tasks.forEach(task => task(...args, CB))
  }

  // task是一个promise生成器
  tapPromise(name: string, task: Function) {
    this.tasks.push(task)
  }

  // 使用promise.all实现
  promise(...args: any[]) {
    const tasks = this.tasks.map(task => task(...args))
    return Promise.all(tasks)
  }
}
