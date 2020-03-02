<template>
  <q-page padding>
    <q-card class="table-card">
    <q-table :data="patients" :columns="columns" row-key="id" :filter="search" flat>
      <template v-slot:header-cell-onTreatment="props">
        <q-th :props="props" style="padding: 0; width: 10px">
        </q-th>
      </template>
      <template v-slot:body="props">
        <q-tr @click.native="showPatient(props.row.id)" :props="props">
          <q-td key="record" :props="props">{{props.row.record}}</q-td>
          <q-td key="name" :props="props">{{props.row.name}}</q-td>
          <q-td key="necessity" v-if="props.row.necessity.length == 1" :props="props">
            <q-badge color="green">
              {{props.row.necessity[0]}}
            </q-badge>
          </q-td>
          <q-td key="necessity" v-else-if="props.row.necessity.length == 2" :props="props">
            <q-badge color="green" class="q-mr-sm">
              {{props.row.necessity[0]}}
            </q-badge>
            <q-badge color="green">
              {{props.row.necessity[1]}}
            </q-badge>
          </q-td>
          <q-td key="necessity" v-else-if="props.row.necessity.length == 3" :props="props">
            <q-badge color="green" class="q-mr-sm">
              {{props.row.necessity[0]}}
            </q-badge>
            <q-badge color="green" class="q-mr-sm">
              {{props.row.necessity[1]}}
            </q-badge>
            <q-badge color="green">
              {{props.row.necessity[2]}}
            </q-badge>
          </q-td>
          <q-td key="onTreatment" style="background: #1976D2" :props="props" v-if="props.row.onTreatment"></q-td>
          <q-td key="onTreatment" style="background: #FFFFFF" :props="props" v-else></q-td>
        </q-tr>
      </template>
    </q-table>
    </q-card>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn rounded size="18px" label="Novo" icon="add" color="secondary" to="patients/new" />
    </q-page-sticky>
  </q-page>
</template>

<script>
import { db } from 'boot/firebase'

export default {
  name: 'Patients',
  data () {
    return {
      patients: [],
      columns: [
        {
          name: 'record',
          label: 'N°',
          field: 'record',
          sortable: true,
          align: 'left',
          style: 'width: 50px'
        },
        {
          name: 'name',
          label: 'Nome',
          field: 'name',
          sortable: true,
          align: 'left'
        },
        {
          name: 'necessity',
          label: 'Necessidade',
          field: 'necessity',
          sortable: true,
          align: 'right'
        },
        {
          name: 'onTreatment',
          label: '',
          field: 'onTreatment',
          sortable: false,
          align: 'left',
          style: 'width: 10px; padding: 0px'
        }
      ]
    }
  },
  methods: {
    showPatient (id) {
      console.log('Show patient: ' + id)
      this.$router.push({ name: 'viewPatient', params: { id } })
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
  },
  created () {
    this.$store.commit('setSearchState', true)
    db.collection('patients')
      .get()
      .then(querySnapshot => {
        const patients = []
        querySnapshot.forEach(doc => {
          patients.push({
            id: doc.id,
            name: doc.data().name,
            necessity: doc.data().necessity,
            record: doc.data().record,
            onTreatment: doc.data().onTreatment
          })
          this.patients = patients
        })
      })
  },
  destroyed () {
    this.$store.commit('setSearchState', false)
  }
}
</script>

<style>
.table-card{
  width: 100%;
  border-radius: 10px;
}
</style>
