import React, {useRef, useState,useEffect} from 'react';
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
  //const [currentRoom, setCurrentRoom] = useState[""];
  return (
    <div className="App">
      <section>
		<NavBar />
        <div className="Main-Section" id="mainsec">

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
        <a href="http://eve.kean.edu/~santosk1/emailtest/contactform.html">Contact Us</a>
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

function ChatPage(props){
  const{currCID} = props;
  var cSectionDiv = document.getElementById('cssec');
  //const messagesRef = firestore.collection(`messages/`);
  const messagesRef = firestore.collection(`Chats/${currCID}/messages/`);
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
	cSectionDiv.scrollTop = cSectionDiv.scrollHeight;
    
  }
  //Display all the available chats
	const [links, setLinks] = useState([]);

  //loops over each document, passes document data as the message prop
  //input value binds state to form input
  return(<>
		<div id = {currCID} className='tabcontent' Style="display:none;">
			   <div className="Message-UI-Section">
				 <div className='Chat-Section' id='cssec'>
					   {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
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
			   </div>
		</div>
  </>
  )
}

function ChatMessage(props){

  const {text,createdAt,uid, photoURL} = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  const alignVal = messageClass ==="sent" ? 'right' : 'left';
  //const timeStampDate = createdAt;
  //const dateInMillis  = timeStampDate.seconds * 1000
  //var date = new Date(dateInMillis).toLocaleDateString() + '  ' + new Date(dateInMillis).toLocaleTimeString()
  return (<>
    <div className = {`message-${messageClass}`} align={alignVal}>
				<div className="msg-bubble">
				  <p className='msg-txt'>{text}</p>
				  <p>{new Date(createdAt.seconds * 1000).toLocaleDateString() + '  ' + new Date(createdAt.seconds * 1000).toLocaleTimeString()}</p>
				</div>
				<div className="pfp">
				  <img src = {photoURL}  alt="" width='40' height = '40'/>
				</div>
    </div>
  </>)
}


function ChatRoom()
{

	   const [activeChat, setActiveChat] = useState(null);
		const [cids, setCids] = useState([]);
		const {uid} = auth.currentUser;
		useEffect(() => {
		  const getCids = async () => {
		    const cidsRef = firestore.collection('Chats');
		    const querySnapshot = await cidsRef.get();
		    const cids = querySnapshot.docs.map((doc) => doc.id);
		    setCids(cids);
		  };
		  getCids();
		}, []);
		const openChat = (event, chatName) => {
		  // Hide all tabcontents
		  const tabcontentList = document.querySelectorAll(".tabcontent");
		  tabcontentList.forEach((tabcontent) => {
		    tabcontent.style.display = "none";
		  });

		  // Remove "active" class from all tablinks
		  const tablinksList = document.querySelectorAll(".tablinks");
		  tablinksList.forEach((tablink) => {
		    tablink.classList.remove("active");
		  });

		  // Show the current tab, and add an "active" class to the button that opened the tab
		  document.getElementById(chatName).style.display = "block";
		  event.currentTarget.classList.add("active");
		  setActiveChat(chatName);
		};
	return(<>
	<div id='navpanel' className='Navegation-Panel'>
		  <div className='panel-option-div'>
			 {cids.map((cid) => (
				<button className={`tablinks${activeChat === cid ? " active" : ""}`} onClick={(event) => openChat(event,cid)}>{cid}</button>
			 ))}
		  </div>
     </div>
	<div className='divider' id='divider'></div>
	   {cids.map((cid) => (
		  <ChatPage currCID={cid} />
	   ))}	
	</>
  )}

export default App;
 
