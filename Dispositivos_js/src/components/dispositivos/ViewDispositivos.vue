<template>
  <div class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
      <h5 class="mb-0">Panel de Dispositivos (Total: {{ dispositivos.length }})</h5>
      <div class="btn-toolbar" role="toolbar">
        <div class="btn-group me-2" role="group">
          <button type="button" class="btn btn-sm btn-info" @click="getDispositivos">
            <i class="bi bi-arrow-clockwise"></i> Recargar
          </button>
        </div>
        <div class="btn-group" role="group">
          <button type="button" class="btn btn-sm btn-success" @click="start" :disabled="nIntervId !== null">
            <i class="bi bi-play-fill"></i> Iniciar Simulación
          </button>
          <button type="button" class="btn btn-sm btn-danger" @click="stop" :disabled="nIntervId === null">
            <i class="bi bi-stop-fill"></i> Detener
          </button>
        </div>
      </div>
    </div>
    <div class="card-body">
      <div v-if="dispositivos.length === 0" class="alert alert-info text-center">
        No hay dispositivos para mostrar o se están cargando...
      </div>
      <div v-else class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
        <Dispositivo 
          v-for="item in dispositivos" 
          :key="item.identifica.identificador" 
          :dispositivo="item" 
          @setDispositivo="setDispositivo" 
          @deleteDispositivo="deleteDispositivo"
        />
      </div>
    </div>
    <DispositivoDialogo :dispositivo="dispositivo"/>
  </div>
</template>

<script>
import axios from 'axios';
import Dispositivo from './Dispositivo.vue';
import DispositivoDialogo from './DispositivoDialogo.vue';

export default {
    name: 'ViewDispositivos',
    components: {
        Dispositivo,
        DispositivoDialogo
    },
    data() {
        return {
            uri: 'http://localhost:8080',
            nIntervId: null,
            dispositivo: {
                identifica: { identificador: 0, nombre: 'Cargando...', ubicacion: '', potencia: {}, voltaje: {}, corriente: {}, caudal: {} },
                opera: { potencia: {}, voltaje: {}, corriente: {}, caudal: {} }
            },
            dispositivos: []
        };
    },
    methods: {
        setDispositivo(dispositivo) {
            this.dispositivo = dispositivo;
        },
        getDispositivos() {
            axios.get(`${this.uri}/dispositivos`)
                .then(response => {
                    const flatDevices = response.data;
                    if (!flatDevices || !Array.isArray(flatDevices)) {
                        this.dispositivos = [];
                        return;
                    }
                    this.dispositivos = flatDevices.map(device => ({
                        identifica: {
                            identificador: device.id,
                            nombre: device.nombre,
                            ubicacion: device.ubicacion,
                            coordenadas: device.coordenadas || 'N/A',
                            potencia:  { nominal: 7.5, minimo: 6.5, maximo: 8.5, um: 'KW' },
                            voltaje: { nominal: 240, minimo: 220, maximo: 250, um: 'Volts' },
                            corriente: { nominal: 32, minimo: 28, maximo: 35, um: 'Amperes' },
                            caudal: { nominal: 1.0, minimo: 0.5, maximo: 1.5, um: 'm3/min' },
                        },
                        opera: {
                            potencia: { valor: (device.potencia || 0).toFixed(3), idEstatus: 1 },
                            voltaje: { valor: (device.voltaje || 240).toFixed(2), idEstatus: 1 },
                            corriente: { valor: (device.corriente || 0).toFixed(2), idEstatus: 1 },
                            caudal: { valor: (device.flujo || 0).toFixed(2), idEstatus: 1 },
                            idEstatus: 1,
                            estatus: 'Operación Normal',
                            fechaRegistro: new Date().toLocaleString()
                        },
                        estado: device.estado || 1
                    }));
                })
                .catch(error => console.error("Error al obtener dispositivos:", error));
        },
        deleteDispositivo(id) {
            if (!confirm(`¿Estás seguro de que quieres eliminar el dispositivo ID ${id}?`)) return;
            axios.post(`${this.uri}/dispositivos/delete`, { id: id })
                .then(response => {
                    alert(response.data.mensaje || 'Dispositivo eliminado.');
                    this.getDispositivos();
                })
                .catch(error => {
                    console.error("Error al eliminar:", error);
                    alert("No se pudo eliminar.");
                });
        },
        refresh() {
            if (!this.dispositivos || this.dispositivos.length === 0) return;

            this.dispositivos.forEach(item => {
                let v_conf = item.identifica.voltaje;
                let c_conf = item.identifica.corriente;
                let q_conf = item.identifica.caudal;
                let p_conf = item.identifica.potencia;

                let voltaje = Math.random() * (v_conf.maximo - v_conf.minimo) + v_conf.minimo;
                let corriente = Math.random() * (c_conf.maximo - c_conf.minimo) + c_conf.minimo;
                let caudal = Math.random() * (q_conf.maximo - q_conf.minimo) + q_conf.minimo;

                let potencia = (voltaje * corriente) / 1000;

                item.opera.voltaje.valor = voltaje.toFixed(2);
                item.opera.corriente.valor = corriente.toFixed(2);
                item.opera.caudal.valor = caudal.toFixed(2);
                item.opera.potencia.valor = potencia.toFixed(3);

                let ideVoltaje = (voltaje < v_conf.minimo || voltaje > v_conf.maximo) ? 3 : 1;
                let ideCorriente = (corriente < c_conf.minimo || corriente > c_conf.maximo) ? 3 : 1;
                let ideCaudal = (caudal < q_conf.minimo || caudal > q_conf.maximo) ? 3 : 1;
                let idePotencia = (potencia < p_conf.minimo || potencia > p_conf.maximo) ? 3 : 1;
                
                let estatusNum = Math.max(ideVoltaje, ideCorriente, ideCaudal, idePotencia);

                item.opera.idEstatus = estatusNum;
                item.opera.potencia.idEstatus = idePotencia;
                item.opera.voltaje.idEstatus = ideVoltaje;
                item.opera.corriente.idEstatus = ideCorriente;
                item.opera.caudal.idEstatus = ideCaudal;

                item.opera.estatus = estatusNum === 3 ? 'Error en Medición' : 'Operación Normal';
                item.opera.fechaRegistro = new Date().toLocaleString();
            });
        },
        start() {
            if (!this.nIntervId) this.nIntervId = setInterval(this.refresh, 2000);
        },
        stop() {
            clearInterval(this.nIntervId);
            this.nIntervId = null;
        }
    },
    created() {
        this.getDispositivos();
    },
    beforeUnmount() {
        this.stop();
    }
};
</script>