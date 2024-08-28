import React, { useEffect, useState } from 'react';
import img from "../../images/img.png";
import "./authors.css"
import { Link } from 'react-router-dom';
import axios from 'axios';
import Spinner from "../svg/Spinner"

function Authors() {
  const [authors, setAuthors] = useState([]);
  const [isloader,setIsloader] = useState(false)

  // fetch authors
  useEffect(()=>{
    setIsloader(true)
    const fetchAuthors = async () =>{
      try {
        const authors_res = await axios.get(`${import.meta.env.VITE_EXPRESS_BASE_URL}/users`)
        console.log("authors",authors_res);
        setAuthors(authors_res.data)
        
      } catch (error) {
        console.error("Failed to fetch authors the blogs.", error);  
      }
      finally{
        setIsloader(false)
      }
    }
    fetchAuthors()
  },[])

  return (
    <div className='author-container'>
      {
        isloader && (
          <Spinner/>
        )
      }
      {
        authors.map(({ _id, profileURL, fullName }) => (
          <Link to={`/blogs/users/${_id}`} key={_id} className="user_contain_card">
              <img src={`${import.meta.env.VITE_EXPRESS_ASSETS_URL}/public/${profileURL}`} alt="" />
            <div className="name">
              {fullName}
            </div>
          </Link>
        ))
      }
    </div>
  );
}

export default Authors;
