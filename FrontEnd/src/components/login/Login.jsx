import React from 'react'
import { Link } from 'react-router-dom'
import "./login.css"
import { useForm } from "react-hook-form"
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import { AuthContext } from '../contexts/AuthContext'
import { useContext } from 'react'
import Spinner from "../svg/Spinner"

function Login() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm()

    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const nevigate = useNavigate()
    const { login } = useContext(AuthContext)


    const onSubmit = async (data) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_EXPRESS_BASE_URL}/users/login`, data)
            // console.log(response.data)
            const token = response.data.token;

            // call login from context
            login(token)

            //nevigate to home 
            nevigate("/")

            //   console.log(token)
        } catch (error) {

            console.log('Error response:', error)
            setSuccess("")

            if (error.response || error.response.data) {

                setError(error.response.data.message || error.response.data.error || 'Login failed')
            }
            else {
                setError('Login failed due to an unknown error')
            }
        }

    };

    // for logout
    const { logoutMessage } = useContext(AuthContext)


    return (
        
        <div className="main-container">
            {logoutMessage && (
                <div className="logout-message">
                    <h3>{logoutMessage}</h3>
                </div>
            )}

            {error && <div className="error-msg">{error}</div>}
            {success && <div className="success-msg">{success}</div>}
            
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-container">
                    <div className="log-text">
                        <h2>Login</h2>
                    </div>
                    <div className="line"></div>
                    <div className="input-box">
                        <input type="email" {...register("email")} placeholder=" " />
                        <div className="text-label">Enter Email</div>
                        {errors.email && <div>{errors.email.message}</div>}
                    </div>

                    <div className="input-box">
                        <input type="password" {...register("password")} placeholder=" " />
                        <div className="text-label">Enter Password</div>
                    </div>
                    <div className="forgotpass">
                        <Link to="/users/forgot-password">Forgot Password?</Link>
                    </div>
                    <div className="btn-sec">
                        <div className="sub-btn">
                            <input disabled={isSubmitting} type="submit" />
                        </div>
                        
                        <p className='reg-log-link' >Don't have an account? <Link className='link' to="/register">Register</Link></p>

                    </div>

                </div>
                {isSubmitting && <Spinner/>}
            </form>

        </div>
    )
}

export default Login
