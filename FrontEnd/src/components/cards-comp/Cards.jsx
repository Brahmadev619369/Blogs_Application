import React, { useEffect } from 'react'
import Card from './Card'
import {dummyData} from "../data"
import { useState } from 'react'
import axios from "axios"
import Spinner from "../svg/Spinner"

function Cards() {
  const [isLoading,setIsLoading] = useState(false)
  const [posts, setPosts] = useState([])
  console.log(import.meta.env.VITE_EXPRESS_ASSETS_URL);


  


useEffect(() => {

  const fetchBlog = async () =>{
    setIsLoading(true)
    try {
      const response = await axios.get(`${import.meta.env.VITE_EXPRESS_BASE_URL}/blogs`)
      console.log(response.data);
      setPosts(response.data)
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
    finally{
      setIsLoading(false)
    }
  }

  fetchBlog()

}, [])




  

  return (
    <div className="cardcontainer">

      {isLoading?(
         <Spinner/>
      ):(
        posts.map(({_id,coverImgUrl,creator,title,description,category,createdAt})=><Card key={_id} coverImg={coverImgUrl} title={title} PostId={_id} body={description} author = {creator.fullName} category={category} createdAt={createdAt} />)
      )
      }

    </div>
  )
}

export default Cards
