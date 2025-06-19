<template>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow bg-dark text-white">
          <div class="card-header">
            <h3>Registrar Nuevo Dispositivo</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="guardar">
              <div class="mb-3">
                <label for="nombre" class="form-label">Nombre del Dispositivo</label>
                <input type="text" class="form-control" id="nombre" v-model="nombre" required>
              </div>
              <div class="mb-3">
                <label for="ubicacion" class="form-label">Ubicación</label>
                <input type="text" class="form-control" id="ubicacion" v-model="ubicacion" required>
              </div>
              <button type="submit" class="btn btn-primary">Guardar</button>
            </form>
            <div v-if="mensaje" class="alert mt-3" :class="error ? 'alert-danger' : 'alert-success'">
              {{ mensaje }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dsDispositivos from '../../servicios/dsDispositivos.js';

export default {
  name: 'RegistroDispositivo',
  data() {
    return {
      nombre: '',
      ubicacion: '',
      mensaje: '',
      error: false
    }
  },
  methods: {
    async guardar() {
      this.mensaje = '';
      this.error = false;
      if(!this.nombre || !this.ubicacion) {
        this.mensaje = "Ambos campos son obligatorios.";
        this.error = true;
        return;
      }
      try {
        await dsDispositivos.agregarDispositivo({ 
          nombre: this.nombre, 
          ubicacion: this.ubicacion 
        });
        this.mensaje = 'Dispositivo guardado con éxito. Redirigiendo a la lista...';
        this.error = false;
        
        setTimeout(() => {
          this.$router.push({ name: 'dispositivos' });
        }, 2000);

      } catch(error) {
        this.mensaje = 'Error al guardar el dispositivo.';
        this.error = true;
      }
    }
  }
}
</script>