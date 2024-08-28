import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from "../../images/img.png";
import { FaUserEdit } from "react-icons/fa";
import { FcCheckmark } from "react-icons/fc";
import "./userprofile.css";
import { set, useForm } from "react-hook-form"
import { useEffect, useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { FaCheck } from "react-icons/fa";



function UserProfile() {
  const token = localStorage.getItem("authToken")
  const [user, setUser] = useState({})
  const [avatar, setAvatar] = useState(null);
  const { auth } = useContext(AuthContext)
  const navigate = useNavigate()
  const [showCheckBtn, setShowCheckBtn] = useState(false)
  const [error,setError] = useState("")

  const {
    register,
    handleSubmit,
    reset, // Use reset to set default values
    formState: { errors, isSubmitting },
  } = useForm()


  useEffect(() => {
    if (!token) {
      navigate("/login")
    }
  }, [token, navigate])

  //fetch userID and user details using id 
  useEffect(() => {
    const fetchLoginUserDetails = async () => {
      try {
        const decodedToken = jwtDecode(token);
        const res = await axios.get(`${import.meta.env.VITE_EXPRESS_BASE_URL}/users/${decodedToken.id}`)
        setUser(res.data)
        //set avatar also 
        setAvatar(res.data.profileURL)

        // set default values
        reset({
          fullName: res.data.fullName,
          email: res.data.email
        })

        setError("");
      } catch (error) {
        console.error("Error fetching user details", error);
        setError(error.response.data.error);
        
      }
    }
    fetchLoginUserDetails()
  }, [token, reset])

  // post the updated data to db
  const onSubmit = async (data) => {
    try {
      const res = await axios.patch(`${import.meta.env.VITE_EXPRESS_BASE_URL}/users/edit-user`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      alert("Profile Updated Successfully..")
      setUser(res.data)
      setError("");
    } catch (error) {
      console.error("Error to updating profile", error);
      setError(error.response.data.error);
    }
  }


  //update profile picture
  const handleAvatarChange = (e) => {
    setAvatar(e.target.files)
    setShowCheckBtn(true);  // Show the check button when a new file is selected
  };

  const handleToUpdatePicture = async (e) => {
    e.preventDefault();
    try {
      const picData = new FormData()
      picData.append("profile", avatar[0])
      const res = await axios.post(`${import.meta.env.VITE_EXPRESS_BASE_URL}/users/change-profile`, picData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      // update user state to update state after changing profile pic
      setUser(prev => ({
        ...prev,
        profileURL: res.data.profileURL
      }))

      setShowCheckBtn(false)   // hide the check button when a picture updated
      setError("");
    } catch (error) {
      console.error("Error updating profile picture", error);
      // setError(error.response.)
      setError(error.response.data.error);
      setShowCheckBtn(false) 
    }
  }

  handleToUpdatePicture()


  return (
    <div className="profile-container">
      <Link className='myblog' to="/myblogs">MyBlogs</Link>

      <div className="profile-details">

    {error && <div style={{color:"orange",margin:"5px"}}>{error}</div>}

        <div className="profile-avatar">
          <img src={`${import.meta.env.VITE_EXPRESS_ASSETS_URL}/public/${user.profileURL}`} alt="User Avatar" />
        </div>
        <form className='avatar-form' onSubmit={handleToUpdatePicture}>
          <input
            type="file"
            name='avatar'
            id='avatar'
            onChange={handleAvatarChange}
            accept='png, jpg, jpeg'
          />
          {!showCheckBtn && (
            <label className='edit-btn' htmlFor="avatar" ><FaUserEdit /></label>
          )}
          {showCheckBtn && (
            <button className='edit-btn-ckeck'><FaCheck /></button>
          )}

        </form>
      </div>

      <div className="user-details">
        <h1>{user.fullName}</h1>
        <form className='form' onSubmit={handleSubmit(onSubmit)}>
          <input type="text" {...register("fullName")} placeholder="Enter FullName " />
          <input type="email" {...register("email")} placeholder="Enter Email " />
          <input type="password" {...register("currentPassword")} placeholder="Enter Current Password " />
          <input type="password" {...register("newPassword")} placeholder="Enter New Password " />
          <input type="password" {...register("newConfirmPassword")} placeholder="Enter Confirm New Password " />
          <input className='btn' disabled={isSubmitting} type="submit" />
          {isSubmitting && <div className='loading'></div>}
        </form>
      </div>

    </div>
  )
}

export default UserProfile;
