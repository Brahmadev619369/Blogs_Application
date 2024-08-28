import React from 'react'
import { Link } from "react-router-dom"
import "./footer.css"

function Footer() {
  return (
    <div className='footer'>
      <div className="cateroies">
        <ul >
          <li><Link className='list-link' to="/blogs/categories/Web Development">Web Development</Link></li>
          <li><Link className='list-link' to="/blogs/categories/Data Science">Data Science</Link></li>
          <li><Link className='list-link' to="/blogs/categories/Agriculture">Agriculture</Link></li>
          <li><Link className='list-link' to="/blogs/categories/Education">Education</Link></li>
          <li><Link className='list-link' to="/blogs/categories/Entertainment">Entertainment</Link></li>
          <li><Link className='list-link' to="/blogs/categories/Art">Art</Link></li>
          <li><Link className='list-link' to="/blogs/categories/Uncategorized">Uncategorized</Link></li>
        </ul>
      </div>
<div className="line">

</div>
      <div className="copyright">
        <p>&copy; 2024@sitename. All Rights Reserved.</p>
      </div>

    </div>
  )
}

export default Footer
