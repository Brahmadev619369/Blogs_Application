import React, { useState, useEffect } from 'react';
import img from "../../images/img.png"; // Assuming this is a placeholder image
import { Link } from 'react-router-dom';
import ConfirmMessage from '../confirm_loader/ConfirmMessage';
import axios from 'axios';
import Message from '../confirm_loader/Message';
import { Spinner } from 'react-bootstrap';

function AdminUsers() {
    const token = localStorage.getItem("authToken");
    const [showConfirm, setShowConfirm] = useState(false);
    const [showMsg, setShowMsg] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [userIdToDelete, setUserIdToDelete] = useState(null);

    // Fetch all users
    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const res = await axios.get(`${import.meta.env.VITE_EXPRESS_BASE_URL}/users`);
                setUsers(res.data);
                console.log(res.data);
            } catch (error) {
                setError("Failed to load users.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Delete user
    const handleToDeleteUser = (userId) => {
        setShowConfirm(true);
        setUserIdToDelete(userId);
    }

    const handleToConfirm = async () => {
        setShowConfirm(false);
        setIsLoading(true);
        try {
            const res = await axios.delete(`${import.meta.env.VITE_EXPRESS_BASE_URL}/users/admin/${userIdToDelete}`, {
headers:{
    Authorization: `Bearer ${token}`
}
            });

            setShowMsg(res.data || "User deleted successfully.");

            setUsers(users.filter(user => user._id !== userIdToDelete));

        } catch (error) {
            setShowMsg("");
            console.error("Error deleting user:", error);
            if (error.response && error.response.data) {
                setError(error.response.data.message || error.response.data.error || 'Try again after sometime');
            } else {
                setError("An unexpected error occurred.");
            }
        } finally {
            setIsLoading(false);
            setTimeout(() => {
                setShowMsg("");
                setError("");
            }, 2000);
        }
    }

    const handleToCancel = () => {
        setShowConfirm(false);
        setUserIdToDelete(null);
    }

    return (
        <div className="adminUsersContainer">
            {error && <div className="error-message">{error}</div>}
            {showMsg && <Message message={showMsg} />}
            <div className="adminUsers">
                {isLoading ? (
                    <Spinner />
                ) : (
                    users.map(user => (
                        <div className='adminUser' key={user._id}>
                            <div className="userImg">
                                <img src={user.profileURL ? `${import.meta.env.VITE_EXPRESS_ASSETS_URL}/public/${user.profileURL}` : img} alt={user.fullName} />
                            </div>
                            <div className="nameBtn">
                                <div className="adminauthor">{user.fullName}</div>
                                <div className="authBtn">
                                    <button onClick={() => handleToDeleteUser(user._id)} className='delete-btn btn'>Delete</button>
                                </div>
                            </div>
                        </div>

                    ))
                )}

                {showConfirm && (
                    <ConfirmMessage
                        message="Are you sure you want to delete this user?"
                        onConfirm={handleToConfirm}
                        onCancel={handleToCancel}
                    />
                )}
            </div>
        </div>
    );
}

export default AdminUsers;
