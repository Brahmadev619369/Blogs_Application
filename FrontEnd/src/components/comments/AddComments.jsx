import axios from 'axios'
import React, { useState } from 'react'
import Message from "../confirm_loader/Message"

function AddComments({Blogid}) {

    const [content,setContent] = useState("")
    const [error,setError] = useState("")
    console.log("add commne" , Blogid)
    const token = localStorage.getItem("authToken")
    console.log(token);
    

    const handleToSubmit = async(e) =>{
        e.preventDefault()

        try {
            const res = await axios.post(`${import.meta.env.VITE_EXPRESS_BASE_URL}/blogs/comments/${Blogid}`,{content},{
                headers:{
                    Authorization : `Bearer ${token}`
                }
            })
            setContent("")
            window.location.reload();
            
            
        } catch (error) {
            if(error.response.data.error==="Unauthorized: no token"){
                setError("Login required..")
            }else(
                setError(error.response.data.error || error.response.data)
            )
            
        }
        finally{
            setTimeout(() => {
                setError("")
            }, 2000);
        }
    }

  return (
    <div className='addCommentCOntainer'>
        {error && (
            <Message message={error}/>
        )}
            <form className="addComment" onSubmit={handleToSubmit}>
            <label>Leave a comment :</label>
            <input type="text" value={content} onChange={(e)=>setContent(e.target.value)}/>

            <div>
            <button type='submit'>Comments</button>
            </div>
        </form>

      
    </div>
  )
}

export default AddComments
