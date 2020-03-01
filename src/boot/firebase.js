import * as firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'
// import 'firebase/auth'
// import Store from '../store'

var firebaseConfig = {
  apiKey: 'AIzaSyBgkaCTzQ6IQ3_mIHFdV1DPL35rBOY5zME',
  authDomain: 'sisodonto-f0924.firebaseapp.com',
  databaseURL: 'https://sisodonto-f0924.firebaseio.com',
  projectId: 'sisodonto-f0924',
  storageBucket: 'sisodonto-f0924.appspot.com',
  messagingSenderId: '92459788829',
  appId: '1:92459788829:web:2c5c433a4d0492942b74f4'
}
const app = firebase.initializeApp(firebaseConfig)
const db = app.firestore()
const storage = app.storage()
/* let auth = app.auth()

auth.onAuthStateChanged(user => {
  Store.dispatch('fetchUser', user)
}) */

export {
  db, storage, firebase
}
