import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TbWriting } from "react-icons/tb";
import axios from 'axios';
import ConfirmMessage from '../confirm_loader/ConfirmMessage';
import Spinner from '../svg/Spinner'; // Assuming you have a Spinner component
import Message from '../confirm_loader/Message';

function AdminBlogs() {
    const token = localStorage.getItem("authToken");
    const [blogs, setBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
    const [blogIdToDelete, setBlogIdToDelete] = useState(null);
    const [msg,setMsg] = useState("")

    // Fetch all blogs
    useEffect(() => {
        setIsLoading(true);
        const fetchBlogs = async () => {
            try {
                const blogRes = await axios.get(`${import.meta.env.VITE_EXPRESS_BASE_URL}/blogs`);
                console.log("admin", blogRes.data);

                setBlogs(blogRes.data);
            } catch (error) {
                console.error(error);
                setError("Failed to load blogs.");
            } finally {
                setIsLoading(false);
            }
        }

        fetchBlogs();
    }, []);

    // Delete a blog
    const handleToDeleteBlog = (blogID) => {
        setShowConfirm(true);
        setBlogIdToDelete(blogID);
    }

    const handleToConfirm = async () => {
        setShowConfirm(false);
        setIsLoading(true)
        try {
            const res = await axios.delete(`${import.meta.env.VITE_EXPRESS_BASE_URL}/blogs/admin/${blogIdToDelete}`,{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            setBlogs(blogs.filter(blog=> blog._id != blogIdToDelete))
            setMsg(res.data)
        } catch (error) {
            setMsg("")
            // console.error("Error deleting posts:", error);
            console.log(error.response.data.error)
            if (error.response && error.response.data) {
                setError(error.response.data || error.response.data.error || 'Try again after sometime')
             
        }
    }
        finally{
            setIsLoading(false)
            setTimeout(()=>{
                setMsg("")
            },2000)
        }
    }

    const handleToCancel = () => {
        setShowConfirm(false);
        setBlogIdToDelete(null);
    }

    return (
        <div className="adminCardContainer">
            {error && <div className="error-message">{error}</div>}
        <div className="adminCards">
            {isLoading ? (
                <Spinner /> // Display a loading spinner while fetching data
            ) : (
                blogs.map(blog => (
                    <div className='adminCard' key={blog._id}>
                        <div className="coverImg">
                            <img src={`${import.meta.env.VITE_EXPRESS_ASSETS_URL}/public/${blog.coverImgUrl}`} alt="" />
                        </div>

                        <div className="title-author">
                            <h3>{blog.title}</h3>
                            <p><TbWriting /> {blog?.creator.fullName}</p>
                        </div>

                        <div className="read-del-btn">
                            <Link to={`/blogs/${blog._id}`} className="read-btn btn">Read</Link>
                            <button onClick={() => handleToDeleteBlog(blog._id)} className="delete-btn btn">Delete</button>
                        </div>

                        
                    </div>
                ))
            )}

            {showConfirm && (
                <ConfirmMessage
                    message="Are you sure you want to delete this blog?"
                    onConfirm={handleToConfirm}
                    onCancel={handleToCancel}
                />
            )}

            {msg && (
                <Message message={msg}/>
            )}
        </div>
        </div>
    );
}

export default AdminBlogs;
