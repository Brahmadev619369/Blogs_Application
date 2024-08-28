import React, { useEffect } from 'react'
import Card from '../cards-comp/Card'
import { dummyData } from "../data"
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Spinner from "../svg/Spinner"

function Category() {
  const [posts, setPosts] = useState([])
  const category = useParams()
  const [isloader,setIsloader] = useState(false)


  useEffect(() => {
    setIsloader(true)
    try {
      const fetchBlogByCat = async () => {
        const catBlog = await axios.get(`${import.meta.env.VITE_EXPRESS_BASE_URL}/blogs/categories/${category.category}`)
        const catblogData = catBlog.data
        setPosts(catblogData)
      }

      fetchBlogByCat()
    } catch (error) {
      console.error(error)
    }
    finally{
      setIsloader(false)
    }
  }, [category])



  return (
    <div>
      <h2 style={{"margin":"7px"}}>{category.category}</h2>
      {isloader && (
        <Spinner/>
      )}
      {
        posts.length>0 ? <div className="cardcontainer">

        {
          posts.map(({ _id, coverImgUrl, creator, title, description, category }) => <Card key={_id} coverImg={coverImgUrl} title={title} PostId={_id} body={description} author={creator.fullName} category={category} />)
        }
  
      </div> : <h2 style={{"margin-top":"35vh","margin-bottom":"40vh","font-size":"30px"}}>No Blogs Found</h2>
      }


    
    </div>
  )
}

export default Category
