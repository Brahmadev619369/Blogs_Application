import React, { useState } from 'react'
import "./forgotReset.css"
import axios from 'axios'
import Message from "../confirm_loader/Message"
import Spinner from "../svg/Spinner"

function ForgotPassword() {
const [email,setEmail] = useState("")
const [error,setError] = useState("")
const [message,setMessage] = useState("")
const [isSubmitting,setIsSubmitting] = useState(false)

    const handleToSubmit = async(e) =>{
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const res = await axios.post(`${import.meta.env.VITE_EXPRESS_BASE_URL}/users/forgot-password`,{email})
            console.log(res);
            setMessage(res.data)
            setError("")
            setEmail("")
            
        } catch (error) {
            console.error(error)
            setError(error.response.data)
            
        }
        finally{
            setIsSubmitting(false)
            // setTimeout(()=>{
            //     setIsSubmitting(false)
            // },1000)
            setTimeout(()=>{
                setMessage("")
                setError("")

            },3000)
        }
    }

  return (
    <div className='forgotPassContainer'>
        
        {error && <div className='forError'>{error}</div> }
      <form className='forgotFormCon' onSubmit={handleToSubmit}>
        <h2>Forgot Password</h2>
    <hr />
        <div className="forgotInput">
            <label htmlFor="">Enter Your Email</label>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        </div>

        <button type='submit' disabled={isSubmitting}>Submit</button>
      </form>

      {message && (<Message message={message}/>

)}

{isSubmitting && (
    <Spinner/>
)}
    </div>
  )
}

export default ForgotPassword
