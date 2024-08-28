import React from 'react'
import "./homecards.css"
import { Link } from 'react-router-dom'
import moment from 'moment';

function Homecards({posts}) {
    return (
        <div className="HomeCardContainer">

{posts.map((post)=>(
            <div key={post._id} className="homeCard">
            <div className="main">
                <img className='cardImg' src={`${import.meta.env.VITE_EXPRESS_ASSETS_URL}/public/${post.coverImgUrl}`} alt="NFT" />
                <h2 className="cardtitle">{post.title}</h2>
                {/* <p className='description'>{post.description}</p> */}
                <div className='description' dangerouslySetInnerHTML={{ __html: post.description}} />


                <div className="btnInfo">
                    <div className="Cat">
                        <Link to={`/blogs/categories/${post.category}`} className="Category">{post.category}</Link>
                        {/* <a className="Category" href="#">Web Devlopment</a> */}
                    </div>
                    <div className="read">
                    <Link to={`/blogs/${post._id}`} className="read-more">Read More</Link>
                        {/* <a className="read-more" href="#">Read More</a> */}
                    </div>
                </div>
                <hr />
                <div className="author">
                    <div className='wrapper'>
                        <img src={`${import.meta.env.VITE_EXPRESS_ASSETS_URL}/public/${post.creator?.profileURL}`} alt="Creator" />
                    </div>
                    <p>{post.creator?.fullName} </p>
                    <p>{moment(post?.createdAt).fromNow()}</p>
                </div>
            </div>
        </div>
))}




        </div>


    )
}

export default Homecards
