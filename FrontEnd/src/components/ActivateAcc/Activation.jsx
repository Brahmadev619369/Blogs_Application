import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import "./activate.css"
import axios from 'axios';
import Message from "../confirm_loader/Message"
import { useState } from 'react';

function Activation() {
    const activationToken = useParams();
    const navigate = useNavigate()
    // console.log(activationToken.activationToken);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleToSendToken = async () => {
        try {

            const res = await axios.post(`${import.meta.env.VITE_EXPRESS_BASE_URL}/users/register/activation/${activationToken.activationToken}`)
            setError("")
            setSuccess(res.data)

            setTimeout(()=>{
                navigate("/login")
            },3000)
            
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data) {
                const errorMsg = typeof error.response.data === "string" ?
                error.response.data : error.response.data.message || JSON.stringify(error.response.data)

                setError(errorMsg)
            } else {
                setError('Activation failed due to an unknown error');
            }
            setSuccess("");
    }

    }

    return (
        <div className='activateContainer'>
            {error && <div className='error-msg' style={{marginTop:"15px"}}>{error}</div>}
            <h1>Activate Your Account </h1>
            <button onClick={handleToSendToken}>Activate</button>
        {
            success && (
                <Message message={success}/>
            )
        }

        </div>
    )
}

export default Activation;
