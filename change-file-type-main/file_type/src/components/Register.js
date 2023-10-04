import {useState,useEffect} from 'react';
import axios from 'axios';

const Register = ({displayStatus}) => {
    const [inputValues,setInputValues]= useState({
        email:"",
        password:"",
        code:"",
        confirmPassword:"",
        status: false,
        token:""
    });

const [focus, setFocusedInput] = useState({
  email: false,
  password: false,
  confirmPassword:false,
  code:false
});

const [inputValuesErr,setInputValuesErr]= useState({
      emailErr:"",
      passwordErr:"",
      codeErr:"",
      confirmPasswordErr:"",
      tokenErr:"",
      status:false,
      emailMsg:""
  });

const handleGetCode= async (event)=>{

      event.preventDefault();
      axios.post("http://localhost:5000/api/users/getCode",{"email":inputValues.email})
      .then(response=>{setInputValues({...inputValues, 
        token:response.data.token,
        email:response.data.email,
        status:response.data.status, 
        emailMsg:response.data.emailMsg   
      })})
       .catch(err=>setInputValuesErr({...inputValuesErr,
        emailErr:err.emailErr,
        codeErr:err.codeErr,
        confirmPasswordErr:err.confirmPasswordErr,
        passwordErr:err.passwordErr,
        emailStatus:err.status,
        tokenErr:err.tokenErr
      }))
    }
  useEffect(()=>{
    localStorage.setItem("token",JSON.stringify(inputValues.token))
  },[inputValues.token])

 
  const manageFocused = async (event)=>{     
      setFocusedInput({...focus,[event.target.name]:true});
      setInputValuesErr({...validateInput(inputValues),[event.target.name]:event.target.value});

    }
    const onChange = (event)=>{     
      setInputValues({...inputValues,[event.target.name]:event.target.value});
      setInputValuesErr({...validateInput(inputValues),[event.target.name]:event.target.value});
  }
  

  const getRegistered= async (event)=>{
        event.preventDefault();
        axios.post("http://localhost:5000/api/users/register",{"email":inputValues.email,"password":inputValues.password,"confirmPassword":inputValues.confirmPassword,"code":inputValues.code,headers:{authorization:"Bearer "+JSON.parse(localStorage.getItem('token'))} })
        .then(response=>{setInputValuesErr(response.data
      ///   checkError(response)
        )
       
      }
        )
        .catch(response=>setInputValuesErr())
        console.log(inputValuesErr.codeErr)

      }

      function  validateInput(input){
        const emailPattern =/^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*$/;
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        let err ={emailErr:"", passwordErr:"", codeErr:"",confirmPasswordErr:""};

      
        if(input.code===""){
          err.codeErr ="Please provide your code";
         }
      
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

        if(input.confirmPassword!==input.password){
          err.confirmPasswordErr="password do not match";
        }
        
        return err;
      }

  return (
  
   <div className="modal"> 
      <div className="modalContent">
        <div className="modalHeader">
            <div className="top" id="topTwo">
                <button type="button" className="close" data-dismiss="modal" onClick={()=>displayStatus(false)} > &times;</button>
            </div>
            <div className="top" id="topOne">
               <h1 className="modalTitle">Register</h1>
            </div>  
        </div>
        <div style={{color:'red'}}>{inputValues.status ===true ? inputValues.emailMsg:inputValuesErr.emailStatus=== true ? "'message not sent to email, please try again'":""}</div>
        <form onSubmit={getRegistered}>
          <label>Email</label>
          <input type="email"  autoComplete='off' onBlur={manageFocused}  focus={inputValuesErr?.emailErr !== "" ?"true":"false"} width = "450px" placeholder="Email" value={inputValues['email']} onChange={onChange} name="email"  required></input>
          <span>{focus.email ===true ? inputValuesErr?.emailErr:""}</span> 
            <div className="emailCode"style={{position:'relative'}}>
                <div style={{display:'flex',flexDirection:'column'}}>
                    <label>Code</label>
                    <input type="text" autoComplete='off'  onBlur={manageFocused}  focus={ inputValuesErr?.codeErr !== "" ?"true":"false"}  placeholder="Code"  name="code" value={inputValues['code']} onChange={onChange} style={{width:'200px'}} required></input>
                    <span>{focus.code ===true ? inputValuesErr?.codeErr:""}</span> 
                </div>
                <div style={{display:'flex',flexDirection:'column',position:'absolute',right:'5px',bottom:"0px"}}>    
                    <input type="submit" autoComplete='off' onBlur={manageFocused}     value="Get Code" name="getCode" onClick={handleGetCode}  style={{width:'200px',border:'none',cursor:'pointer', backgroundColor:'blue'}} required/>
                </div>
               
            </div>
            <label>Password</label>
            <input type="password"  autoComplete='off' onBlur={manageFocused}  focus={focus.password.toString()}  value={inputValues['password']} width = "450px" placeholder="password" name="password" onChange={onChange} required></input>
            <span>{focus.password ===true ? inputValuesErr?.passwordErr:""}</span> 

            <label>Confirm Password</label>
            <input type="password"  autoComplete='off' onBlur={manageFocused}  focus={focus.confirmPassword.toString()} width = "450px"   value={inputValues['confirmPassword']} placeholder="Confirm Password" name="confirmPassword" onChange={onChange}></input>
            <span>{focus.confirmPassword ===true ? inputValuesErr?.confirmPasswordErr:""}</span>
        <div className="modal-footer">
            <input type='submit'   style={{fontSize:'16px',width:"475px" }}   value="Sign Up"  />
            <button  style={{fontSize:'16px',width:"475px" }} className='closeBtn' onClick={()=>displayStatus(false)}  >Close</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register







