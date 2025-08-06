import { useState, useEffect,useRef } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { BiSearchAlt } from 'react-icons/bi';
import {NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa6";
import { IoMenu } from "react-icons/io5";
import { GoSearch } from "react-icons/go";
import { FaUser } from "react-icons/fa6";
import { MdOutlineArrowDropDown } from 'react-icons/md';
import UserProfile from '../pages/userProfile';

const Navbar = ({handleOpenLogin}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2,setIsOpen2] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
const isHome = location.pathname === '/'; 
const dropdownRef = useRef(null);
const [searchTerm, setSearchTerm] = useState('');
const [suggestions, setSuggestions] = useState([]);
 const [showProfile, setShowProfile] = useState(false);
   const toggleProfile = () => setShowProfile(!showProfile);
 const [showDropdown, setShowDropdown] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

const [cartCount, setCartCount] = useState(
  parseInt(localStorage.getItem("cartCount")) || 0
);
  const [user, setUser] = useState(null);

 const handleLogout = () => {
  console.log("Logging out...");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  console.log("Removed from localStorage:", localStorage.getItem("user")); // should be null
  setUser(null);
  window.dispatchEvent(new Event("profileUpdated"));
  navigate('/');
};

  useEffect(() => {
  const loadUserFromLocalStorage = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed.user || parsed);
    }
    else{
      setUser(null);
    }
  };

  // Load initially
  loadUserFromLocalStorage();

  // Listen for updates
  window.addEventListener("profileUpdated", loadUserFromLocalStorage);

  return () => {
    window.removeEventListener("profileUpdated", loadUserFromLocalStorage);
  };
}, []);

  
  useEffect(() => {
  const updateCartCount = () => {
    const count = parseInt(localStorage.getItem("cartCount")) || 0;
    setCartCount(count);
  };

  window.addEventListener("storage", updateCartCount);
  updateCartCount(); // initial

  return () => window.removeEventListener("storage", updateCartCount);
}, []);

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

const handleChange=(res)=>{
  const token = localStorage.getItem("accessToken");
    if (!token || res.status === 401 || res.status === 403) {
      handleOpenLogin();
    }  else {
      
      toggleProfile();
    }

}

const handleCart=()=>{
  navigate('/shopcart');
}

useEffect(() => {
  const timer = setTimeout(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.trim() === "") {
        setSuggestions([]);
        setShowDropdown(false);
        setLoadingSuggestions(false);
        return;
      }

      try {
        setLoadingSuggestions(true); // Start loader

        const response = await fetch(
          `https://booksemporium.in/Microservices/Prod/04_user_website/api/books/suggestions?query=${searchTerm}`
        );
        const result = await response.json();
        console.log("Suggestions:", result);

        setSuggestions(result.suggestions || []);
        setShowDropdown(true);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setLoadingSuggestions(false); // Stop loader
      }
    };

    fetchSuggestions();
  }, 300); // debounce

  return () => clearTimeout(timer);
}, [searchTerm]);

  
  return (
    <>
      <nav className="flex flex-col lg:flex-row text-white w-full ">
       
{/* Mobile Navbar*/}
{loadingSuggestions ? (
  <div className="p-4 text-center">
    <div className="searchloader mx-auto" />
  </div>
) : (
  suggestions.map((suggestion, index) => (
    <div
      key={index}
      className="p-2 hover:bg-gray-100 cursor-pointer text-black"
      onMouseDown={() => {
        navigate(`/productdetails/${suggestion.Book_id}`);
        setSearchTerm(" ");
        setShowDropdown(false);
        setSuggestions([]);
      }}
    >
      {suggestion.Title}
    </div>
  ))
)}


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
            <img src="/images/be-logo.webp" alt='logo'
            className="xxxl:w-[58px] laptop:w-[40px] hd:w-[45px] w-[36px] "> 
            </img>
            <div className="flex flex-col text-left text-[15px] leading-[0.9rem] lg:leading-tight uppercase text-[#3A261A] font-opensans font-bold xxxl:text-[25px] hd:text-[20px] laptop:text-[16px] xxxl:leading-[22px] hd:leading-[18px] laptop:leading-[14px]">
              <p>books</p>
              <p>emporium</p>
              </div>
            </div>
        </div>

        <div className="flex items-center gap-4">
          <FaUser  onClick={handleChange} className="text-[#492C1E] text-3xl" />
          <div className="relative ml-2">
  <FaShoppingCart className="text-[#492C1E] text-[28px]" onClick={handleCart} />
  {cartCount > 0 && (
    <span className="absolute -top-2 -right-1 bg-red-600 text-[10px] leading-none font-semibold text-white rounded-full px-[4px] py-[3px]">
      {cartCount}
    </span>
  )}
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
    className="cursor-pointer hover:bg-gray-100 px-4 py-2 text-black"
    onMouseDown={() => {
      navigate(`/productdetails/${item.Book_id}`);
      setSearchTerm(" ");
      setShowDropdown(false);
      setSuggestions([]);
    }}
  >
    {item.Title}
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
        className="w-full px-10 py-2 border border-black rounded-md"
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
    className="cursor-pointer hover:bg-gray-100 px-4 py-2 text-black"
    onMouseDown={() => {
      navigate(`/productdetails/${item.Book_id}`);
      setSearchTerm(" ");
      setShowDropdown(false);
      setSuggestions([]);
    }}
  >
    {item.Title}
  </li>
))}

        </ul>
      )}
