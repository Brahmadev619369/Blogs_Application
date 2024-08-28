import React, { useEffect, useState } from 'react'
import "./admin.css"
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import Message from '../confirm_loader/Message';
import AdminBlogs from './AdminBlogs';
import axios from 'axios';
import Spinner from "../svg/Spinner"
import AdminUsers from './AdminUsers';
import { Link } from 'react-router-dom';

function AdminDash() {
    const navigate = useNavigate();
    const [msg, setMsg] = useState("")
    const token = localStorage.getItem("authToken");

    const [users,setUsers] = useState([])
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [showBlogs, setShowBlogs] = useState(false)
    const [showUsers, setShowUsers] = useState(false)


    //protecy only admin can access this page 
    useEffect(() => {

        if (token) {
            const tokenRole = jwtDecode(token);

            // Check if the role is not "Admin"
            if (tokenRole.role !== "Admin") {
                setMsg("Only Admin Can Access!");

                setTimeout(() => {
                    setMsg("");
                    navigate("/");
                }, 10000);
            }
        } else {
            // If no token, redirect to home or login
            setMsg("No token found! Redirecting...");
            setTimeout(() => {
                navigate("/");
            }, 2000);
        }
    }, [token, navigate]);





    // toggle btn
    const handleToshowBlogs = () => {
        setShowBlogs(true)
        setShowUsers(false)
    }

    const handleToshowUsers = () => {
        setShowBlogs(false)
        setShowUsers(true)
    }

    return (
        <div className='adminContainer'>
            <div className="adminTglBtn">
                <button className='adminToggleBtn' onClick={handleToshowBlogs}>Blogs</button>
                <button className='adminToggleBtn' onClick={handleToshowUsers}>Users</button>
            </div>

            {showBlogs && (
                <AdminBlogs/>
            )}

            {showUsers && (
                <AdminUsers/>
            )}

                



            {msg &&
                <div className='msgdiv'><Message message={msg} /></div>
            }
        </div>
    )
}

export default AdminDash
