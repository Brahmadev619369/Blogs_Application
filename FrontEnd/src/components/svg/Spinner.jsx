import React from 'react'
import spiner from "../../assets/Spiner.svg"
import "./spinner.css"


function Spinner() {
  return (
    <div className='spinnerBG'>
      <div className="spinnerContainer">


        <img className='loaderImg' src={spiner} alt="" />
    </div>
    </div>
  )
}

export default Spinner
