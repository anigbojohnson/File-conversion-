import {useState} from 'react';
import {useEffect} from 'react';
import jwt_decode from "jwt-decode"
import axios from 'axios';
import {LoginSocialFacebook} from 'reactjs-social-login';
import {FacebookLoginButton }from 'react-social-login-buttons';



const Login = ({displayLoginStatus}) => {
  const [oauth20Values, setOauth20Values] = useState({
    userID:"",
    accessToken:""
  })
  const [file ,setFile] = useState("") 

  const [inputValues,setInputValues]= useState({
    email:"",
    password:"",
    token:""
});

const [focus, setFocusedInput] = useState({
email: false,
password: false,
});

const [inputValuesErr,setInputValuesErr]= useState({
  emailErr:"",
  passwordErr:"",
  loginErr:""
});

function  validateInput(input){

  const emailPattern =/^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*$/;
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  let err ={emailErr:"", passwordErr:"",loginErr:""};

  if(input.email===""){
    err.emailErr ="Please provide your email";
   }else{
    if(!emailPattern.test(input.email)){
      err.emailErr="invalid email address";
    }
   }

  if(input.password===""){
    err.passwordErr="Please provide your password";
  } else{
    if(!passwordPattern.test(input.password)){
      err.passwordErr="Must be Minimum of eight characters, at least one uppercase letter, one lowercase letter and one number";
    }
  }  
  return err;
}  

    const applySubmit=(event)=>{
        event.preventDefault();
        fetch('http://localhost:5000/api/users/login',{"email":inputValues.email,"password":inputValues.password})
        .then(response=>response.json())
        .then((data)=>setInputValuesErr({...inputValuesErr, loginErr:data.loginErr}))
        .catch(error=>{setInputValuesErr(error.data)})
    }
    
    
    function handleCallback(response){
      console.log("Encoded JWT ID token: "+ response.credential)
     
      let googleValues = jwt_decode(response.credential)

       axios.post('http://localhost:5000/api/users/google/oauth20',{ googleValues})
      .then(response=>console.log(response))
      .catch(error=>{setInputValuesErr(error.data)});
    }

useEffect(()=>{
  if(oauth20Values.accessToken !=="" && oauth20Values.userID){
    
    axios.post('http://localhost:5000/api/users/facebook/oauth20',
    { accessToken:oauth20Values.accessToken, userID:oauth20Values.userID})
    .then(response=>console.log(response))
    .catch(error=>{setInputValuesErr(error.data)});
  }
},[oauth20Values])

  useEffect(()=>{
    /* global google*/
    google.accounts.id.initialize({
      client_id: "208651170241-2bphhshku4566vn9sqphmn2v423n7q53.apps.googleusercontent.com",
      callback: handleCallback
    });

    google.accounts.id.renderButton(
      document.getElementById("googleLogin"),
      {theme: "outline",width:"650px" }
    );
  },[]);
    const onChange = (event)=>{     
      setInputValues({...inputValues,[event.target.name]:event.target.value});
      setInputValuesErr({...validateInput(inputValues),[event.target.name]:event.target.value});
    }
    const manageFocused = async (event)=>{     
      setFocusedInput({...focus,[event.target.name]:true});
      setInputValuesErr({...validateInput(inputValues),[event.target.name]:event.target.value});

    }

  
  return (
    <>



<div className="modal"> 
      <div className="modalContent">
        <div className="modalHeader">
            <div className="top" id="topTwo">
            <button type="button" className="close" data-dismiss="modal" onClick={()=>displayLoginStatus(false)} > &times;</button>

            </div>
            <div className="top" id="topOne">
               <h1 className="modalTitle">Login</h1>
               <p style={{}}>{inputValuesErr?.loginErr !=="" ? inputValuesErr?.loginErr:""}</p>  
                  <form onSubmit={applySubmit}>
                    
                    <label>Email</label>
                    <input type="email"  onBlur={manageFocused}   autoComplete='off' required value={inputValues['email']}  placeholder="Email" name="email" onChange={onChange} focus={inputValuesErr?.emailErr !== "" ?"true":"false"} />
                    <span>{focus.email ===true ? inputValuesErr?.emailErr:""}</span> 
                    <label>Password</label>
                    <input type="password" onBlur={manageFocused} autoComplete='off' required value={inputValues['password']} placeholder="Password" name="password" onChange={onChange} focus={inputValuesErr?.passwordErr !== "" ?"true":"false"}/> 
                    <span>{focus.password ===true ? inputValuesErr?.passwordErr:""}</span>   
            
                    <input type="submit"     value="Login" name="login"   style={{width:'470px',border:'none',cursor:'pointer', backgroundColor:'black',marginTop:'40px'}} required/>
                </form>

      
         <div style={googleStyle} id='googleLogin'></div>
            <LoginSocialFacebook
                  appId="576783214552914"
                  autoLoad={false}
                  scope="public_profile,email"
                  onResolve={(response)=>{
                    setOauth20Values({...oauth20Values,userID:response.data.userID,accessToken:response.data.accessToken})
                  }}
                  onReject={(err)=>{
                    console.log(err)
                  }}
                  >
              <FacebookLoginButton/>
              </LoginSocialFacebook>
            </div>  
        </div>
        <div style={{color:'red'}}>{inputValues.status ===true ? inputValues.emailMsg:inputValuesErr.emailStatus=== true ? "'message not sent to email, please try again'":""}</div>
        
      </div>
    </div>

          
  
     
       
    </> 
  )
}
/*

const facebookStyle = {
  display:"flex",
  border:"1px solid grey",
  color:"blue",
  width:"450px",
  fontWeight:"bold",
  height:"30px",
  padding:"10px",
  textAlign: "center",
  cursor:'pointer',
}
*/

const googleStyle = {
  border:"1px solid grey",
  borderRadius:"2px"
}

export default Login
