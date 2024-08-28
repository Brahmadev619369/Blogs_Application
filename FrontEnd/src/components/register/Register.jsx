import React, { useState } from 'react'
import "../login/login.css"
import { useForm } from "react-hook-form"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Message from "../confirm_loader/Message"
import Spinner from "../svg/Spinner"


function Register() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm()

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_EXPRESS_BASE_URL}/users/register`, data)
            setError("");
            setSuccess(response.data)

            setTimeout(() => {
                navigate('/login');
            }, 3000);

        } catch (error) {
            console.log('Error response:', error)
            setSuccess("")

            if (error.response && error.response.data) {
                setError(error.response.data.message || error.response.data.error || 'Registration failed')

            } else {
                setError('Registration failed due to an unknown error')
            }
        }
    }


    return (
        <div className="main-container">
            {error && <div className="error-msg">{error}</div>}
            

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-container">
                    <div className="log-text">
                        <h2>Register</h2>
                    </div>
                    <div className="line"></div>

                    <div className="input-box">
                        <input type="text" {...register("fullName")} placeholder=" " />
                        <div className="text-label">Enter FullName</div>
                    </div>

                    <div className="input-box">
                        <input type="email" {...register("email")} placeholder=" " />
                        <div className="text-label">Enter Email</div>
                    </div>

                    <div className="input-box">
                        <input type="password" {...register("password")} placeholder=" " />
                        <div className="text-label">Enter Password</div>
                    </div>

                    <div className="btn-sec">
                        <div className="sub-btn">
                            <input disabled={isSubmitting} type="submit" />
                        </div>

                        <p className='reg-log-link' >Already have an account? <Link className='link' to="/login">Login</Link></p>
                    </div>
                </div>
            </form>
            {isSubmitting && (
                <Spinner/>
            )}
            {success && (
                <Message message={success}/>
            )}
        </div>
    )
}

export default Register
