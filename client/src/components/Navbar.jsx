import React from 'react'

const Navbar = () => {
  return (
    <nav className="navbar w-full p-4 flex justify-between bg-black text-white text-[16px]">
        <div className="navbar__logo">
            {/* <h1 className='font-semibold'>Flagright</h1> */}
            <img src="https://cdn.prod.website-files.com/64f420094266acf96b6d3f84/64f4202e5cb2cbb8378b2092_logo-dark.svg" className='max-h-[28px]' alt="" />
        </div>
        <ul className="navbar__links flex gap-4">
            <li><a href="#home">Home</a></li>
            <li><a href="#about">Users</a></li>
            <li><a href="#services">Transactions</a></li>
            <li><a href="#contact">Relationships</a></li>
        </ul>
    </nav>    ) 
}
    
export default Navbar   