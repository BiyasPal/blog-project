import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaHeart, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {

  const [menuOpen, setMenuOpen] = useState(false);

  return (

    <header className="shadow-xl bg-black text-white relative">

      <nav className="mx-auto px-6 md:px-10 h-[10vh] flex justify-between items-center">

        {/* LOGO */}
        <Link to="/">
          <span className="text-2xl md:text-3xl font-semibold">
            Aletheia
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <ul className="hidden md:flex items-center py-2 gap-x-20 font-semibold">

         <NavLink
            className={({isActive}) =>
                `hover:text-gray-300
                 cursor-pointer
                 ${isActive ? "underline-offset-auto" : ""}`
            }> Explore </NavLink>
            
            <NavLink
            className={({isActive}) =>
                `hover:text-gray-300
                 cursor-pointer
                 ${isActive ? "underline-offset-auto" : ""}`
            }>  Pricing </NavLink>
             
              <NavLink
            className={({isActive}) =>
                `hover:text-gray-300
                 cursor-pointer
                 ${isActive ? "underline-offset-auto" : ""}`
            }>  Contact Us </NavLink>

        

        </ul>

        {/* RIGHT SIDE */}
        <div className="flex gap-6 items-center">

          {/* SIGN IN */}
          <div className="border px-3 py-1 rounded-xl text-sm md:text-xl hover:bg-white hover:text-black transition-all duration-300">
            <Link to="/login">
              Get Started
            </Link>
          </div>

          {/* HEART ICON */}
          <div className="hidden md:block cursor-pointer">
            <FaHeart />
          </div>

          {/* HAMBURGER MENU */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>

        </div>

      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden absolute top-[10vh] left-0 w-full bg-black border-t border-gray-700 z-50">

          <ul className="flex flex-col items-center gap-6 py-8 font-semibold">

            <li>
              <button className="hover:text-gray-300">
                Explore
              </button>
            </li>

            <li>
              <button className="hover:text-gray-300">
                Pricing
              </button>
            </li>

            <li>
              <button className="hover:text-gray-300">
                Contact Us
              </button>
            </li>

          </ul>

        </div>
      )}

    </header>
  );
};

export default Navbar;