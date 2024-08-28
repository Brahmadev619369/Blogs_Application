import React from 'react'
import {Link} from "react-router-dom"
import "./error.css"

function Error() {
  return (
    <div className='error-container'>
        <div className='text'>
            <h2>Page Not Found</h2>
        
        </div>

            <Link className="errorBtn" to="/" >Go Back Home</Link>

    </div>
  )
}

export default Error
