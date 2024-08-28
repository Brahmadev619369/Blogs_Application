import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import "./myblog.css"
import { useEffect, useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import ConfirmMessage from '../confirm_loader/ConfirmMessage'
import Spinner from "../svg/Spinner"

function Myblogs() {
  const [blogs, setBlogs] = useState([])
  const { auth } = useContext(AuthContext)
  const navigate = useNavigate()
  const token = localStorage.getItem("authToken");
  console.log("local token", token);
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState("")
  const [blogIdToDelete, setBlogIdToDelete] = useState(null);
  const [isloading, setIsloading] = useState(false)
  const [msg, setMsg] = useState("")


  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);


  // fetch myblog 
  useEffect(() => {
    setIsloading(true)
    const fetchMyBlog = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_EXPRESS_BASE_URL}/blogs/myblogs/blogs`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const myblogs = response.data
        setBlogs(myblogs)
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to Fetch the blogs.");
      }
      finally {
        setIsloading(false)
      }
    }

    fetchMyBlog()
  }, [])

  // delete blogs
  const handleToDeleteBlog = (blogID) => {
    setShowConfirm(true)
    setBlogIdToDelete(blogID)
  }

  const handleToConfirmDelete = async () => {
    try {
      setShowConfirm(false)
      const res = axios.delete(`${import.meta.env.VITE_EXPRESS_BASE_URL}/blogs/${blogIdToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setBlogs(blogs.filter(blog => blog._id != blogIdToDelete))
      setMsg(res.data)
      // navigate("/myblogs")

    } catch (error) {
      setError("Failed to delete the blog post.");
      console.error("Failed to delete the blogs.", error);
    }
    finally {
      setTimeout(() => {
        setMsg("")
      }, 2000)
    }
  }

  const handleToCancelDelete = () => {
    setShowConfirm(false)
  }




  return (
    <div className='myblogContainer'>

      {/* comfirmation */}
      {showConfirm && (
        <ConfirmMessage
          message="Are you sure you want to delete this blog?"
          onConfirm={handleToConfirmDelete}
          onCancel={handleToCancelDelete} />
      )}

      {isloading && (
        <Spinner />
      )}

      {
        error &&
        (<h2>{error}</h2>)
      }
      {
        blogs.length > 0 ? <div className="myblogCard-container">
          {
            blogs.map(blog => {
              return <div key={blog._id} className="myblogCard">
                <div className="myblogDetails">
                  <img src={`${import.meta.env.VITE_EXPRESS_ASSETS_URL}/public/${blog.coverImgUrl}`} alt="" />
                  <p>{blog.title}</p>
                </div>

                <div className="myblogBtn">
                  <Link to={`/blogs/${blog._id}`} className="read-btn btn">Read</Link>
                  <Link to={`/blogs/edit/${blog._id}`} className="edits-btn btn">Edit</Link>
                  <Link onClick={() => handleToDeleteBlog(blog._id)} className="delete-btn btn">Delete</Link>
                </div>
              </div>
            })
          }
        </div> : <h2 style={{ "marginTop": "15px" }}>You have no Blogs yet.</h2>
      }

      {msg && (
        <Message message={msg} />
      )}
    </div>
  )
}

export default Myblogs
