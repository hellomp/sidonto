import Vue from 'vue'
import Vuex from 'vuex'

// import example from './module-example'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      // example
    },
    state: {
      searchString: '',
      searchActive: false,
      user: {
        loggedIn: false,
        data: null
      }
    },
    getters: {
      user (state) {
        return state.user
      }
    },
    mutations: {
      updateSearch (state, string) {
        state.searchString = string
      },
      setSearchState (state, value) {
        state.searchActive = value
      },
      SET_LOGGED_IN (state, value) {
        state.user.loggedIn = value
      },
      SET_USER (state, data) {
        state.user.data = data
      }
    },
    actions: {
      fetchUser ({ commit }, user) {
        commit('SET_LOGGED_IN', user !== null)
        if (user) {
          commit('SET_USER', {
            displayName: user.displayName,
            email: user.email
          })
        } else {
          commit('SET_USER', null)
        }
      }
    },
    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  return Store
}
