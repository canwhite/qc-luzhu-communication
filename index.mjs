
import { getMicroAppStateActions } from './globalState.mjs'
import { initGlobalState } from './globalState.mjs'
const AppStatus = {   
  NOT_LOADED : "NOT_LOADED",
  LOADING : "LOADING",
  LOADED : "LOADED",
  BOOTSTRAPPING : "BOOTSTRAPPING",
  NOT_MOUNTED : "NOT_MOUNTED",
  MOUNTING : "MOUNTING",
  MOUNTED : "MOUNTED",
  UNMOUNTING : "UNMOUNTING"
}



let appList = [];

const setAppList = (list) => {
    appList = list;
    //刚开始进来初始化都是NOT_LOADED,方便后边走钩子
    appList.map((app) => {
      app.status = AppStatus.NOT_LOADED
    })
}

const getAppList = () => {
    return appList
}


//注册方法
const registerMicroApps = (
    appList
  ) => {
    setAppList(appList)
    // 省略 lifeCycle 等
}



//启动方法
const start = ()=>{

    const list = getAppList()
    if (!list.length) {
      throw new Error('请先注册应用')
    }
    /** 
    pass：（1）写工具，重写路由监听，方便维护一个池子，切换和监听路由
    pass：（2）reroute方法触发，reroute(window.location.href) ，
              location.pathname和我们注册的url做对比，找到当前活跃子应用
    pass：（3) 走主应用钩子和对应子应用钩子，通过parser拿到对应子应用的html/css/js资源
              可以单独写对应的parser，也可以用三方包import-html-entry
    */

    //这里我们直接每个都挂一个
    list.map(appInfo=>{
        //拿到name，生成id，挂载actions
        const {name} = appInfo;
        const appInstanceId = `${name}_${+new Date()}_${Math.floor(Math.random() * 1000)}`;
        const actions = getMicroAppStateActions(appInstanceId);
        appInfo.actions = actions;
        return appInfo;
    })
    // setAppList(list);

}

/** 
 * 主应用里注册启动和挂载globalState
 */


const registerList = [
  {
    name: 'vue',
    activeRule: '/vue',
    container: '#micro-container',
    entry: 'http://localhost:8080',
  },
];
registerMicroApps(registerList);

start();



const actions = initGlobalState({a:"123"});
//  console.log(actions);


actions.onGlobalStateChange((state, prev) => {
    // state: 变更后的状态; prev 变更前的状态
    console.log("---main--- s,p",state, prev);
});

 
actions.setGlobalState({a:"467"}); 




//子应用接收
appList[0].actions.onGlobalStateChange((state)=>{
  console.log("---sub--- s,p",state);
},true)


//子应用触发
appList[0].actions.setGlobalState({
    a:"789"
})














