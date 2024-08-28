import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, createRoutesFromChildren, Route, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import Layout from './components/Layout.jsx';
import Blogs from './components/blogs/Blogs.jsx';
import Home from './components/home/Home.jsx';
import Login from './components/login/Login.jsx';
import Error from './components/error/Error.jsx'; 
import Register from './components/register/Register.jsx';
import BlogDetails from './components/blog/BlogDetails.jsx';
import Authors from './components/authors/Authors.jsx';
import Myblogs from "./components/myblogs/Myblogs.jsx"
import AddBlog from './components/addblogs/AddBlog.jsx';
import AuthorBlog from './components/author-blogs/AuthorBlog.jsx';
import Category from './components/category/Category.jsx';
import UserProfile from "./components/usersProfile/UserProfile.jsx"
import {AuthProvider} from './components/contexts/AuthContext.jsx';
import EditBlog from './components/editBlog/EditBlog.jsx';
import ForgotPassword from './components/forgot_reset_compo/ForgotPassword.jsx';
import ResetPassword from './components/forgot_reset_compo/ResetPassword.jsx';
import Activation from './components/ActivateAcc/Activation.jsx';
import AdminDash from './components/Admin/AdminDash.jsx';
import ContactForm from "./components/contactForm/ContactForm.jsx"

const router = createBrowserRouter(
  createRoutesFromChildren(
    <Route path="/" element={<Layout /> } errorElement={<Error />}>
      <Route index element={<Home />} />
      <Route path="blogs" element={<Blogs />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="blogs/:PostId" element={<BlogDetails />} />
      <Route path="authors" element={<Authors />} />
      <Route path="myblogs" element={<Myblogs />} />
      <Route path="addblogs" element={<AddBlog />} />
      <Route path="blogs/users/:id" element={<AuthorBlog />} />
      <Route path="blogs/categories/:category" element={<Category />} />
      <Route path="profile" element={<UserProfile />} />
      <Route path="blogs/edit/:id" element={<EditBlog />} />
      <Route path="users/forgot-password" element={<ForgotPassword />} />
      <Route path="users/reset-password/:resetToken" element={<ResetPassword />} />
      <Route path="users/register/activation/:activationToken" element={<Activation />} />
      <Route path="users/admin" element={<AdminDash />} />
      <Route path="contact" element={<ContactForm />} />
      
    </Route>
  )
);
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
    <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
);
