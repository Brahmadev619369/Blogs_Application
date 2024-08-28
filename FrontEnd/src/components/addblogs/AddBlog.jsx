import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "./addBlog.css";
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import Spinner from "../svg/Spinner"
import { jwtDecode } from 'jwt-decode';
import Message from "../confirm_loader/Message"


function AddBlog() {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [description, setDescription] = useState('');
  const token = localStorage.getItem("authToken");
  const [error,setError] = useState("")
  const [message,setMessage] = useState("")
  console.log("local token",token);


  const tokenRole = jwtDecode(token)
  console.log(tokenRole.role);

  
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);
console.log("addblogauth",auth);

  
  const Category_Opt = [
    "Web Development",
    "Data Science",
    "Agriculture",
    "Education",
    "Entertainment",
    "Art",
    "Uncategorized",
  ];


  const modules = {
    toolbar: [
      [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
      [{size: []}],
      ['color','background',],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, 
       {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image','video'],
      ['clean']                                        
    ],
  };

  const formats = [
    'header', 'font', 'size',
    'color','background',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image','video'
  ];

  const onSubmit = async (data) => {
    const formData = {
      "title" : data.title,
      "category": data.category,
      "description": description,
      'coverImg':data.coverImgUrl[0]
    }
    try {
      

      const response = await axios.post(`${import.meta.env.VITE_EXPRESS_BASE_URL}/blogs`,formData,
        { headers: {
          'Content-Type': 'multipart/form-data',
          Authorization:`Bearer ${token}`
          
        },}
      )

      // console.log(response.data);
      setMessage("Blog Added Successfully..")
      
      setTimeout(()=>{
        setMessage("")
        navigate("/myblogs")
      },2000)
      

    } catch(error) {
      if (error.response) {
        console.log(error.response.data);
    } else {
        console.error('Error submitting form:', error);
    }
    }
  };

  return (
    <div className='addblog-container'>
      <h2>Add Blog</h2>
      <form className='form' onSubmit={handleSubmit(onSubmit)}>
        <div className="input-details">
        <label htmlFor="title">Title</label>
        <input type='text' {...register("title", { required: true })} />
        </div>


<div className="input-details">
        <label htmlFor="category">Category</label>
        <select {...register("category", { required: true })}>
          {Category_Opt.map(cate => <option key={cate} value={cate}>{cate}</option>)}
        </select>
        </div>
        <div className="input-details">
        <label htmlFor="coverImgUrl">Cover Image</label>
        <input type='file' {...register("coverImgUrl", { required: true })} />
        </div>

        <div className="input-details">
        <label htmlFor="content">Content</label>
        <ReactQuill
          value={description}
          onChange={setDescription} // Update description state on change
          modules={modules}
          formats={formats}
        />
        </div>

        <input className='blog-sub-btn' type="submit" disabled={isSubmitting} />
        {isSubmitting &&(
          <Spinner/>
        )}
      </form>

      {message &&(
        <Message message={message}/>
      )}
    </div>
  );
}

export default AddBlog;
