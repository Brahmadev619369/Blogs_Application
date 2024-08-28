import React, { useEffect, useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "../addblogs/addBlog.css";
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';

function EditBlog() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [coverImgUrl, setCoverImgUrl] = useState('')
    const PostId = useParams()

    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const token = localStorage.getItem("authToken");

    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, [token, navigate]);


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
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            [{ size: [] }],
            ['color', 'background',],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' },
            { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image', 'video'],
            ['clean']
        ],
    };

    const formats = [
        'header', 'font', 'size',
        'color', 'background',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'video'
    ];


    // fetch blog 
    useEffect(() => {
        const fetchBlog = async () => {
            const blog_Res = await axios.get(`${import.meta.env.VITE_EXPRESS_BASE_URL}/blogs/${PostId.id}`)
            const blogData = blog_Res.data

            setTitle(blogData.title)
            setCategory(blogData.category)
            setCoverImgUrl(blogData.coverImgUrl)
            setDescription(blogData.description)
        }

        fetchBlog()
    }, [])


    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title)
        formData.append("category", category)
        // formData.append("coverImgUrl", coverImgUrl)
        if (coverImgUrl) {
            formData.append("coverImg", coverImgUrl[0]);
        }
        formData.append("description", description)
        try {
            const res = await axios.patch(`${import.meta.env.VITE_EXPRESS_BASE_URL}/blogs/${PostId.id}`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            alert("Blog Updated Successfully")
            navigate("/blogs")
        }
        catch (error) {
            console.log("blog details not fetched", error)
        }
    }


    return (
        <div className='addblog-container'>
            <h2>Add Blog</h2>
            <form className='form' onSubmit={handleSubmit}>
                <div className="input-details">
                    <label htmlFor="title">Title</label>
                    <input type='text' value={title} onChange={e => setTitle(e.target.value)} />
                </div>

                <div className="input-details">
                    <label htmlFor="category" >Category</label>
                    <select value={category} onChange={e => setCategory(e.target.value)} >
                        {Category_Opt.map(cate => <option key={cate} value={cate}>{cate}</option>)}
                    </select>
                </div>

                <div className="input-details">
                    <label htmlFor="coverImgUrl">Cover Image</label>
                    <input type='file' onChange={e => setCoverImgUrl(e.target.files)} accept='png,jpg,jpeg' />
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

                <input className='blog-sub-btn' type="submit" />
            </form>
        </div>
    );
}

export default EditBlog;
