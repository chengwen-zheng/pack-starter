class AsyncWaterfallHook {
  tasks: Function[]

  constructor() {
    this.tasks = []
  }

  tapAsync(name: string, task: Function) {
    this.tasks.push(task)
  }

  callAsync(...args: any[]) {
    const [first] = this.tasks
    const finalCB = args.pop()
    let index = 1
    // 这就是每个task异步执行完毕之后调用的回调函数，其中ret为上一个task的执行结果
    const next = (error: any, ret: any) => {
      if (error !== undefined)
        return

      const task = this.tasks[index++]
      if (task) {
        // task执行完毕之后，会调用next，继续执行下一个task，形成递归，直到任务全部执行完
        task(ret, next)
      }
      else {
        // 任务完毕之后，调用流程结束的回调函数
        finalCB(ret)
      }
    }
    first(...args, next)
  }

  tapPromise(name: string, task: Function) {
    this.tasks.push(task)
  }

  promise(...args: any[]) {
    const [first, ...others] = this.tasks
    return others.reduce((p, n) => {
      // then函数中返回另一个promise，可以实现promise的串行执行
      return p.then(() => n(...args))
    }, first(...args))
  }
}
