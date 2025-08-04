import { useNavigate } from 'react-router-dom';
import { FaLock, FaUser } from 'react-icons/fa';
import { useState } from 'react';
import endpoint_prefix from '../config/ApiConfig';
import { IoEyeSharp } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login({ onClose,onOpenSignup,onOpenForgot }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

 const handleLogin = async () => {
  try {
    const res = await fetch(`${endpoint_prefix}02_Authentication/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok && data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user)); // ✅ Save only the user object

      toast.success("Login successful!");

      // 🔄 Notify Navbar to update user state
      window.dispatchEvent(new Event("profileUpdated"));

      setTimeout(() => {
        onClose();
        navigate('/');
      }, 1500);
    } else {
      toast.error(data.message || 'Login failed');
    }

  } catch (err) {
    console.error(err);
    toast.error("Something went wrong.");
  }
};

  
  return (
   <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">

       <ToastContainer position="top-center" autoClose={1500} />
          {/* Desktop */}
      <div className="hidden lg:flex relative z-20 h-full w-full justify-center items-center font-archivo px-10">
        <div className="relative w-[75%] h-[85%] p-6 bg-white rounded-2xl overflow-hidden shadow-2xl  flex">

          {/* Left */}
          <div className="relative w-1/2 h-full">
            <img
              src="/images/signin-bg.png"
              alt="Side background"
              className="absolute rounded-xl inset-0 w-full h-full object-cover"
            />
                     
          </div>

          {/* Right */}
          <div className="w-1/2 text-center bg-white flex flex-col justify-start ">
           <div className="flex items-center  justify-between xxxl:mb-30  laptop:mb-16 hd:mb-24 xxxl:px-20 laptop:px-10 hd:px-16">
           <div className="flex items-center ">
            <img src="/images/be-logo.png" alt='logo'
            className="xxxl:w-[58px] laptop:w-[40px] hd:w-[45px] "> 
            </img>
            <div className="flex flex-col text-left uppercase text-[#3A261A] font-opensans font-bold xxxl:text-[25px] hd:text-[20px] laptop:text-[16px] xxxl:leading-[22px] hd:leading-[18px] laptop:leading-[14px]">
              <p>books</p>
              <p>emporium</p>
              </div>
            </div>
            <div onClick={onClose}>
              
              <img src="/images/close.png" alt='close'
              className="xxxl:w-[30px] hd:w-[20px] laptop:w-[18px]"></img>
            </div>
            </div>
            <h2 className="xxxl:text-[45px] laptop:text-[28px] hd:text-[36px] text-[#2B452C]  font-semibold">
              Welcome Back!
            </h2>
            <p className="xxxl:text-[16px] laptop:text-[12px] hd:text-[14px] mb-10 font-opensans">Login to your account</p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
              className="xxxl:space-y-5 laptop:space-y-2 hd:space-y-3 xxxl:px-36 laptop:px-20 hd:px-24"
            >
              <div className="flex items-center bg-inputBox xxxl:px-4 xxxl:py-3 laptop:px-3 laptop:py-2 hd:px-4 hd:py-2 rounded-lg">
                <FaUser className="mr-3 text-[#624534]" />
                <input
                  type="email"
                  placeholder="Email Id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-inputBox w-full outline-none placeholder-[#624534] xxxl:text-[18px] laptop:text-[14px] hd:text-[16px]"
                  required
                  autoComplete="email"
                />
                  
              </div>

             <div className="relative">
  <div className="flex items-center bg-inputBox xxxl:px-4 xxxl:py-3 laptop:px-3 laptop:py-2 hd:px-4 hd:py-2 rounded-lg">
    <FaLock className="mr-3 text-[#624534]" />
    <input
      type={showPassword ? "text" : "password"}
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="bg-inputBox w-full outline-none placeholder-[#624534] xxxl:text-[18px] laptop:text-[14px] hd:text-[16px] pr-10"
      required
    />
  </div>

  <button
    type="button"
    onClick={() => setShowPassword((prev) => !prev)}
    className="absolute top-1/2 right-3 -translate-y-1/2 text-[#624534]"
  >
    {showPassword ? (
      <FaEyeSlash className="w-5 h-5" />
    ) : (
      <IoEyeSharp className="w-5 h-5" />
    )}
  </button>
</div>

              <div className="flex justify-between items-center text-sm">
                <label className="flex items-center gap-2 text-[#4E4E4E]">
                  <input type="checkbox" />
                  Keep me signed in
                </label>
                <span
                  className="text-[#4E4E4E] font-medium cursor-pointer"
                  onClick={() => {
  onClose();
  onOpenForgot();
}}

                >
                  Forgot password?
                </span>
              </div>

              <div className="pt-10">
                <button
                  type="submit"
                  className="w-full bg-loginBtn mb-4 xxxl:text-[22px] laptop:text-[16px] hd:text-[18px] text-white rounded-full xxxl:py-3 laptop:py-2 hd:py-2"
                >
                  Login
                </button>
              </div>

              <p className="text-center xxxl:text-[14px] laptop:text-[10px] hd:text-[12px] text-[#89A28A]">
                Don’t have an account?{' '}
                <span
                  className="text-[#3A261A] font-semibold underline cursor-pointer"
                 onClick={() => {
  onClose();
  onOpenSignup();
}}

                >
                  Sign Up
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Mobile View  */}
      <div className="font-archivo py-10 mt-[24%] h-screen w-full  relative text-gray-800 overflow-hidden lg:hidden">
        <div className='border mx-3 py-10 rounded-xl bg-mobileGradient'>
        <div className="flex items-center px-4 justify-between xxxl:mb-30  laptop:mb-16 hd:mb-24 xxxl:px-20 laptop:px-10 hd:px-16">
           <div className="flex items-center ">
            <img src="/images/be-logo.png" alt='logo' className="w-[50px] " />
            <div className="flex flex-col text-left uppercase text-[#3A261A] font-opensans font-bold xxxl:text-[25px] hd:text-[20px] laptop:text-[16px] xxxl:leading-[22px] hd:leading-[18px] leading-[18px]">
              <p>books</p>
              <p>emporium</p>
              </div>
            </div>
            <div onClick={onClose}>
              
              <img src="/images/close.png" alt='close'
              className="xxxl:w-[30px] hd:w-[20px] w-[20px]"></img>
            </div>
            </div>
        {/* Login form */}
        <div className="bg-white rounded-xl border shadow-around-soft   text-center py-4 mt-16  mx-8">
          <h2 className="text-[32px] text-[#2B452C] font-semibold ">
            Welcome Back!
          </h2>
          <p className="xxxl:text-[16px] laptop:text-[12px] hd:text-[14px] mb-10 font-opensans">Login to your account</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="space-y-6 px-4"
          >
            <div className="flex items-center bg-inputBox px-4 py-3 rounded-lg">
              <FaUser className="mr-3 text-[#624534]" />
              <input
                type="email"
                placeholder="Email Id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-inputBox w-full outline-none placeholder-[#624534] text-[18px]"
                required
                autoComplete="email"
              />
            </div>
           <div className='relative'>
            <div className="flex items-center bg-inputBox px-4 py-3 rounded-lg">
              <FaLock className="mr-3 text-[#624534]" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-inputBox w-full outline-none placeholder-[#624534] text-[18px]"
                required
                autoComplete="current-password"
              />
            </div>
             <button
    type="button"
    onClick={() => setShowPassword((prev) => !prev)}
    className="absolute top-1/2 right-3 -translate-y-1/2 text-[#624534]"
  >
    {showPassword ? (
      <FaEyeSlash className="w-5 h-5" />
    ) : (
      <IoEyeSharp className="w-5 h-5" />
    )}
  </button>
</div>
            <div className="flex justify-between items-center text-sm mt-2">
              <label className="flex items-center gap-2 ml-1 text-[#89A28A]">
                <input type="checkbox" />
                Keep me signed in
              </label>
              <span
                className="text-[#727272] font-medium cursor-pointer"
               onClick={() => {
  onClose();
  onOpenForgot();
}}

              >
                Forgot password?
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-loginBtn text-[22px] text-white rounded-full py-2 mt-10"
            >
              Login
            </button>
          </form>

          <p className="text-center text-[14px] mt-8 text-[#89A28A]">
            Don’t have an account?{' '}
            <span
              className="text-[#3A261A] font-semibold underline cursor-pointer"
              onClick={() => {
  onClose();
  onOpenSignup();
}}

            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
      </div>
      
    </div>
  );
}
