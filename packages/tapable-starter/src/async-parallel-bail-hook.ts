// index.js
import Resgiter from './Resgiter'

const resgiter = new Resgiter()

console.time('timer')
// A完成任务以后，就立马执行最终结果
resgiter.hooks.asyncParallelBailHook.tapPromise('countTotalScorePligin', () => {
  // 第一个注册的插件完成后，立马执行最终的回掉函数,只有第一个注册的回调才能熔断其他注册的回调
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('A，我执行需要1s！')
      resolve('A') // 值必须为非undefined
    }, 1000)
  })
})

resgiter.hooks.asyncParallelBailHook.tapPromise('countTotalScorePligin', () => {
  return new Promise((resolve, reject) => {
    // setTimeout(() => {
    //   console.log("B，我执行需要3s！"); // B已经被熔断，不会影响最后结果的执行时机，但是其定时器已经被开启，最终还是会执行打印
    //   resolve();
    // }, 3000);
    console.log('B，我执行需要3s！') // B已经被熔断，不会影响最后结果的执行时机，但是其定时器已经被开启，最终还是会执行打印
    resolve(undefined)
  })
})

resgiter.asyncParallelBailHook().then((data: any) => {
  console.timeEnd('timer') // 总时间在一秒左右
  console.log('最终的结果！', data)
})
