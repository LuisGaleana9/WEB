import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' }
});

export default {
    async getDispositivos() {
        try {
            const response = await apiClient.get('/dispositivos');
            return response.data;
        } catch (error) { return []; }
    },
    async agregarDispositivo(dispositivoData) {
        try {
            const response = await apiClient.post('/dispositivos', dispositivoData);
            return response.data;
        } catch (error) { throw error; }
    },
    async eliminarDispositivo(id) {
        try {
            const response = await apiClient.post('/dispositivos/delete', { id: id });
            return response.data;
        } catch (error) { throw error; }
    }
}