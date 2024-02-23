class SyncBailHook {
  tasks: Function[]
  constructor() {
    // 用于保存添加的任务
    this.tasks = []
  }

  tap(name: string, task: Function) {
    this.tasks.push(task)
  }

  call(...args: any[]) {
    for (let i = 0; i < this.tasks.length; i++) {
      const result = this.tasks[i](...args)
      // 有返回值的话，就会中断调用
      if (result !== undefined)
        break
    }
  }
}
