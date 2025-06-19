import { createRouter, createWebHistory } from 'vue-router'
import store from '../store' 

// Importaciones de componentes
import ViewLogin from '../components/sesion/ViewLogin.vue'
import ViewRegistroUsuario from '../components/sesion/ViewRegistroUsuario.vue'
import ViewMenu from '../components/principal/ViewMenu.vue'
import ViewDispositivos from '../components/dispositivos/ViewDispositivos.vue'
import RegistroDispositivo from '../components/dispositivos/RegistroDispositivo.vue'

const routes = [
  {
    path: '/login', name: 'login', component: ViewLogin, meta: { requiresAuth: false }
  },
  {
    path: '/registro', name: 'registro', component: ViewRegistroUsuario, meta: { requiresAuth: false }
  },
  {
    path: '/', redirect: '/menu/dispositivos'
  },
  {
    path: '/menu',
    component: ViewMenu,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dispositivos',
        name: 'dispositivos',
        component: ViewDispositivos
      },
      {
        path: 'dispositivos/agregar',
        name: 'agregar_dispositivo',
        component: RegistroDispositivo
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isLoggedIn = store.getters.isLoggedIn;

  if (requiresAuth && !isLoggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default router