</div>
      </div>

     <div className="relative ml-2">
  <FaShoppingCart className="text-[#492C1E] text-[28px]" onClick={handleCart} />
  {cartCount > 0 && (
    <span className="absolute -top-2 -right-1 bg-red-600 text-[10px] leading-none font-semibold text-white rounded-full px-[4px] py-[3px]">
      {cartCount}
    </span>
  )}
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
    className="cursor-pointer hover:bg-gray-100 px-4 py-2 text-black"
    onMouseDown={() => {
      navigate(`/productdetails/${item.Book_id}`);
      setSearchTerm(" ");
      setShowDropdown(false);
      setSuggestions([]);
    }}
  >
    {item.Title}
  </li>
))}

        </ul>
      )}
</div>
      </div>

    <div className="relative ml-2">
  <FaShoppingCart className="text-[#492C1E] text-[28px]" onClick={handleCart} />
  {cartCount > 0 && (
    <span className="absolute -top-2 -right-1 bg-red-600 text-[10px] leading-none font-semibold text-white rounded-full px-[4px] py-[3px]">
      {cartCount}
    </span>
  )}
</div>

    </div>
  )}
</div>



        {/* Desktop View */}
  <div className="hidden laptop:flex w-full fixed top-0 z-50 font-archivon ">
  {/* Left Section */}
  <div className="bg-nav flex items-center px-4 laptop:px-4 xxxl:px-10 py-5 gap-6 hd:gap-10 laptop:gap-6 xxxl:gap-14 laptop:w-[55%] xxxl:w-[50%] ">
     <div className="flex items-center ">
            <img src="/images/be-logo.webp" alt='logo'
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
  <div className="bg-nav flex items-center gap-4 laptop:gap-8 xxxl:gap-6 hd:gap-4 px-4 laptop:px-6 xxxl:px-2 py-3  justify-start w-[55%] xxxl:w-[55%]">
   

    <div className="bg-white border border-[#080000] flex items-center px-3  xxxl:py-3 laptop:py-1 hd:py-2 rounded-full w-[50%] ">
     
      <input
        type="text"
        placeholder="Search for books"
         onChange={(e) => setSearchTerm(e.target.value)}
        className="bg-transparent outline-none xxxl:text-[22px] px-2 hd:text-[18px] laptop:text-[15px]  w-full placeholder-[#080000] text-[#080000] "
      />
       <BiSearchAlt className="xxxl:w-6 xxxl:h-6 hd:w-5  laptop:w-4 laptop:h-6  mr-2 shrink-0 text-[#080000]" />
       {suggestions.length > 0 && (
  <ul className="absolute z-50 top-full  w-[50%] hide-scrollbar bg-white border border-gray-200  rounded shadow max-h-80 overflow-y-auto">
    {suggestions.map((item, index) => (
  <li
    key={index}
    className="cursor-pointer hover:bg-gray-100 px-4 py-2 text-black"
    onMouseDown={() => {
      navigate(`/productdetails/${item.Book_id}`);
      setSearchTerm("");
      setShowDropdown(false);
      setSuggestions([]);
    }}
  >
    {item.Title}
  </li>
))}

  </ul>
)}

    </div>
   <FaUser
      onClick={handleChange}
      className="cursor-pointer text-[35px] xxxl:ml-16 hd:ml-10 shrink-0 text-[#492C1E]"
    />
     <div className="relative text-center  z-50" ref={dropdownRef}>
  <button
    onClick={() => setIsOpen2(!isOpen2)}
    className="flex items-center uppercase gap-1 xxxl:text-[24px] laptop:text-[18px] hd:text-[20px] text-[#492C1E] hover:text-black font-medium"
  >
    {user ? (
          <span className=""> {user.firstName}</span>
        ) : (
          <span className="">My Account</span>
        )}
    <MdOutlineArrowDropDown
      className={`text-[35px]  transition-transform duration-200 ${isOpen2 ? 'rotate-180' : ''}`}
    />
  </button>

  {isOpen2 && (
    <div className="absolute right-0 mt-2 w-28 bg-white border rounded shadow-lg z-50">
      <ul className="py-1 text-md text-gray-700">
        <li onClick={handleChange} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
        <li onClick={handleLogout} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Logout</li>
      </ul>
    </div>
  )}
</div>

   <div className="relative ml-2">
  <FaShoppingCart className="text-[#492C1E] text-[35px]" onClick={handleCart} />
  {cartCount > 0 && (
    <span className="absolute -top-2 -right-2 bg-red-600 text-[14px] leading-none font-semibold text-white rounded-full px-[5px] py-[3px]">
      {cartCount}
    </span>
  )}
</div>

   
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
            <img src="/images/be-logo.webp" alt='logo'
            className="w-[36px] xxxl:w-[58px] laptop:w-[40px] hd:w-[45px] "> 
            </img>
            <div className="text-[15px] leading-tight flex flex-col text-left uppercase text-[#3A261A] font-opensans font-bold xxxl:text-[25px] hd:text-[20px] laptop:text-[16px] xxxl:leading-[22px] hd:leading-[18px] laptop:leading-[14px]">
              <p>books</p>
              <p>emporium</p>
              </div>
            </div>
            <div>
              <img src="/images/close.webp" alt='close'
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
      <li><a href="/contact">contact</a></li>
      <li><a href="/bookcrate">books crate</a></li>
      <li><a href="/shop">shop</a></li>
     

    </ul>
  </div>
</div>

{showProfile && <UserProfile onClose={() => setShowProfile(false)} />}
    </>
  );
};

export default Navbar;
