import React from 'react'

import { useState } from 'react'

const FileForm = () => {

  const [file ,setFile] = useState("") 

const form = document.querySelector('form')
 
  const getFileConvert= async (event)=>{
    event.preventDefault();

  const formData = new FormData(form)
  console.log(formData)
  console.log()


const response = await fetch('http://localhost:5000/api/file/transform_file',
   {
    method :"POST",
    body: formData
})
    .then(response=>response.json())
    .then((data)=>alert())
    .catch(error=>console.log(error))
    }

 const onChange = (event)=>{   
      setFile(event.target.files[0]);      
  }

  return (
    <>
    <div className='contain'>
      
        <form onSubmit={getFileConvert} encType='multipart/form-data'> 
        <div class="form-group">
            <input multiple name ="file" type="file" class="form-control" onChange={onChange}></input>
         </div>
         <div class="form-group">
            <input type="submit" class="form-control" ></input>
         </div>    
        </form>
    </div>
    </>
  );
}

export default FileForm;














