<template>
  <q-page padding>
    <div class="row justify-between items-center">
      <div class="row no-wrap items-center">
        <q-btn round flat icon="arrow_back" to="/"/>
        <h5 class="q-ml-sm q-mb-sm q-mt-sm">Nº {{patient.record}}</h5>
      </div>
      <q-btn
        color="primary"
        label="Editar"
        flat
        @click="enterEditMode()"
        v-if="!editMode"
      />
      <div v-else>
      <q-btn
        color="primary"
        label="Cancelar"
        flat
        @click="exitEditMode()"
      />
      <q-btn
        color="primary"
        label="Salvar"
        @click="updatePatient()"
      />
      </div>
    </div>
    <div class="row q-col-gutter-xs">
      <div class="col-sm-8 col-xs-12">
        <q-input
          v-model="patient.name"
          outlined
          label="Nome"
          :readonly="!editMode"
          stack-label
        />
      </div>
      <div class="col-sm-4 col-xs-12">
        <q-input
          v-model="patient.rg"
          outlined
          label="RG"
          :readonly="!editMode"
          stack-label
        />
      </div>
      <div class="col-sm-4 col-xs-12">
        <q-input
          v-model="patient.cpf"
          outlined
          label="CPF"
          :readonly="!editMode"
          stack-label
        />
      </div>
      <div class="col-sm-8 col-xs-12">
        <q-input
          v-model="patient.email"
          outlined
          label="Email"
          type="email"
          :readonly="!editMode"
          stack-label
        />
      </div>
      <div class="col-sm-8 col-xs-12">
        <q-input
          v-model="patient.address"
          outlined
          label="Endereço"
          type="address"
          :readonly="!editMode"
          stack-label
        />
      </div>
      <div class="col-sm-4 col-xs-12">
        <q-input
          v-model="patient.city"
          outlined
          label="Cidade"
          :readonly="!editMode"
          stack-label
        />
      </div>
      <div class="col-sm-6 col-xs-12">
        <q-input
          v-model="patient.phone1"
          outlined
          label="Telefone 1"
          :readonly="!editMode"
          stack-label
          unmasked-value
          mask="(##)#####-####"
        />
      </div>
      <div class="col-sm-6 col-xs-12">
        <q-input
          v-model="patient.phone2"
          outlined
          label="Telefone 2"
          :readonly="!editMode"
          stack-label
          unmasked-value
          mask="(##)#####-####"
        />
      </div>
      <div class="col-sm-4 col-xs-12">
        <q-input
          v-model="patient.birthDate"
          outlined
          label="Nascimento"
          :readonly="!editMode"
          stack-label
          unmasked-value
          mask="##/##/####"
        />
      </div>
      <div class="col-sm-8 col-xs-12">
        <q-select
          v-model="patient.necessity"
          label="Necessidade"
          outlined
          use-input
          multiple
          map-options
          input-debounce="0"
          :options="motives"
          @filter="filterMotives"
          :readonly="!editMode"
          stack-label
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
          v-model="patient.motive"
          outlined
          label="Motivo da consulta"
          type="textarea"
          :readonly="!editMode"
          stack-label
        />
      </div>
    </div>
    <q-card class=" q-mt-md">
      <q-item tag="label" v-ripple>
        <q-item-section>
          <q-item-label v-if="patient.onTreatment">Em tratamento</q-item-label>
          <q-item-label v-else>Em espera</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-toggle :disable="!editMode" color="blue" v-model="patient.onTreatment"/>
        </q-item-section>
      </q-item>
    </q-card>
    <div class="row q-mt-md">
      <q-card class="table-card bg-grey-1">
      <q-markup-table
        flat
        style="width: 100%"
      >
        <thead>
           <tr>
            <th colspan="3">
             <div class="row no-wrap items-center justify-between">
                <h6 class="q-mb-sm q-mt-sm">Atendimentos</h6>
                <q-btn
                  color="primary"
                  label="Novo atendimento"
                  flat
                  @click="newTreatmentDialog = true"
                />
             </div>
            </th>
          </tr>
          <tr>
            <th class="text-left">Disciplina</th>
            <th class="text-left">Alunos</th>
            <th class="text-right">Data do atendimento</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="patient.treatments.length == 0">
              <td colspan="3">
                <div class="row items-center justify-center">
                  Nenhum atendimento cadastrado
                </div>
              </td>
           </tr>
            <tr v-else v-for="treatment in patient.treatments" v-bind:key="treatment.id" @click="viewTreatment(treatment.id)">
              <td class="text-left">{{treatment.discipline}}</td>
              <td class="text-left">{{treatment.student1}}/{{treatment.student2}}</td>
              <td class="text-right">{{treatment.date}}</td>
           </tr>
        </tbody>
      </q-markup-table>
      </q-card>
    </div>
    <div class="row q-mt-md">
      <q-card class="table-card">
      <q-markup-table
        flat
        style="width: 100%"
      >
        <thead>
          <tr>
            <th colspan="2">
              <div class="row no-wrap items-center justify-between">
                <h6 class="q-mb-sm q-mt-sm">Exames</h6>
                <q-btn
                  color="primary"
                  label="Novo exame"
                  flat
                  @click="newExamDialog = true"
                />
              </div>
            </th>
          </tr>
          <tr>
            <th class="text-left">Nome</th>
            <th class="text-right">Data do exame</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="patient.exams.length == 0">
              <td colspan="2">
                <div class="row items-center justify-center">
                  Nenhum exame cadastrado
                </div>
              </td>
           </tr>
          <tr v-else v-for="exam in patient.exams" v-bind:key="exam.id" @click="viewExam(exam.id)">
            <td class="text-left">{{exam.description}}</td>
            <td class="text-right">{{exam.date}}</td>
          </tr>
        </tbody>
      </q-markup-table>
      </q-card>
    </div>

    <q-dialog
      v-model="newTreatmentDialog"
      :maximized="!$q.screen.gt.xs"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card>
        <q-form @submit="saveTreatment">
        <q-card-section>
          <div class="text-h6">Novo atendimento</div>
        </q-card-section>
        <q-card-section>
          <div class="row q-col-gutter-sm">
            <div class="col-sm-6 col-xs-12">
              <q-input
                outlined
                label="Aluno Cirurgião"
                v-model="newTreatment.student1"
                :rules="[ val => val && val.length > 0 || 'Digite o nome do aluno']"
              />
            </div>
            <div class="col-sm-6 col-xs-12">
              <q-input
                outlined
                label="Aluno Auxiliar"
                v-model="newTreatment.student2"
                :rules="[ val => val && val.length > 0 || 'Digite o nome do aluno']"
              />
            </div>
            <div class="col-xs-12">
              <q-input
                outlined
                label="Professor"
                v-model="newTreatment.professor"
                :rules="[ val => val && val.length > 0 || 'Digite o nome do professor']"
              />
            </div>
            <div class="col-xs-12">
              <q-input
                outlined
                label="Descrição"
                type="textarea"
                v-model="newTreatment.description"
              />
            </div>
            <div class="col-sm-6 col-xs-12">
              <q-select
                label="Disciplina"
                outlined
                use-input
                input-debounce="0"
                :options="disciplines"
                v-model="newTreatment.discipline"
                :rules="[ val => val && val.length > 0 || 'Selecione a disciplina']"
                stack-label
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
            <div class="col-sm-6 col-xs-12">
              <q-input
                outlined
                label="Data do atendimento"
                v-model="newTreatment.date"
                mask="##/##/####"
                :rules="[ val => val && val.length > 0 || 'Digite a data']"
              >
                <template v-slot:append>
                  <q-icon
                    name="event"
                    class="cursor-pointer"
                  >
                    <q-popup-proxy
                      ref="qDateProxy"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="newTreatment.date"
                        mask="DD/MM/YYYY"
                        @input="() => $refs.qDateProxy.hide()"
                      />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            type="reset"
            label="Cancelar"
            color="primary"
            v-close-popup
          />
          <q-btn
            flat
            label="Salvar"
            color="primary"
            v-close-popup
            type="submit"
          />
        </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="viewTreatmentDialog"
      :maximized="!$q.screen.gt.xs"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card>
        <q-form>
        <q-card-section>
          <div class="row q-col-gutter-sm">
            <div class="col-sm-6 col-xs-12">
              <q-input
                readonly
                outlined
                label="Aluno Cirurgião"
                v-if="patient.treatments[actualTreatment] != undefined"
                v-model="patient.treatments[actualTreatment].student1"
              />
            </div>
            <div class="col-sm-6 col-xs-12">
              <q-input
                readonly
                outlined
                label="Aluno Auxiliar"
                v-if="patient.treatments[actualTreatment] != undefined"
                v-model="patient.treatments[actualTreatment].student2"
              />
            </div>
            <div class="col-xs-12">
              <q-input
                readonly
                outlined
                label="Professor"
                v-if="patient.treatments[actualTreatment] != undefined"
                v-model="patient.treatments[actualTreatment].professor"
              />
            </div>
            <div class="col-xs-12">
              <q-input
                readonly
                outlined
                label="Descrição"
                type="textarea"
                v-if="patient.treatments[actualTreatment] != undefined"
                v-model="patient.treatments[actualTreatment].description"
              />
            </div>
            <div class="col-sm-6 col-xs-12">
              <q-select
                readonly
                label="Disciplina"
                outlined
                use-input
                input-debounce="0"
                :options="disciplines"
                v-if="patient.treatments[actualTreatment] != undefined"
                v-model="patient.treatments[actualTreatment].discipline"
                stack-label
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
            <div class="col-sm-6 col-xs-12">
              <q-input
                readonly
                outlined
                label="Data do atendimento"
                mask="##/##/####"
                v-if="patient.treatments[actualTreatment] != undefined"
                v-model="patient.treatments[actualTreatment].date"
              >
                <template v-slot:append>
                  <q-icon
                    name="event"
                    class="cursor-pointer"
                  >
                    <q-popup-proxy
                      ref="qDateProxy"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        mask="DD/MM/YYYY"
                        v-model="patient.treatments[actualTreatment].date"
                        @input="() => $refs.qDateProxy.hide()"
                      />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            type="reset"
            label="Voltar"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="newExamDialog"
      :maximized="!$q.screen.gt.xs"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card>
        <q-form @submit="saveExam">
        <q-card-section>
          <div class="text-h6">Novo exame</div>
        </q-card-section>
        <q-card-section>
          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <!-- <q-uploader
                flat
                bordered
                url="http://localhost:4444/upload"
                label="Imagem"
                accept=".jpg, image/*"
                style="width: 100%"
              /> -->
              <q-file outlined v-model="newExam.image" label="Foto" />
            </div>
            <div class="col-xs-12">
              <q-input
                outlined
                label="Laudo"
                type="textarea"
                v-model="newExam.description"
              />
            </div>
            <div class="col-xs-12">
              <q-input
                outlined
                label="Data do exame"
                v-model="newExam.date"
                mask="##/##/####"
              >
                <template v-slot:append>
                  <q-icon
                    name="event"
                    class="cursor-pointer"
                  >
                    <q-popup-proxy
                      ref="qDateProxy"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="newExam.date"
                        mask="DD/MM/YYYY"
                        @input="() => $refs.qDateProxy.hide()"
                      />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            type="reset"
            flat
            label="Cancelar"
            color="primary"
            v-close-popup
          />
          <q-btn
            type="submit"
            flat
            label="Salvar"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="viewExamDialog"
      :maximized="!$q.screen.gt.xs"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card>
        <img id="exam-image">
        <q-form>
        <q-card-section>
          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                readonly
                outlined
                label="Laudo"
                type="textarea"
                v-if="patient.exams[actualExam] != undefined"
                v-model="patient.exams[actualExam].description"
              />
            </div>
            <div class="col-xs-12">
              <q-input
                readonly
                outlined
                label="Data do exame"
                mask="##/##/####"
                v-if="patient.exams[actualExam] != undefined"
                v-model="patient.exams[actualExam].date"
              >
                <template v-slot:append>
                  <q-icon
                    name="event"
                    class="cursor-pointer"
                  >
                    <q-popup-proxy
                      ref="qDateProxy"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="patient.exams[actualExam].date"
                        mask="DD/MM/YYYY"
                        @input="() => $refs.qDateProxy.hide()"
                      />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            type="reset"
            flat
            label="Voltar"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { db, storage } from 'boot/firebase'
