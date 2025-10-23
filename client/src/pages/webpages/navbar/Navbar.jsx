import React from 'react'
import './Navbar.css'

const Navbar = () => {
  return (
    <nav class="navbar_container">
      <a className="logo" href="#">
        <a className='logo-text'>Shiksha Sankalp</a>
      </a>
      
      <ul class="navbar">
        <li><a>Home</a></li>
        <li><a>Contact</a></li>
      </ul>

      <div class="bx bx-menu" id="menu-icon"><i class="fa-solid fa-bars"></i></div>
    </nav>
  )
}

export default Navbar
