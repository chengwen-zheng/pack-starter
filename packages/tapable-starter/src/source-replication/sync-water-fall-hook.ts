class SyncWaterfallHook {
  tasks: Function[]

  constructor() {
    this.tasks = []
  }

  tap(name: string, task: Function) {
    this.tasks.push(task)
  }

  call(...args: any[]) {
    const [first, ...others] = this.tasks
    const result = first(...args)
    // 上一个task的返回值会作为下一个task的函数参数
    others.reduce((result, task) => {
      return task(result)
    }, result)
  }
}
