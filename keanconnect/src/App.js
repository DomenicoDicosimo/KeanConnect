import logo from './logo.svg';
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyCLSG8GUInKQ__vZXSa39EC3a7dl9MrMI4",
  authDomain: "keanconnect-462c0.firebaseapp.com",
  projectId: "keanconnect-462c0",
  storageBucket: "keanconnect-462c0.appspot.com",
  messagingSenderId: "1054788257970",
  appId: "1:1054788257970:web:b55fdfe15897ac5952e1ab",
  measurementId: "G-WDTMSRF8FG"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  return (
    <div className="App">
      <header className="App-header">
        
      </header>
    </div>
  );
}

export default App;
 