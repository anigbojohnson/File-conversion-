import React from 'react'
import { useState } from 'react'
import Login from './components/Login'
import Register from './components/Register'
import {Link, Route , Routes} from 'react-router-dom'
import './index.css'
import FileForm from './components/FileForm';
const App = () => {
  const [modalStatus, setModalstatus] = useState(false);
  const [loginStatus ,setModalLoginStatus] = useState(false) 

 
  return (
    <>
    <ul>
      <li>
        <Link data-toggle="modal" data-target="#myModal" onClick={()=>{setModalstatus(true);}} to="/">Register</Link>
      </li>
      <li>
      <Link data-toggle="modal" data-target="#myModal" onClick={()=>{setModalLoginStatus(true);}} to="/">Login</Link>
      </li>
     
  </ul>
    <Routes>
    <Route path="/" element={ modalStatus === true ?<Register displayStatus ={setModalstatus} />:""}/>
    <Route path="/" element={ modalStatus === true ?<Login displayStatus ={setModalLoginStatus} />:""}/>
  </Routes>
       { modalStatus === true ?<Register displayStatus ={setModalstatus} />:""} 
       { loginStatus === true ?<Login displayLoginStatus ={setModalLoginStatus} />:""} 


    <div className='contain'>
      <div>
        <FileForm/>
      </div>    
      
    </div>
    </>
  );
}

export default App;














