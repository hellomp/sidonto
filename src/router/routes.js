
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      /* {
        path: '',
        name: 'home',
        component: () => import('pages/Index.vue')
      }, */
      /* {
        path: 'login',
        name: 'login',
        component: () => import('pages/Login.vue')
      }, */
      {
        path: '',
        name: 'patients',
        component: () => import('pages/patients/Patients.vue')
        /* meta: {
          requiresAuth: true
        } */
      },
      {
        path: 'patients/new',
        component: () => import('pages/patients/NewPatient.vue')
        /* meta: {
          requiresAuth: true
        } */
      },
      {
        path: 'patients/patient/:id',
        name: 'viewPatient',
        component: () => import('pages/patients/ViewPatient.vue'),
        meta: {
          requiresAuth: true
        }
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
