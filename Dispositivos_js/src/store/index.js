import { createStore } from 'vuex'
import SessionStore from '../servicios/SessionStore' // Importamos el SessionStore original

export default createStore({
  state: {
    // El único estado global es el del usuario
    usuario: null
  },
  mutations: {
    setUsuario(state, usuario) {
      state.usuario = usuario;
    }
  },
  actions: {
    async login(context, p) {
      const u = await SessionStore.Login(p.usr, p.psw);
      context.commit('setUsuario', u);
    }
  },
  getters: {
    getUsuario: state => {
      return state.usuario;
    }
  }
})