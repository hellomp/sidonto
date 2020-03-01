<template>
  <q-page padding>
    <q-form @submit="savePatient">
    <div class="row q-col-gutter-sm">
      <div class="col-sm-8 col-xs-12">
        <q-input
          outlined
          label="Nome"
          v-model="newPatient.name"
          :rules="[ val => val && val.length > 0 || 'Digite o nome do paciente']"
        />
      </div>
      <div class="col-sm-4 col-xs-12">
        <q-input
          outlined
          label="RG"
          v-model="newPatient.rg"
          :rules="[ val => val && val.length > 0 || 'Digite o RG']"
        />
      </div>
      <div class="col-sm-4 col-xs-12">
        <q-input
          outlined
          label="CPF"
          v-model="newPatient.cpf"
          :rules="[ val => val && val.length > 0 || 'Digite o CPF']"
        />
      </div>
      <div class="col-sm-8 col-xs-12">
        <q-input
          outlined
          label="Email"
          v-model="newPatient.email"
          type="email"
        />
      </div>
      <div class="col-sm-8 col-xs-12">
        <q-input
          outlined
          label="Endereço"
          v-model="newPatient.address"
          :rules="[ val => val && val.length > 0 || 'Digite o endereço']"
        />
      </div>
      <div class="col-sm-4 col-xs-12">
        <q-input
          outlined
          label="Cidade"
          v-model="newPatient.city"
          :rules="[ val => val && val.length > 0 || 'Digite a cidade']"
        />
      </div>
      <div class="col-sm-6 col-xs-12">
        <q-input
          outlined
          label="Telefone 1"
          v-model="newPatient.phone1"
          unmasked-value
          mask="(##)#####-####"
          :rules="[ val => val && val.length > 0 || 'Digite o telefone']"
        />
      </div>
      <div class="col-sm-6 col-xs-12">
        <q-input
          outlined
          label="Telefone 2"
          v-model="newPatient.phone2"
          unmasked-value
          mask="(##)#####-####"
        />
      </div>
      <div class="col-sm-4 col-xs-12">
        <q-input
          outlined
          label="Nascimento"
          v-model="newPatient.birthDate"
          unmasked-value
          mask="##/##/####"
          :rules="[ val => val && val.length > 0 || 'Digite a data de nascimento']"
        />
      </div>
      <div class="col-sm-8 col-xs-12">
        <q-select
          label="Necessidade"
          outlined
          use-input
          multiple
          map-options
          input-debounce="0"
          :options="necessities"
          v-model="newPatient.necessity"
          :rules="[ val => val && val.length > 0 || 'Selecione uma necessidade']"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                Sem resultados
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div class="col-xs-12">
        <q-input
          outlined
          label="Motivo da consulta"
          type="textarea"
          v-model="newPatient.motive"
        />
      </div>
      <div class="col-xs-12">
        <q-btn label="Salvar" type="submit" color="primary" class="q-mr-sm"/>
        <q-btn label="Cancelar" flat color="primary" to="/" />
      </div>
    </div>
    </q-form>
  </q-page>
</template>

<script>
import { db } from 'boot/firebase'

const stringNecessities = [
  'Endodontia simples',
  'Endodontia complexa',
  'Cirurgia simples',
  'Cirurgia complexa',
  'Periodontia simples',
  'Periodontia complexa',
  'Dentistica simples',
  'Dentistica complexa',
  'Prótese total',
  'Prótese fixa',
  'Prótese parcial removível',
  'Extensão de DTM'
]

export default {
  name: 'NewPatient',
  data () {
    return {
      necessities: stringNecessities,
      newPatient: {
        name: '',
        rg: '',
        email: '',
        cpf: '',
        phone1: '',
        phone2: '',
        birthDate: '',
        necessity: [],
        motive: '',
        city: '',
        address: ''
      }
    }
  },
  methods: {
    filterFn (val, update) {
      if (val === '') {
        update(() => {
          this.necessity = stringNecessities
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.necessity = stringNecessities.filter(v => v.toLowerCase().indexOf(needle) > -1)
      })
    },
    savePatient () {
      db.collection('misc').doc('config').get()
        .then(doc => {
          const record = doc.data().actualRecord
          const vm = this
          db.collection('patients').add({
            record: record,
            name: this.newPatient.name,
            rg: this.newPatient.rg,
            email: this.newPatient.email,
            cpf: this.newPatient.cpf,
            phone1: this.newPatient.phone1,
            phone2: this.newPatient.phone2,
            address: this.newPatient.address,
            city: this.newPatient.city,
            birthDate: this.newPatient.birthDate,
            necessity: this.newPatient.necessity,
            motive: this.newPatient.motive,
            treatments: [],
            exams: []
          })
            .then(function (docRef) {
              console.log('Document written with ID: ', docRef.id)
              db.collection('misc').doc('config').set({
                actualRecord: record + 1
              }).then(() => {
                vm.$router.replace({ name: 'patients' })
              })
            })
            .catch(function (error) {
              console.error('Error adding document: ', error)
            })
        })
    }
  }
}
</script>

<style>
</style>
