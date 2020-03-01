<template>
  <q-layout
    view="hHh Lpr lff"
    container
    style="height: 100vh; max-width: 100vw;"
  >
    <q-header>
      <q-toolbar>
        <!-- <q-btn
          flat
          @click="drawer = !drawer"
          round
          dense
          icon="menu"
        /> -->
        <q-toolbar-title
          v-if="$q.screen.gt.xs"
          style="min-width: fit-content"
        >
          <span class="q-ml-sm">SISODONTO</span>
        </q-toolbar-title>
        <q-input
          dark
          dense
          standout
          v-model="search"
          placeholder="Procurar paciente"
          v-if="$store.state.searchActive"
          id="search-bar"
        >
          <template v-slot:prepend>
            <q-icon
              v-if="search === ''"
              name="search"
            />
            <q-icon
              v-else
              name="clear"
              class="cursor-pointer"
              @click="search = ''"
            />
          </template>
        </q-input>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'MainLayout',
  data () {
    return {
      drawer: false
    }
  },
  computed: {
    search: {
      get () {
        return this.$store.state.searchString
      },
      set (string) {
        this.$store.commit('updateSearch', string)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.menu-list .q-item {
  border-radius: 0 32px 32px 0;
}
.q-page-container{
  width: 75%;
  margin: 0 auto;
}
.q-field {
    width: 100%;
    margin: 0 1rem;
  }
@media only screen and (max-width: 768px) {
  .q-page-container{
    width: 100%;
    margin: 0;
  }
.q-field {
    width: 100%;
    margin: 0;
  }
}
</style>
