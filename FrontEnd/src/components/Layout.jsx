import React, { useContext } from 'react'
import Header from "./header/Header"
import Footer from "./footer/Footer"
import { Outlet } from 'react-router-dom'
import { AuthContext } from './contexts/AuthContext'


function Layout() {


  return (
    <>

      <Header />
      <Outlet />    {/* means our header and footer not change and in between both will be change*/}
      <Footer />
    </>
  )
}

export default Layout
