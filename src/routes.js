import DashView from './components/Dash.vue'
import LoginView from './components/Login.vue'
import NotFoundView from './components/404.vue'

// Import Views - Dash
import UserView from './components/views/User.vue'
import TeamView from './components/views/Team.vue'
import TagView from './components/views/Tags.vue'
import FileView from './components/views/File'

import TasksView from './components/views/Tasks.vue'
import SettingView from './components/views/Setting.vue'
import AccessView from './components/views/Access.vue'
import ServerView from './components/views/Server.vue'
import ReposView from './components/views/Repos.vue'

// Routes
const routes = [
  {
    path: '/login',
    component: LoginView
  },
  {
    path: '/',
    component: DashView,
    children: [
      {
        path: 'user',
        alias: '',
        component: UserView,
        name: '用户信息',
        meta: {requireAuth: true}
      }, {
        path: 'team',
        component: TeamView,
        name: '团队信息',
        meta: {description: '', requiresAuth: true}
      }, {
        path: 'tag',
        component: TagView,
        name: '标签信息',
        meta: {description: '', requiresAuth: true}
      }, {
        path: 'file',
        component: FileView,
        name: '文件库',
        meta: {description: '', requiresAuth: true}
      }, {
        path: 'tasks',
        component: TasksView,
        name: 'Tasks',
        meta: {description: 'Tasks page in the form of a timeline', requiresAuth: true}
      }, {
        path: 'setting',
        component: SettingView,
        name: 'Settings',
        meta: {description: 'User settings page', requiresAuth: true}
      }, {
        path: 'access',
        component: AccessView,
        name: 'Access',
        meta: {description: 'Example of using maps', requiresAuth: true}
      }, {
        path: 'server',
        component: ServerView,
        name: 'Servers',
        meta: {description: 'List of our servers', requiresAuth: true}
      }, {
        path: 'repos',
        component: ReposView,
        name: 'Repository',
        meta: {description: 'List of popular javascript repos', requiresAuth: true}
      }
    ]
  }, {
    // not found handler
    path: '*',
    component: NotFoundView
  }
]

export default routes
