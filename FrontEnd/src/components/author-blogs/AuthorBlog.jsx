import React, { useEffect } from 'react'
import Card from '../cards-comp/Card'
import {dummyData} from "../data"
import { useState } from 'react'
import "../blogs/cards.css"
import { useParams } from 'react-router-dom'
import axios from 'axios'

function AuthorBlog() {
    const [posts, setPosts] = useState(dummyData)
    const userId = useParams()
console.log("authorbloguserid" ,userId.id);

useEffect(()=>{
  const fetchAuthorBlog = async() =>{
    const blog = await axios.get(`${import.meta.env.VITE_EXPRESS_BASE_URL}/blogs/users/${userId.id}`)
    setPosts(blog.data)
    
  }
  fetchAuthorBlog()
},[userId])

    return (
        <div>
            {posts.length>0 ? <div className="cardcontainer">
  
  {
    posts.map(({_id,coverImgUrl,creator,title,description,category})=><Card key={_id} coverImg={coverImgUrl} title={title} PostId={_id} body={description} author = {creator?.fullName} category={category} />)
  }</div> : <h2 style={{"margin-top":"38vh","margin-bottom":"40vh","font-size":"30px"}}>No Blogs Found</h2>
  }
      
  
      
      </div>
    )
}

export default AuthorBlog
