<template>
  <div>
    <h2>Dispositivos de Bombeo</h2>
    <hr />
    <button @click="iniciarSimulacion" class="btn btn-info">Iniciar Simulación</button>
    <button @click="detenerSimulacion" class="btn btn-warning">Detener Simulación</button>
    <div class="row">
      <div v-for="d in dispositivos" :key="d.id" class="col-md-4">
        <Dispositivo :dispositivo="d" @onVerDetalle="verDetalle" @onEliminar="eliminar" />
      </div>
    </div>
    <DispositivoDialogo :dispositivo="dispositivo" @onClose="cerrarDialogo" />
  </div>
</template>

<script>
import Dispositivo from './Dispositivo.vue';
import DispositivoDialogo from './DispositivoDialogo.vue';
import dsDispositivos from '../../servicios/dsDispositivos';
import { Modal } from 'bootstrap';

export default {
  name: 'ViewDispositivos',
  components: { Dispositivo, DispositivoDialogo },
  data() {
    return {
      dispositivos: [],
      dispositivo: {},
      dialogo: null,
      intervalo: null,
    };
  },
  async created() {
    this.dispositivos = await dsDispositivos.getDispositivos();
  },
  mounted() {
    this.dialogo = new Modal(document.getElementById('dispositivoDialogo'));
  },
  methods: {
    verDetalle(d) {
      this.dispositivo = d;
      this.dialogo.show();
    },
    cerrarDialogo() {
      this.dialogo.hide();
    },
    async eliminar(id) {
      if (confirm('¿Desea eliminar el dispositivo?')) {
        await dsDispositivos.eliminarDispositivo(id);
        this.dispositivos = await dsDispositivos.getDispositivos();
      }
    },
    iniciarSimulacion() {
      this.intervalo = setInterval(() => {
        this.dispositivos.forEach((d) => {
          d.Flujo = (Math.random() * (12 - 8) + 8).toFixed(2);
          d.Presion = (Math.random() * (60 - 40) + 40).toFixed(2);
          d.Potencia = (Math.random() * (25 - 18) + 18).toFixed(2);
          d.NivelAgua = (Math.random() * (100 - 60) + 60).toFixed(2);
        });
      }, 1000);
    },
    detenerSimulacion() {
      clearInterval(this.intervalo);
    },
  },
};
</script>