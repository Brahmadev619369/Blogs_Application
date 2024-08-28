import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaComment } from "react-icons/fa";
import Message from "../confirm_loader/Message"
import { RiDeleteBin6Fill } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import { FaSave } from "react-icons/fa";
import { AuthContext } from '../contexts/AuthContext';
import { useContext } from 'react';



function DisplayComment({ Blogid }) {
    const [comments, setComments] = useState([])
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")
    const token = localStorage.getItem("authToken")

    const [editCommentId, setEditCommentId] = useState(null)
    const [editCommentContent, setEditCommentContent] = useState("")
    const {auth} = useContext(AuthContext)
    const userId = auth?.id
    console.log("users",userId);
    
    // add Comments
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_EXPRESS_BASE_URL}/blogs/comments/${Blogid}`)
                setComments(res.data)
            } catch (error) {
                console.error(error.response)
            }

        }

        fetchComments()
    }, [comments])


    // delete comments
    const handleToDeleteComments = async (commentsId) => {
        console.log("CommentID", commentsId);

        try {
            const res = await axios.delete(`${import.meta.env.VITE_EXPRESS_BASE_URL}/blogs/comments/${commentsId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setError("")
            setMessage(res.data)

            setComments(comments.filter((comment) => comment._id != commentsId))


        } catch (error) {
            console.log(error);
            if (error.response.data.error || error.response.data) {
                setError(error.response.data || error.response.data.error)
            }

        }
        finally {
            setTimeout(() => {
                setMessage("")
                setError("")
            }, 1000);
        }
    }


    // edit comments

    const handleToEditComments = (commentId, content) => {
        setEditCommentId(commentId)
        setEditCommentContent(content)
    }

    const handleToSaveContent = async (commentId) => {
        try {
            const res = await axios.patch(`${import.meta.env.VITE_EXPRESS_BASE_URL}/blogs/comments/${commentId}`,
                { content: editCommentContent },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            setError("")
            setMessage(res.data)


        } catch (error) {
            console.log(error);
            if (error.response.data.error || error.response.data) {
                setError(error.response.data || error.response.data.error)
            }
        }
        finally {
            setEditCommentId("")
            setEditCommentContent("")
            setTimeout(() => {
                setMessage("")
                setError("")
            }, 1000);
        }
    }

    return (
        <div className='displayCommentCOntainer'>
            {message && (
                <Message message={message} />
            )}

            {error && (
                <div className='error'>{error}</div>
            )}

            {comments.map((comment) => (
                <div key={comment._id} className="displayComment">
                    <div className="commentsContent">
                        {editCommentId === comment._id ? (
                            <div>
                                <textarea className='editTextArea' style={{}} value={editCommentContent} onChange={(e) => setEditCommentContent(e.target.value)} />

                            </div>
                        ) : (
                            <p className='commentContent'>{comment.content}</p>
                        )}

                        <div className='commentsFooter'>
                            <div>
                                <p className='commentAuthor'> <FaComment /> {comment.author}</p>
                                <p className='commentDate'>
                                    {new Date(comment.createdAt).toLocaleString()}
                                </p>
                            </div>
                            {userId === comment.authorId &&(
                            <div className="commentsBtn">
                            <button className='commentDeleteBtn' onClick={() => handleToDeleteComments(comment._id)}><RiDeleteBin6Fill /></button>
                            {editCommentId === comment._id ? (
                                <button onClick={() => handleToSaveContent(comment._id)} className='commentEditBtn'><FaSave /></button>
                            ) : (
                                <button className='commentEditBtn' onClick={() => handleToEditComments(comment._id, comment.content)}><FaEdit /></button>
                            )}


                        </div>
                            ) }

                        </div>
                    </div>
                </div>
            ))}



        </div>
    )
}

export default DisplayComment
