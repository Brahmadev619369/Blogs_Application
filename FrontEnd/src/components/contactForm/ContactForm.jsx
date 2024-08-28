import React, { useState } from 'react'
import axios from 'axios'
import Message from "../confirm_loader/Message"
import Spinner from "../svg/Spinner"
import "../forgot_reset_compo/forgotReset.css"
import "./contact.css"

function ContactForm() {
    const [email, setEmail] = useState("")
    const [fullName, setFullName] = useState("")
    const [contactMessage, setCotactMessage] = useState("")
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleToSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)



        try {
            const res = await axios.post(`${import.meta.env.VITE_EXPRESS_BASE_URL}/contact`, { email, fullName, message: contactMessage })
            console.log();
            setError("")
            setEmail("")
            setFullName("")
            setCotactMessage("")
            setMessage(res.data)
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
        <div className="contactform">
            <div className='forgotPassContainer'>

                {error && <div className='forError'>{error}</div>}
                <form className='forgotFormCon' onSubmit={handleToSubmit}>
                    <h2>Contact Us</h2>
                    <hr />
                    <div className="forgotInput">
                        <label htmlFor="">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <div className="forgotInput">
                        <label htmlFor="">Name</label>
                        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                    </div>

                    <div className="forgotInput">
                        <label htmlFor="">Message</label>
                        <textarea className='textarea' type="text" value={contactMessage} onChange={(e) => setCotactMessage(e.target.value)}></textarea>

                    </div>

                    <button style={{ backgroundColor: "greenyellow" }} type='submit' disabled={isSubmitting}>Submit</button>
                </form>

                {message && (<Message message={message} />

                )}

                {isSubmitting && (
                    <Spinner />
                )}
            </div>
        </div>
    )
}

export default ContactForm
