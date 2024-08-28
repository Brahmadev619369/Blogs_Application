import React, { useEffect } from 'react'
import User from '../svg/User'
import { Link } from 'react-router-dom'
import moment from 'moment';

function Card({ PostId, coverImg, author, title, body, category,createdAt }) {
    console.log(coverImg);

    return (
        <div className="cards">
            <div className="left">
                <div className="img">
                    <img src= {`${import.meta.env.VITE_EXPRESS_ASSETS_URL}/public/${coverImg}`} alt='' />
                </div>
            </div>
            <div className="right">
                <div className="details">
                    <div className="content">
                        <h3 className='title'>{title}</h3>
                       {/* <pre>{body}</pre> */}
                       <div className='desc' dangerouslySetInnerHTML={{ __html: body }} />
                    </div>
                    <div className="btn-author">
                        <div className="author">
                            {/* <img className="author-img" src={<User/>} alt=""/> */}
                            <User />

                            <p>{author}</p>
                        </div>
                        <p className='time'>{moment(createdAt).fromNow()}</p>
                        
                    </div>
                    <div className="cardFooter">
                    <div className='category-div'>
                        <Link to={`categories/${category}`} className='category'>{category}</Link>
                    </div>
                    <div>
                            {/* <button className="card-btn">read more</button> */}
                            <Link className="card-btn" to={`/blogs/${PostId}`}>read more</Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Card
