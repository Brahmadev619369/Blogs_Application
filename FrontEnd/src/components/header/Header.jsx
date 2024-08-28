import React, { useState,useContext } from 'react'
import { NavLink, Link } from "react-router-dom"
import "./header.css"
import Menu from '../svg/Menu';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ConfirmMessage from '../confirm_loader/ConfirmMessage';
import logo from "../../assets/logo.png"


function Header() {
    const [isOpen,setIsOpen] = useState(false)
    const {auth,logout} = useContext(AuthContext)
    const [showConfirm,setShowConfirm] = useState(false)
    const navigate = useNavigate()


    

    const toggleNav = () =>{
        setIsOpen(!isOpen)
    }

    const closeNav = () =>{
        setIsOpen(false)
    }

    const handleLogout = () => {
        setShowConfirm(true); // Show confirmation message
        setIsOpen(false)
    };

    const handleConfirmLogout = () => {
        logout(); // Call the logout function
        setShowConfirm(false); // Hide the confirmation message
        navigate("/login")    
    };

    const handleCancelLogout = () => {
        setShowConfirm(false); // Hide the confirmation message
    };
    
console.log("header auth",auth);

    return (
        <header className='navbar'>
            <nav className='nav-component'>

                <div className="nav-logo">
                  <Link className='logo' to="/"><img className='logoImg' src={logo} alt="" /></Link>
                    
                </div>

                <div className={`nav-menu ${isOpen ? "open":''}`}>
                    {/* Links visible to everyone */}
                    
                    <NavLink to="/" className={({isActive})=>`${isActive?"active-text":"text"} navlink`} onClick={closeNav}>
                        Home
                    </NavLink>

                    <NavLink to="/blogs" className={({isActive})=>`${isActive?"active-text":"text"} navlink`} onClick={closeNav}>
                        Blogs
                    </NavLink>

                    <NavLink to="/authors" className={({isActive})=>`${isActive?"active-text":"text"} navlink`} onClick={closeNav}>
                        Authors
                    </NavLink>

                    <NavLink to="/contact" className={({isActive})=>`${isActive?"active-text":"text"} navlink`} onClick={closeNav}>
                        Contact
                    </NavLink>

                               {/* when user not logged in */}
                    {!auth && (
                        <>
                    <NavLink to="/register" className={({isActive})=>`${isActive?"active-text":"text"} navlink`} onClick={closeNav}> 
                        Register
                    </NavLink>

                    <NavLink to="/login" className={({isActive})=>`${isActive?"active-text":"text"} navlink`} onClick={closeNav}>
                        Login
                    </NavLink>

                    </>
                   ) }

{/* when user  logged in */}
                    {auth && (
                        <>
                        
                    <NavLink to="/addblogs"  className={({isActive})=>`${isActive?"active-text":"text"} navlink`} onClick={closeNav}>
                        AddBlog
                    </NavLink>

                    <NavLink to="/myblogs" className={({isActive})=>`${isActive?"active-text":"text"} navlink`} onClick={closeNav}>
                        MyBlogs
                    </NavLink>

                    <NavLink to="/profile" className={({isActive})=>`${isActive?"active-text":"text"} navlink`} onClick={closeNav}>
                        {auth?.userName}
                    </NavLink>
                    
                    <NavLink  to="/users/admin" className={({isActive})=>`${isActive?"active-text":"text"} navlink`} onClick={closeNav}>
                        AdminDashboard
                    </NavLink>

                    <NavLink  onClick={handleLogout} className={"text navlink"}>
                        Logout
                    </NavLink>
                        </>
                    )}
                </div>


                    <button onClick={toggleNav} 
                    className='menu-btn'>
                        <Menu/>
                    </button>
            </nav>


            {showConfirm && (
                <ConfirmMessage
                    message="Are you sure you want to logout?"
                    onConfirm={handleConfirmLogout}
                    onCancel={handleCancelLogout}
                />
            )}


        </header>
    )
}

export default Header



