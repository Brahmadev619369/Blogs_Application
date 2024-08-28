import React, { useState } from 'react';
import './carousel.css'; // Add this line for the CSS styles
import { Link } from 'react-router-dom';

const Carousel = ({ posts = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === posts.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? posts.length - 1 : prevIndex - 1
    );
  };

  if (!posts || posts.length === 0) {
    return <p>No slides available</p>;
  }

  return (
    <div className="carousel">
      <div
        className="carousel-inner"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {posts.map((post) => (
          <div
            className="carousel-item"
            key={post._id}
            style={{
              backgroundImage: `url(${import.meta.env.VITE_EXPRESS_ASSETS_URL}/public/${post.coverImgUrl})`,// Set the background image
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="carousel-content">
              <h2>{post.title}</h2>
              <div className="carousel-paragraph" dangerouslySetInnerHTML={{ __html: post.description}} />
              {/* <p className="carousel-paragraph">{post.description}</p> */}
              <div className="carousel-buttons">
                <Link to={`/blogs/categories/${post.category}`} className="category-btn">{post.category}</Link>
                <Link to={`/blogs/${post._id}`} className="readmore-btn">Read More</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="carousel-control-prev" onClick={prevSlide}>
      &#10094;
      </button>
      <button className="carousel-control-next" onClick={nextSlide}>
        &#10095;
      </button>
    </div>
  );
};

export default Carousel;