import { firestore } from 'firebase'
import { uid } from 'quasar'

const stringDisciplines = [
  'Estágio I',
  'Estágio II',
  'Estágio III',
  'Estágio IV',
  'Dentistica II',
  'Dentistica IV',
  'Periodontia II',
  'Prótese total',
  'Prótese Fixa II',
  'Cirurgia I ',
  'Cirurgia II',
  'Prótese Parcial Removível',
  'Diagnóstico',
  'Endodontia II'
]

const stringMotives = [
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
  'Prótese parcial removível'
]

export default {
  name: 'ViewPatient',
  data () {
    return {
      value: true,
      patient: {
        treatments: [],
        exams: []
      },
      newTreatment: {
        id: '',
        student1: '',
        student2: '',
        professor: '',
        description: '',
        discipline: '',
        date: ''
      },
      newExam: {
        id: '',
        date: '',
        description: '',
        image: null
      },
      disciplines: stringDisciplines,
      motives: stringMotives,
      editMode: false,
      editButtonText: 'Editar',
      newTreatmentDialog: false,
      viewTreatmentDialog: false,
      newExamDialog: false,
      viewExamDialog: false,
      actualTreatment: 0,
      actualExam: 0
    }
  },
  methods: {
    viewTreatment (id) {
      this.actualTreatment = id
      this.viewTreatmentDialog = true
    },
    viewExam (id) {
      this.actualExam = id
      this.viewExamDialog = true
      storage.ref().child(this.patient.exams[id].path).getDownloadURL().then(url => {
        document.getElementById('exam-image').src = url
      })
    },
    getPatient () {
      console.log(this.$route.params.id)
      db.collection('patients').doc(this.$route.params.id).get().then((doc) => {
        if (doc.exists) {
          this.patient = doc.data()
        } else {
          console.log('No such document!')
        }
      }).catch((error) => {
        console.log('Error getting document:', error)
      })
    },
    updatePatient () {
      db.collection('patients').doc(this.$route.params.id).update({
        name: this.patient.name,
        cpf: this.patient.cpf,
        email: this.patient.email,
        rg: this.patient.rg,
        phone1: this.patient.phone1,
        phone2: this.patient.phone2,
        birthDate: this.patient.birthDate,
        necessity: this.patient.necessity,
        motive: this.patient.motive,
        onTreatment: this.patient.onTreatment
      })
      this.exitEditMode()
    },
    saveTreatment () {
      this.newTreatment.id = this.patient.treatments.length
      db.collection('patients').doc(this.$route.params.id).update({
        treatments: firestore.FieldValue.arrayUnion(this.newTreatment)
      }).then(() => {
        this.newTreatment = []
        this.getPatient()
      })
    },
    saveExam () {
      const path = uid() + '.jpg'
      db.collection('patients').doc(this.$route.params.id).update({
        exams: firestore.FieldValue.arrayUnion({
          id: this.patient.exams.length,
          date: this.newExam.date,
          description: this.newExam.description,
          path: path
        })
      })
      storage.ref().child(path).put(this.newExam.image)
        .then(snapshot => {
          console.log('Image uploaded')
          this.getPatient()
        })
    },
    enterEditMode () {
      this.editMode = true
    },
    exitEditMode () {
      this.editMode = false
      this.getPatient()
    },
    filterDisciplines (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.disciplines = stringDisciplines.filter(v => v.toLowerCase().indexOf(needle) > -1)
      })
    },
    filterMotives (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.motives = stringMotives.filter(v => v.toLowerCase().indexOf(needle) > -1)
      })
    }
  },
  created () {
    this.getPatient()
  }
}
</script>

<style>
.table-card{
  width: 100%;
}
.q-card{
  border-radius: 10px;
}
</style>
