class SyncLoopHook {
  tasks: Function[]

  constructor() {
    this.tasks = []
  }

  tap(name: string, task: Function) {
    this.tasks.push(task)
  }

  call(...args: any[]) {
    // 当前执行task的index
    let currentTaskIdx = 0
    while (currentTaskIdx < this.tasks.length) {
      const task = this.tasks[currentTaskIdx]
      const result = task(...args)
      // 只有返回为undefined的时候才会执行下一个task，否则一直执行当前task
      if (result === undefined)
        currentTaskIdx++
    }
  }
}
