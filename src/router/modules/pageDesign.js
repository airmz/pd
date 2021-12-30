/*
 * @Author: airmz
 * @Date: 2021-12-11 10:25:00
 * @LastEditTime: 2021-12-17 11:01:39
 * @FilePath: /pd/src/router/modules/pageDesign.js
 */
// import local from 'COMMON/pageDesign/index/local'
// import cloud from 'COMMON/pageDesign/index/cloud'
// import activity from 'COMMON/pageDesign/index/activity'
// import login from 'VIEWS/pageDesign/login'

// export default [
//   {
//     path: '/pageDesign',
//     name: 'pageDesign',
//     component: pageDesign
//   },
//   {
//     path: '/local',
//     name: 'local',
//     component: local
//   },
//   {
//     path: '/',
//     name: 'login',
//     component: login
//   },
//   {
//     path: '/activity',
//     name: 'activity',
//     component: activity
//   },
//   {
//     path: '/cloud',
//     name: 'cloud',
//     component: cloud
//   }
// ]

const pageDesign = r => require.ensure([], () => r(require('VIEWS/pageDesign/index.vue')), 'pageDesign')
export default [
  {path: '/', component: resolve => require(['VIEWS/pageDesign/login.vue'], resolve)}, // 路由懒加载
  {path: '/login', component: resolve => require(['VIEWS/pageDesign/login.vue'], resolve)},
  {
    path: '/main',
    component: pageDesign,
    children: [
      {path: '', component: resolve => require(['VIEWS/pageDesign/index.vue'], resolve)}
    ]
  }
]
