import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/', component: () => import('pages/IndexPage.vue') },
      { path: '/about', component: () => import('pages/AboutPage.vue') },
      { path: '/admin', component: () => import('pages/AdminSettingsPage.vue') },
      { path: '/dashboard', component: () => import('pages/DashboardPage.vue') },
      { path: '/login', component: () => import('pages/LoginPage.vue') },
      { path: '/logs', component: () => import('pages/LogPage.vue') },
      { path: '/me', component: () => import('pages/UserSettingsPage.vue') },
      { path: '/moderation', component: () => import('pages/ModerationAnalyticsPage.vue') },
      { path: '/network', component: () => import('pages/NetworkAnalyticsPage.vue') },
      { path: '/player/:id', component: () => import('pages/PlayerViewPage.vue') },
      { path: '/sessions', component: () => import('pages/ActiveSessionsPage.vue') },
      { path: '/team', component: () => import('pages/TeamDashboardPage.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
