<template>
  <div class="login-container d-flex justify-content-center align-items-center">
    <div class="card login-card shadow-lg">
      <div class="card-body p-5">
        <div class="text-center mb-4">
          <i class="bi bi-box-arrow-in-right display-4 text-success"></i>
          <h3 class="card-title mt-2">Iniciar Sesión</h3>
          <p class="text-muted">Ingresa tus credenciales para continuar</p>
        </div>

        <form @submit.prevent="iniciarSesion">
          <div class="form-floating mb-3">
            <input
              type="text"
              class="form-control"
              id="username"
              placeholder="Usuario"
              v-model="username"
              required
            />
            <label for="username"><i class="bi bi-person me-2"></i>Nombre de Usuario</label>
          </div>

          <div class="form-floating mb-4">
            <input
              type="password"
              class="form-control"
              id="password"
              placeholder="Contraseña"
              v-model="password"
              required
            />
            <label for="password"><i class="bi bi-lock me-2"></i>Contraseña</label>
          </div>
          
          <div v-if="mensajeError" class="alert p-2 text-center alert-danger" role="alert">
            {{ mensajeError }}
          </div>

          <div class="d-grid">
            <button type="submit" class="btn btn-success btn-lg">
              <span>Entrar</span>
            </button>
          </div>
        </form>

        <div class="text-center mt-4">
          <small class="text-muted">¿No tienes una cuenta?
            <router-link to="/registro">Crea una ahora</router-link>
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import axios from 'axios';

const username = ref('');
const password = ref('');
const mensajeError = ref('');

const store = useStore();
const router = useRouter();

const iniciarSesion = async () => {
  mensajeError.value = '';
  try {
    const response = await axios.post('http://localhost:8080/usuarios/login', {
      username: username.value,
      password: password.value
    });

    console.log('Datos recibidos del backend:', response.data.user); 

    store.commit('setUsuario', response.data.user);
    router.push('/');

  } catch (error) {
    if (error.response && error.response.data.error) {
      mensajeError.value = error.response.data.error;
    } else {
      mensajeError.value = 'No se pudo iniciar sesión. Inténtalo de nuevo.';
    }
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(to right top, #2a7d53, #2e8b57, #35995c, #3da760, #45b665);
}
.login-card {
  width: 100%;
  max-width: 480px;
  border: none;
  border-radius: 1rem;
}
.form-floating > label {
  padding-left: 1.5rem;
}
</style>