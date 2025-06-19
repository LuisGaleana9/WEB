<template>
  <div class="register-container d-flex justify-content-center align-items-center">
    <div class="card register-card shadow-lg">
      <div class="card-body p-5">
        <div class="text-center mb-4">
          <i class="bi bi-person-plus-fill display-4 text-primary"></i>
          <h3 class="card-title mt-2">Crear Cuenta</h3>
          <p class="text-muted">Completa el formulario para registrarte</p>
        </div>

        <form @submit.prevent="registrarUsuario">
          <div class="form-floating mb-3">
            <input
              type="text"
              class="form-control"
              id="nombre"
              placeholder="Nombre"
              v-model="usuario.nombre"
              required
            />
            <label for="nombre"><i class="bi bi-person-badge me-2"></i>Nombre</label>
          </div>

          <div class="form-floating mb-3">
            <input
              type="text"
              class="form-control"
              id="apellido"
              placeholder="Apellido"
              v-model="usuario.apellido"
              required
            />
            <label for="apellido"><i class="bi bi-person-badge me-2"></i>Apellido</label>
          </div>

          <div class="form-floating mb-3">
            <input
              type="text"
              class="form-control"
              id="username"
              placeholder="Usuario"
              v-model="usuario.username"
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
              v-model="usuario.password"
              required
            />
            <label for="password"><i class="bi bi-lock me-2"></i>Contraseña</label>
          </div>
          
          <div v-if="alerta.mensaje" :class="`alert p-2 text-center ${alerta.tipo}`" role="alert">
            {{ alerta.mensaje }}
          </div>

          <div class="d-grid">
            <button type="submit" class="btn btn-primary btn-lg" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <span v-else>Registrarme</span>
            </button>
          </div>
        </form>

        <div class="text-center mt-4">
          <small class="text-muted">¿Ya tienes una cuenta?
            <router-link to="/login">Inicia sesión</router-link>
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "ViewRegistroUsuario",
  data() {
    return {
      // Objeto que coincide con lo que el backend espera: nombre, apellido, username, password
      usuario: {
        nombre: "",
        apellido: "",
        username: "", // Asegúrate de que se llame 'username' y no 'userName'
        password: "",
      },
      alerta: {
        mensaje: "",
        tipo: "", 
      },
      loading: false,
    };
  },
  methods: {
    async registrarUsuario() {
      this.loading = true;
      this.alerta = { mensaje: "", tipo: "" };
      
      try {
        // 'this.usuario' ahora tiene la estructura correcta
        await axios.post('http://localhost:8080/usuarios/register', this.usuario);

        this.alerta = {
            mensaje: '¡Registro exitoso! Redirigiendo al login...',
            tipo: 'alert-success'
        };
        
        setTimeout(() => {
            this.$router.push('/login');
        }, 2000);

      } catch (error) {
        this.alerta = {
            mensaje: error.response?.data?.error || "Ocurrió un error inesperado.",
            tipo: 'alert-danger'
        };
      } finally {
        if (this.alerta.tipo === 'alert-danger') {
            this.loading = false;
        }
      }
    },
  },
};
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  background: linear-gradient(to right top, #6d7fcc, #6377c0, #586fb4, #4e67a8, #445f9c);
}
.register-card {
  width: 100%;
  max-width: 480px;
  border: none;
  border-radius: 1rem;
}
.form-floating > label {
  padding-left: 1.5rem;
}
</style>