import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import "./blogDetails.css";
import "../comments/comment.css"
import User from "../svg/User"
import { TbWriting } from "react-icons/tb";
import { FcComments } from "react-icons/fc";

import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ConfirmMessage from '../confirm_loader/ConfirmMessage';
import Spinner from "../svg/Spinner"
import AddComments from '../comments/AddComments';
import DisplayComment from '../comments/DisplayComment';

function BlogDetails() {
  const [blogDetails, setBlogDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { PostId } = useParams();
  const { auth } = useContext(AuthContext);
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate()
  const [showConfirm, setShowConfirm] = useState(false)

console.log("HEYTHIS IS BLOGDET",PostId);


  console.log("blogDetails id", auth?.id)

  useEffect(() => {
    const fetchBlogDetails = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_EXPRESS_BASE_URL}/blogs/${PostId}`);
        setBlogDetails(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to load blog details.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchBlogDetails();

  }, [PostId]);

  const handleToDeleteBlog = () => {
    setShowConfirm(true)
  };

  const handleToConfirm = async () => {
    setShowConfirm(false);
    try {
      await axios.delete(`${import.meta.env.VITE_EXPRESS_BASE_URL}/blogs/${PostId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert("Blog post deleted successfully.");
      navigate("/blogs")
    } catch (error) {
      console.error("Error deleting post:", error);
      setError("Failed to delete the blog post.");
    }
  }

  const handleToCancel = () =>{
    setShowConfirm(false)
  }



  if (isLoading) {
    return <div><Spinner/></div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className='container'>

      <div className="blog_details">
        <div className="blog_details_header">
          <div className="author">
            <TbWriting/>
            {blogDetails.creator?.fullName}
            
          </div>
          {/* // if auth user post the blogs then  */}
          {auth?.id == blogDetails?.creator?._id &&
            <div className="blog_details_btn">
              <Link to={`/blogs/edit/${PostId}`} className='btn primary'>Edit</Link>
              <Link onClick={handleToDeleteBlog} className='btn delete'>Delete</Link>
            </div>
          }

      {showConfirm && (
        <ConfirmMessage 
        message="Are you sure you want to delete this blog?"
        onConfirm={handleToConfirm}
        onCancel={handleToCancel}/>
      )}

        </div>
        <div className="title">
          <h1>{blogDetails.title}</h1>
        </div>
        <div className="coverImg">
          <img src={`${import.meta.env.VITE_EXPRESS_ASSETS_URL}/public/${blogDetails.coverImgUrl}`} alt={blogDetails.title} />
        </div>
        <div className="blog_content">
          <div className='blogDetailsPara' dangerouslySetInnerHTML={{ __html: blogDetails.description }} />
        </div>
      </div>

<hr style={{margin:"10px"}} />

      <div className="commentDetails">
        <h2 style={{display:"flex",alignItems:"center", gap:"5px"}}> <FcComments/> Comments <FcComments/></h2>
        <DisplayComment Blogid = {PostId}/>
        <AddComments Blogid = {PostId}/>
      </div>
    </div>
  );
}

export default BlogDetails;
