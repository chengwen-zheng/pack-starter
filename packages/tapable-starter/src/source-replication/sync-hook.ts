class SyncHook {
  // 用于保存任务的数组
  tasks: Function[]

  constructor() {
    // 用于保存添加的任务
    this.tasks = []
  }

  tap(name: string, task: Function) {
    // 注册事件
    this.tasks.push(task)
  }

  call(...args: any[]) {
    // 把注册的事件依次调用，无特殊处理
    this.tasks.forEach(task => task(...args))
  }
}
