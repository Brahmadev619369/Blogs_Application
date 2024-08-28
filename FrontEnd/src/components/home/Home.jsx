import React from 'react'
import CarouselSlide from '../home-components/CarouselSlide'
import "./home.css"
import img from "../../images/img.png"
import { useState,useEffect } from 'react'
import axios from "axios"
import Homecards from '../home-components/Homecards'
import Spinner from "../svg/Spinner"

function Home() {

    const [isLoading,setIsLoading] = useState(false)
    const [posts, setPosts] = useState([])
    const [slidePosts, setSlidePosts] = useState([])
  
  
  useEffect(() => {
  
    const fetchBlog = async () =>{
      setIsLoading(true)
      try {
  
        const response = await axios.get(`${import.meta.env.VITE_EXPRESS_BASE_URL}/blogs`)
        console.log(response.data);
        const allBlogs = response.data
        setPosts(allBlogs)

        const randomPosts = getRandomPosts(allBlogs,3)
        setSlidePosts(randomPosts)

      } catch (error) {
        console.error("Error fetching posts:", error);
      }
      finally{
        setIsLoading(false)
      }
    }
  
    fetchBlog()
  
  }, [])


const getRandomPosts = (blogs, count) => {
    // Shuffle array
    const shuffled = blogs.sort(() => 0.5 - Math.random());
    // Get sub-array of first `count` elements after shuffled
    return shuffled.slice(0, count);
};


  return (
<div className='home-container'>

{isLoading && (
  <Spinner/>
)}

<CarouselSlide posts={slidePosts}/>
  
  <Homecards posts = {posts}/>
</div>
  )
}

export default Home
