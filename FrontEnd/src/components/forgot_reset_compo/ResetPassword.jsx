import React from 'react'
import "./forgotReset.css"
import axios from 'axios'
import Message from "../confirm_loader/Message"
import Spinner from "../svg/Spinner"
import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'

function ResetPassword() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const resetToken = useParams()


  const handleToSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await axios.post(`${import.meta.env.VITE_EXPRESS_BASE_URL}/users/reset-password/${resetToken.resetToken}`, { password, confirmPassword })
      console.log(res);
      setMessage(res.data)
      setError("")
      setPassword("")
      setConfirmPassword("")

      setTimeout(() => {
        navigate("/login")
      }, 4000);

    } catch (error) {
      console.error(error)
      setError(error.response.data)
    }
    finally {
      setIsSubmitting(false)
      setTimeout(() => {
        setMessage("")
        setError("")

      }, 3000)
    }
  }


  return (
    <div className='forgotPassContainer'>
      {error && <div className='forError'>{error}</div>}
      <form className='forgotFormCon' onSubmit={handleToSubmit}>
        <h2>Reset Password</h2>
        <hr />
        <div className="forgotInput">
          <label htmlFor="">Enter New Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="forgotInput">
          <label htmlFor="">Enter Confirm Password</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>

        <button type='submit'>Submit</button>

        {message && (
          <Message message={message} />)}
      </form>

      {isSubmitting && (
        <Spinner />
      )}
    </div>
  )
}

export default ResetPassword
