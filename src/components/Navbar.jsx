import { useState, useEffect,useRef } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { BiSearchAlt } from 'react-icons/bi';
import {NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa6";
import { IoMenu } from "react-icons/io5";
import { GoSearch } from "react-icons/go";
import { FaUser } from "react-icons/fa6";
import { MdOutlineArrowDropDown } from 'react-icons/md';


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2,setIsOpen2] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
const isHome = location.pathname === '/'; 
const dropdownRef = useRef(null);
const [searchTerm, setSearchTerm] = useState('');
const [suggestions, setSuggestions] = useState([]);

 const [showDropdown, setShowDropdown] = useState(false);
 
useEffect(() => {
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen2(false);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

useEffect(() => {
  const handleScroll = () => {
    if (window.scrollY > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

const handleChange=()=>{
  const token = localStorage.getItem("accessToken");
    if (token) {
      navigate("/profile"); 
    }  else {
      navigate("/login"); 
    }

}

const handleCart=()=>{
  navigate('/shopcart');
}


  useEffect(() => {
    const timer = setTimeout(() => {
      const fetchSuggestions = async () => {
        try {
          const response = await fetch(
            `https://booksemporium.in/Microservices/Prod/04_user_website/api/books/suggestions?query=${searchTerm}`
          );
          const result = await response.json();
          console.log("Suggestions:", result);
          setSuggestions(result.suggestions || []);
          setShowDropdown(true);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
        }
      };

      if (searchTerm.trim() !== "") {
        fetchSuggestions();
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);
  return (
    <>
      <nav className="flex flex-col lg:flex-row text-white w-full ">
       
{/* Mobile Navbar*/}

<div
  className={`w-full lg:hidden px-4 py-3 pb-3 z-50 transition-all duration-300 fixed top-0 ${
    isScrolled ? 'bg-nav shadow-md' : 'bg-nav'
  }`}
>
 
  {!isScrolled ? (
   
    <>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
            <button onClick={() => setIsOpen(true)} className="text-[#492C1E]">
            <IoMenu className="text-5xl" />
          </button>
           <div className="flex items-center ">
            <img src="/images/be-logo.png"
            className="xxxl:w-[58px] laptop:w-[40px] hd:w-[45px] w-[35px]"> 
            </img>
            <div className="flex flex-col text-left text-[12px] leading-tight uppercase text-[#3A261A] font-opensans font-bold xxxl:text-[25px] hd:text-[20px] laptop:text-[16px] xxxl:leading-[22px] hd:leading-[18px] laptop:leading-[14px]">
              <p>books</p>
              <p>emporium</p>
              </div>
            </div>
        </div>

        <div className="flex items-center gap-4">
          <FaUser onClick={handleChange} className="text-[#492C1E] text-3xl" />
          <div className="relative">
            <FaShoppingCart onClick={handleCart} className="text-[#492C1E] text-[30px]" />
            <span className="absolute -top-2 -right-1 bg-red-600 text-[10px] leading-none font-semibold text-white rounded-full px-[4px] py-[3px]">
              0
            </span>
          </div>
        </div>
      </div>

      <div className="">
       <div className="text-black  relative w-full">
        <GoSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-800 w-5 h-5" />
 <input
        type="text"
        className="w-full px-4 py-2 border border-black rounded-md"
       placeholder="Search for books, Publishers & More..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // small delay for click
      />
  
      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 text-black bg-white border border-gray-300 rounded-md shadow-md max-h-60 overflow-y-auto">
          {suggestions.map((item, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onMouseDown={() => {
                setSearchTerm(item);
                setShowDropdown(false);
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
</div>

        
      </div>
    </>
  ) : isHome ? (
    // Home Page Layout
    <div className="flex items-center justify-between">
      <button onClick={() => setIsOpen(true)} className="text-white">
        <IoMenu className="text-5xl text-[#492C1E]" />
      </button>

      <div className=" px-4 ">
        
        <div className="text-black  relative w-full">
        <GoSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-800 w-5 h-5" />
 <input
        type="text"
        className="w-full px-4 py-2 border border-black rounded-md"
       placeholder="Search for books"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // small delay for click
      />
  
      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 text-black bg-white border border-gray-300 rounded-md shadow-md max-h-60 overflow-y-auto">
          {suggestions.map((item, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onMouseDown={() => {
                setSearchTerm(item);
                setShowDropdown(false);
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
</div>
      </div>

      <div className="relative ml-2">
        <FaShoppingCart className="text-[#492C1E] text-[28px]" onClick={handleCart} />
        <span className="absolute -top-2 -right-1 bg-red-600 text-[10px] leading-none font-semibold text-white rounded-full px-[4px] py-[3px]">
          0
        </span>
      </div>
    </div>
  ) : (
    //  Other Page Layout
    <div className="flex items-center justify-between">
      <button onClick={() => navigate(-1)} className="text-[#492C1E] text-3xl">
        <FaArrowLeft />
      </button>

      <div className=" flex items-center px-2  rounded-lg w-full mx-">
        
         
        <div className="text-black  relative w-full">
        <GoSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-800 w-5 h-5" />
 <input
        type="text"
        className="w-full px-4 py-2 border border-black rounded-md"
       placeholder="Search for books"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // small delay for click
      />
  
      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 text-black bg-white border border-gray-300 rounded-md shadow-md max-h-60 overflow-y-auto">
          {suggestions.map((item, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onMouseDown={() => {
                setSearchTerm(item);
                setShowDropdown(false);
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
</div>
      </div>

      <div className="relative ml-2">
        <FaShoppingCart className="text-[#492C1E] text-[28px]" onClick={handleCart} />
        <span className="absolute -top-2 -right-1 bg-red-600 text-[10px] leading-none font-semibold text-white rounded-full px-[4px] py-[3px]">
          0
        </span>
      </div>
    </div>
  )}
</div>



        {/* Desktop View */}
  <div className="hidden laptop:flex w-full fixed top-0 z-50 font-archivon ">
  {/* Left Section */}
  <div className="bg-nav flex items-center px-4 laptop:px-4 xxxl:px-10 py-5 gap-6 hd:gap-10 laptop:gap-6 xxxl:gap-14 laptop:w-[55%] xxxl:w-[50%] ">
     <div className="flex items-center ">
            <img src="/images/be-logo.png"
            className="xxxl:w-[65px] laptop:w-[45px] hd:w-[50px] "> 
            </img>
            <div className="flex flex-col text-left uppercase text-[#3A261A] font-opensans font-bold xxxl:text-[18px] hd:text-[16px] laptop:text-[14px] xxxl:leading-[22px] hd:leading-[18px] laptop:leading-[14px]">
              <p>books</p>
              <p>emporium</p>
              </div>
            </div>

    <ul className="flex gap-6 uppercase laptop:gap-6 xxxl:gap-14 hd:gap-10 hd:text-[18px] text-[16px] laptop:text-[17px] xxxl:text-[20px] items-center justify-start text-[#3A261A]">
      <NavLink
        to="/"
        className={({ isActive }) => `ml-2 ${isActive ? 'border-b-2 border-[#3A261A] font-semibold' : ''}`}
      >
        Home
      </NavLink>
      <NavLink
        to="/about"
        className={({ isActive }) => `${isActive ? 'border-b-2 border-[#3A261A] font-semibold' : ''}`}
      >
        About
      </NavLink>
      <NavLink
        to="/contact"
        className={({ isActive }) => `${isActive ? 'border-b-2 border-[#3A261A] font-semibold' : ''}`}
      >
        contact
      </NavLink>
      <NavLink
        to="/bookcrate"
        className={({ isActive }) => `${isActive ? 'border-b-2 border-[#3A261A] font-semibold' : ''}`}
      >
        book crate
      </NavLink>
       <NavLink
        to="/shop"
        className={({ isActive }) => `${isActive ? 'border-b-2 border-[#3A261A] font-semibold' : ''}`}
      >
        shop
      </NavLink>
     
    </ul>
  </div>

  {/* Right Section */}
  <div className="bg-nav flex items-center gap-4 laptop:gap-10 xxxl:gap-16 hd:gap-12 px-4 laptop:px-6 xxxl:px-2 py-3  justify-start w-[55%] xxxl:w-[55%]">
   

    <div className="bg-white border border-[#080000] flex items-center px-3  xxxl:py-3 laptop:py-1 hd:py-2 rounded-full w-[50%] ">
     
      <input
        type="text"
        placeholder="Search for books, Publishers & More..."
         onChange={(e) => setSearchTerm(e.target.value)}
        className="bg-transparent outline-none xxxl:text-[16px] px-2 laptop:text-[12px]  w-full placeholder-[#080000] text-[#080000] "
      />
       <BiSearchAlt className="xxxl:w-6 xxxl:h-6 hd:w-5  laptop:w-4 laptop:h-6  mr-2 shrink-0 text-[#080000]" />
       {suggestions.length > 0 && (
  <ul className="absolute z-50 top-full left-0 w-full bg-white border border-gray-200 mt-1 rounded shadow max-h-60 overflow-y-auto">
    {suggestions.map((item, index) => (
      <li
        key={index}
        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
        onClick={() => {
          // Optional: handle click logic
          setSearchTerm(item); // or item.title if it’s an object
          setSuggestions([]);
        }}
      >
        {item}
      </li>
    ))}
  </ul>
)}

    </div>
   <FaUser
      onClick={handleChange}
      className="cursor-pointer text-2xl hd:text-3xl laptop:text-2xl xxxl:text-4xl shrink-0 text-[#492C1E]"
    />
     <div className="relative text-center  z-50" ref={dropdownRef}>
  <button
    onClick={() => setIsOpen2(!isOpen2)}
    className="flex items-center gap-1 xxxl:text-[24px] laptop:text-[18px] hd:text-[20px] text-[#492C1E] hover:text-black font-medium"
  >
    My Account
    <MdOutlineArrowDropDown
      className={`text-[35px]  transition-transform duration-200 ${isOpen2 ? 'rotate-180' : ''}`}
    />
  </button>

  {isOpen2 && (
    <div className="absolute right-0 mt-2 w-28 bg-white border rounded shadow-lg z-50">
      <ul className="py-1 text-md text-gray-700">
        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Orders</li>
        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Logout</li>
      </ul>
    </div>
  )}
</div>

    <FaShoppingCart
      className="text-2xl laptop:text-2xl hd:text-3xl xxxl:text-4xl cursor-pointer shrink-0 text-[#492C1E]"
      onClick={handleCart}
    />
   
  </div>
</div>



      </nav>

      {/* Mobile Slide Menu */}
    {isOpen && (
  <div
    className="fixed inset-0 z-40 bg-black bg-opacity-40"
    onClick={() => setIsOpen(false)}
  />
)}

<div
  className={`fixed top-0 left-0 h-full w-80 transform ${
    isOpen ? 'translate-x-0' : '-translate-x-full'
  } transition-transform duration-300 ease-in-out z-50 shadow-xl`}
  onClick={(e) => e.stopPropagation()}
>
  {/* Top Menu Header */}
  <div className="bg-nav  border-b-2 border-[#3A261A] text-white  items-center py-[17px] px-4">
     <div className="flex items-center  justify-between xxxl:mb-30  laptop:mb-16 hd:mb-24 xxxl:px-20 laptop:px-10 hd:px-16">
           <div className="flex items-center ">
            <img src="/images/be-logo.png"
            className="w-[36px] xxxl:w-[58px] laptop:w-[40px] hd:w-[45px] "> 
            </img>
            <div className="text-[15px] leading-tight flex flex-col text-left uppercase text-[#3A261A] font-opensans font-bold xxxl:text-[25px] hd:text-[20px] laptop:text-[16px] xxxl:leading-[22px] hd:leading-[18px] laptop:leading-[14px]">
              <p>books</p>
              <p>emporium</p>
              </div>
            </div>
            <div>
              <img src="/images/close.png"
              onClick={() => setIsOpen(false)}
              className="w-[20px] xxxl:w-[30px] hd:w-[20px] laptop:w-[18px]"></img>
            </div>
            </div>
  </div>

  {/* Remaining Slide Content */}
  <div
    className="h-[calc(100%-64px)] p-7 text-lg text-left text-black"
    style={{ backgroundColor: '#F2E3D6' }}
  >
    <ul className="space-y-4  uppercase font-semibold  text-[20px]">
      <li><a href="/">Home</a></li>
      <li><a href="/about">About</a></li>
      <li><a href="/contact">contact</a></li>
      <li><a href="/bookscrate">books crate</a></li>
      <li><a href="/shop">shop</a></li>
     

    </ul>
  </div>
</div>


    </>
  );
};

export default Navbar;
