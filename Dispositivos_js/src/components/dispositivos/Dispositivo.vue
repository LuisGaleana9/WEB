<template>
<div class="col">
    <div class="card h-100 shadow-sm">
        <div class="card-body">
            <h5 class="card-title">{{ dispositivo.identifica.nombre }}</h5>
            <p class="card-text text-muted small">{{ dispositivo.identifica.ubicacion }}</p>
            <table class="table table-sm table-bordered">
                <thead>
                    <tr>
                        <th>Valor</th>
                        <th>Opera</th>
                        <th>Uni</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Potencia</td>
                        <th :class="getStatusClass(dispositivo.opera.potencia.idEstatus)">{{ dispositivo.opera.potencia.valor }}</th>
                        <th>{{ dispositivo.identifica.potencia.um }}</th>
                    </tr>
                    <tr>
                        <td>Voltaje</td>
                        <th :class="getStatusClass(dispositivo.opera.voltaje.idEstatus)">{{ dispositivo.opera.voltaje.valor }}</th>
                        <th>{{ dispositivo.identifica.voltaje.um }}</th>
                    </tr>
                    <tr>
                        <td>Corriente</td>
                        <th :class="getStatusClass(dispositivo.opera.corriente.idEstatus)">{{ dispositivo.opera.corriente.valor }}</th>
                        <th>{{ dispositivo.identifica.corriente.um }}</th>
                    </tr>
                    <tr>
                        <td>Caudal</td>
                        <th :class="getStatusClass(dispositivo.opera.caudal.idEstatus)">{{ dispositivo.opera.caudal.valor }}</th>
                        <th>{{ dispositivo.identifica.caudal.um }}</th>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <th colspan="3" :class="getStatusClass(dispositivo.opera.idEstatus)">Estatus: {{ dispositivo.opera.estatus }}</th>
                    </tr>
                </tfoot>
            </table>
        </div>
        <div class="card-footer d-flex justify-content-between align-items-center">
            <small class="text-body-secondary">{{ dispositivo.opera.fechaRegistro }}</small>
            <div>
              <button type="button" class="btn btn-sm btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#detalleDispositivo" @click="setDispositivo">
                Ver Detalle
              </button>
              <button type="button" class="btn btn-sm btn-outline-danger ms-2" @click="deleteD">
                Eliminar
              </button>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    name: 'Dispositivo',
    props: {
        dispositivo: {
            type: Object,
            required: true
        }
    },
    methods: {
        setDispositivo() {
            this.$emit('setDispositivo', this.dispositivo);
        },

        deleteD() {
            this.$emit('deleteDispositivo', this.dispositivo.identifica.identificador);
        },
        getStatusClass(statusId) {
            if (statusId === 3) return 'text-danger';
            if (statusId === 2) return 'text-warning';
            return 'text-success';
        }
    }
}
</script>