import React, {useRef, useState} from 'react';
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { useAuthState, useSignInWithGoogle } from 'react-firebase-hooks/auth';
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

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        
      </header>

      <section>
        <div className='navbar'>
          {<SignOut/>}
        </div>
        <div className="Main-Section">
          <div className='Navegation-Panel'>
            {
              <DisplayChats />
            }
          </div>
          <div className='Chat-Section'>{user ? <ChatRoom /> : <SignIn />}</div>
        </div>
      </section>
    </div>
  );
}

function SignIn(){
  const useSignInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return(
    <>
      <button onClick={useSignInWithGoogle}>Sign in with Google</button>
    </>
  )
}

function SignOut(){
  return auth.currentUser && (
    <button onClick ={() => auth.signOut()}> Sign Out</button>
    
  )
}

function ChatRoom(){
  //pulls the last 25 messages from the chat app
  const dummy = useRef();

  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  //reacts to changes in real time
  const [messages] = useCollectionData(query,{idField: 'id'});

  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {
    //prevents data being reset on refresh
    e.preventDefault();

    const { uid, photoURL} = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    
    dummy.current.scrollIntoView({behavior: 'smooth'});
  }

  //loops over each document, passes document data as the message prop
  //input value binds state to form input
  return(<>
    <main>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <div ref={dummy}></div>
    </main>
  
    <form onSubmit={sendMessage}>

      <input value = {formValue} onChange={(e) => setFormValue(e.target.value)} />

      <button type = "submit" disabled={!formValue}>Send</button>
    </form>
  </>
  )
}

function ChatMessage(props){

  const {text, uid, photoURL} = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  return (<>
    <div className = {`message ${messageClass}`}>
      <img src = {photoURL} />
      <p>{text}</p>
    </div>
  </>)
}

function DisplayChats() {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const unsubscribe = db.listCollections().then(collections => {
      setCollections(collections.map(col => col.id));
    });

    return () => unsubscribe();
  }, []);

  return (
      <ul>
        {collections.map(col => (
          <li key={col}>{col}</li>
        ))}
      </ul>
  );
}

export default App;
 