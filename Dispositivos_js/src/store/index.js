import { createStore } from 'vuex'

export default createStore({
  state: {
    usuario: null,
    dispositivos: [],
    usuarios: []
  },
  mutations: {
    setUsuario(state, usuario) {
      state.usuario = usuario
    },
    clearUsuario(state) {
        state.usuario = null
    },
    setDispositivos (state, payload) {
      state.dispositivos = payload
    }
  },
  actions: {
    logout({ commit }) {
      commit('clearUsuario');
    }
  },
  getters: {
    isLoggedIn: state => !!state.usuario,
    getUsuario: state => state.usuario
  }
})