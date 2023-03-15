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
		<NavBar />
        <div className="Main-Section">
          <div className='Navegation-Panel'>
            {
            }
          </div>
          {user ? <ChatRoom /> : <SignIn />}
        </div>
      </section>
    </div>
  );
}

function NavBar(){
	   return(
		<>
			 <div className='navbar'>
			 <span className="navText">Kean Connect</span>
			<div className = "navlogo">
				<img src="../public/logogreysmall.png"  alt="" />
			 </div>
			<SignOut/>
			</div>
		</>
	   );
}
function SignIn(){
  const useSignInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return(
    <>
	<div className = "Form-Container">
		<div className = "Form-Header">
			<h1>Welcome to Kean Connect! Please Sign In:</h1>
		</div>
		<div className="Form-Wrapper">
			<button className="Login-Button" onClick={useSignInWithGoogle}>Sign in with Google</button>
		</div>
	</div>
    </>
  )
}

function SignOut(){
  return auth.currentUser && (
    <button onClick ={() => auth.signOut()} className="Logout-Button"> Sign Out</button>
    
  )
}

function ChatRoom(){
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt');

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
	<div className='Chat-Section'>
    <main>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <div ref={dummy}></div>
    </main>
	</div>
	<div className="Message-Section">
		<form class="text-container" onSubmit={sendMessage}>
		<div class="text-box-div">
		<input type="textarea" value = {formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Send Message"  cols="20" rows="20" required/>
		</div>
		<div class="submit-button-div">
		<button type = "submit" class="submit-btn" disabled={!formValue}>Send</button>
		</div>
		</form>
	</div>
  </>
  )
}

function ChatMessage(props){

  const {text, uid, photoURL} = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  return (<>
    <div className = {`message ${messageClass}`}>
      <img src = {photoURL} alt=""/>
      <p>{text}</p>
    </div>
  </>)
}



export default App;
 
