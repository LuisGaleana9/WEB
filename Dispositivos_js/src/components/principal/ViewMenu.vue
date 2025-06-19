<template>
  <div class="container-fluid vh-100 d-flex flex-column p-0">
    <nav class="navbar navbar-expand-lg bg-light shadow-sm">
      <div class="container-fluid">
        <router-link class="navbar-brand fw-bold" to="/menu/dispositivos">
          <i class="bi bi-speedometer"></i> Monitor de Dispositivos
        </router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarScroll">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link class="nav-link" active-class="active" to="/menu/dispositivos" >
                <i class="bi bi-cpu"></i> Dispositivos
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" active-class="active" to="/menu/dispositivos/agregar" >
                <i class="bi bi-plus-circle"></i> Agregar Dispositivo
              </router-link>
            </li>
          </ul>
          <ul class="navbar-nav ms-auto" v-if="isLoggedIn">
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarUserDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-person-circle"></i> {{ nombreUsuario }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarUserDropdown">
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="handleLogout">
                    <i class="bi bi-box-arrow-right"></i> Salir
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <main class="flex-grow-1 overflow-auto bg-body-tertiary">
      <div class="container-fluid p-3">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';

export default {
  name: 'ViewMenu',
  computed: {
    ...mapGetters(['isLoggedIn']),
    ...mapState(['usuario']),
    nombreUsuario() {
      return this.usuario ? `${this.usuario.nombre} ${this.usuario.apellido}` : 'Usuario';
    }
  },
  methods: {
    ...mapActions(['logout']),
    handleLogout() {
      this.logout();
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
.vh-100 {
  height: 100vh;
}
.overflow-auto {
  overflow-y: auto;
}
.nav-link.active {
    font-weight: 600;
}
</style>