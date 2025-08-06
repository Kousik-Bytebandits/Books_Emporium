import { useState, useRef } from "react";

import NotificationPopup from "./NotificatioPopup"
import endpoint_prefix from "../config/ApiConfig";
export default function SignUp({ onClose, onOpenLogin }) {
 

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    street_address: "",
    state: "",
    city: "",
    postal_code: "",
  });

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpVerified, setOtpVerified] = useState(false);
const otpRefs = useRef([]);


 
  const [popup, setPopup] = useState({
    show: false,
    type: "success",
    message: "",
  });
 

  const showPopup = (type, message) => {
    setPopup({ show: true, type, message });
  };

   const handleChange = (e) => {
    const { name, value } = e.target;

    
    setForm({ ...form, [name]: value });
  };

 const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < otp.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        otpRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      otpRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < otp.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    pasted.split("").forEach((digit, i) => {
      newOtp[i] = digit;
      if (otpRefs.current[i]) {
        otpRefs.current[i].value = digit;
      }
    });
    setOtp(newOtp);
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
  };


  const sendOtp = async () => {
    if (!form.email) {
      showPopup("error", "Please enter your email to receive OTP");
      return;
    }
    try {
      const res = await fetch(
        `${endpoint_prefix}02_Authentication/auth/request-email-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        showPopup(
          "success",
          `Email sent to ${form.email}  Check spam if not received.`
        );
      } else {
        showPopup("error", data.message || "Failed to send OTP");
      }
    } catch (err) {
      showPopup("error", "An error occurred while sending OTP");
      console.log(err);
    }
  };

  const verifyOtp = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      showPopup("error", "Please enter a valid 6-digit OTP");
      return;
    }
    try {
      const res = await fetch(
        `${endpoint_prefix}02_Authentication/auth/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, otp: otpString }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setOtpVerified(true);
        showPopup("success", "Email verified successfully");
      } else {
        showPopup("error", data.message || "Invalid OTP");
      }
    } catch (err) {
      showPopup("error", "An error occurred during OTP verification");
      console.log(err)
    }
  };

  const handleSignup = async (e) => {
  e.preventDefault();


  if (!otpVerified) {
    showPopup("error", "Please verify OTP before signing up");
    return;
  }

  if (form.password !== form.confirmPassword) {
    showPopup("error", "Passwords do not match");
    return;
  }

  const payload = {
    email: form.email,
    password: form.password,
    first_name: form.first_name,
    last_name: form.last_name,
    phone: form.phone,
    address: {
      street: form.street_address,
      city: form.city,
      state: form.state,
      postal_code: form.postal_code,
      country: "INDIA",
      is_default: true,
    },
  };

  try {
    const res = await fetch(
      `${endpoint_prefix}02_Authentication/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    const data = await res.json();
    console.log("signup response",data);
    if (res.ok) {
      if (data.accessToken) {
        localStorage.setItem("access_token", data.accessToken);
        localStorage.setItem("refresh_token", data.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      showPopup("success", "Account created successfully");
      setTimeout(() => {
        onClose();
        onOpenLogin();
      }, 1500);
    } else {
      showPopup("error", data.message || "Email already registered. Please login or reset your password");
    }
  } catch (err) {
    showPopup("error", "An error occurred during signup");
    console.log(err);
  }
};



  return (
    <div className="lg:mt-[6%] mt-[82%] font-opensans  min-h-screen w-full relative ">
       <div className="absolute inset-0  z-10 hidden lg:block" />
       <div className="rounded-2xl bg-mobileGradient lg:bg-none lg:b-white mb-4 px-6 pb-10 mt-4 mx-4 flex flex-col justify-center pt-4">
         <div className="lg:hidden flex items-center justify-between mb-6 lg:mb-0">

           <div className="flex items-center">
            <img src="/images/be-logo.png"
            className="w-[40px] xxxl:w-[58px] laptop:w-[40px] hd:w-[45px] "> 
            </img>
            <div className="flex flex-col text-left uppercase text-[#3A261A]  leading-tight  font-opensans font-bold xxxl:text-[25px] hd:text-[20px] laptop:text-[16px] xxxl:leading-[22px] hd:leading-[18px] laptop:leading-[14px]">
              <p>books</p>
              <p>emporium</p>
              </div>
            </div>
            <div onClick={onClose}>
              <img src="/images/close.png" alt="Close"
              className="w-[25px] xxxl:w-[30px] hd:w-[20px] laptop:w-[18px]"></img>
            </div>
            </div>
     <div className="flex relative min-h-screen  lg:h-screen w-full ">

       
       
        <div className="relative z-20  flex h-full text-center w-full justify-center items-center">
         <div className="w-full   lg:w-[75%] h-full lg:h-[85%]  rounded-2xl overflow-y-auto shadow-around-soft lg:py-4 lg:px-6 bg-white flex flex-col lg:flex-row">

            <div className="w-full lg:w-1/2 bg-white lg:p-10 p-6 mx-auto flex flex-col justify-center">
          <div className="hidden lg:flex items-center justify-between mb-6 lg:mb-0">

           <div className="flex items-center">
            <img src="/images/be-logo.png"
            className="w-[30px] xxxl:w-[58px] laptop:w-[40px] hd:w-[45px] "> 
            </img>
            <div className="flex flex-col text-left uppercase text-[#3A261A] text-[12px] leading-tight  font-opensans font-bold xxxl:text-[25px] hd:text-[20px] laptop:text-[16px] xxxl:leading-[22px] hd:leading-[18px] laptop:leading-[14px]">
              <p>books</p>
              <p>emporium</p>
              </div>
            </div>
            <div onClick={onClose}>
              <img src="/images/close.png" alt="Close"
              className="w-[20px] xxxl:w-[30px] hd:w-[20px] laptop:w-[18px]"></img>
            </div>
            </div>
            <h2 className="lg:hidden text-[32px] text-[#2B452C] font-semibold ">
            Welcome!
          </h2>
          <p className="lg:hidden xxxl:text-[16px] laptop:text-[12px] hd:text-[14px] mb-10 font-opensans">Create your account</p>
          
              <form className="space-y-4 xxxl:space-y-4 laptop:space-y-1 hd:space-y-2" onSubmit={handleSignup}>
    {/* First and Last Name */}
    <div className="flex flex-col lg:flex-row gap-4">
      <input
        type="text"
        name="first_name"
        placeholder="First Name"
        value={form.first_name}
        onChange={handleChange}
        required
        className="w-full p-3 placeholder-[#624534]  lg:w-1/2 px-4 xxxl:py-3 hd:py-2 laptop:py-1 rounded-lg bg-inputBox outline-none"
      />
      <input
        type="text"
        name="last_name"
        placeholder="Last Name"
        value={form.last_name}
        onChange={handleChange}
        className="w-full p-3 placeholder-[#624534] lg:w-1/2 px-4 xxxl:py-3 hd:py-2 laptop:py-1 rounded-lg bg-inputBox outline-none"
      />
    </div>

    {/* Phone and Email */}
    <input
      type="tel"
      name="phone"
      pattern="[0-9]{10}"
      title="Phone number must be exactly 10 digits"
      placeholder="Phone No"
      value={form.phone}
      onChange={handleChange}
      required
      className="w-full p-3 placeholder-[#624534] px-4 xxxl:py-3 hd:py-2 laptop:py-1 rounded-lg bg-inputBox outline-none"
    />

    <input
      type="email"
      name="email"
      placeholder="Email Address"
      value={form.email}
      onChange={handleChange}
      required
      className="w-full p-3 placeholder-[#624534] px-4 xxxl:py-3 hd:py-2 laptop:py-1 rounded-lg bg-inputBox outline-none"
    />

    {/* OTP Section */}
 <div className="hidden lg:flex flex-wrap justify-between font-archivo gap-6 text-[12px] text-[#624534] mt-1">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                Verify OTP Using Phone
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Verify OTP Using Email
              </label>
            </div>

            {/* OTP Fields */}
            <div className="bg-gray-100 p-4 rounded-md">
              <div className="flex justify-between mb-3 gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                     onPaste={handlePaste}
                    onChange={(e) => handleOtpChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={(el) => (otpRefs.current[index] = el)}
                    className="w-10 h-10 xxxl:w-14 xxxl:h-10 laptop:w-12 laptop:h-8  rounded bg-inputBox text-center text-xl focus:outline-none"
                  />
                ))}
              </div>
                <div className="flex justify-between font-archivo gap-4">
        <button
          type="button"
          onClick={sendOtp}
          className="bg-sendOtpBtn text-white p-2 w-1/2 xxxl:py-2 hd:py-1 laptop:py-1 rounded-md text-[18px]"
        >
          Send OTP
        </button>
        <button
          type="button"
          onClick={verifyOtp}
          className="bg-verifyOtpBtn p-2 text-white w-1/2 xxxl:py-2 hd:py-1 laptop:py-1 rounded-md text-[18px]"
        >
          Verify OTP
        </button>
      </div>
      <p className="text-[#4D4D4D] text-[12px] text-center mt-2 font-semibold">
        Resend OTP
      </p>
              </div>

    {/* Password and Confirm Password */}
    <div className="flex flex-col lg:flex-row gap-4">
      <input
        type="password"
        name="password"
        autoComplete="new-password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
        className="w-full p-3 placeholder-[#624534] px-4 xxxl:py-3 hd:py-2 laptop:py-1 rounded-lg bg-inputBox outline-none"
      />
      <input
        type="password"
        name="confirmPassword"
        autoComplete="new-password"
        placeholder="Confirm Password"
        value={form.confirmPassword}
        onChange={handleChange}
        required
        className="w-full  p-3 placeholder-[#624534] px-4 xxxl:py-3 hd:py-2 laptop:py-1 rounded-lg bg-inputBox outline-none"
      />
    </div>

    {/* Street Address */}
    <textarea
      type="text"
      name="street_address"
      placeholder="Street Address"
      value={form.street_address}
      onChange={handleChange}
      rows={3}
      required
      className="w-full p-3 placeholder-[#624534] px-4 xxxl:py-2 hd:py-2 laptop:py-1 rounded-lg bg-inputBox outline-none"
    />

    {/* State, City, Pincode */}
    <div className="flex flex-col lg:flex-row gap-4">
      <input
        type="text"
        name="state"
        placeholder="State"
        value={form.state}
        onChange={handleChange}
        required
        className="w-full p-3 placeholder-[#624534] lg:w-1/3 px-4 xxxl:py-3 hd:py-2 laptop:py-1 rounded-lg bg-inputBox outline-none"
      />
      <input
        type="text"
        name="city"
        placeholder="City"
        value={form.city}
        onChange={handleChange}
        required
        className="w-full p-3 placeholder-[#624534] lg:w-1/3 px-4 xxxl:py-3 hd:py-2 laptop:py-1 rounded-lg bg-inputBox outline-none"
      />
      <input
        type="text"
        name="postal_code"
        pattern="[0-9]{6}"
        title="Pincode must be exactly 6 digits"
        placeholder="Pincode"
        value={form.postal_code}
        onChange={handleChange}
        required
        className="w-full p-3 placeholder-[#624534] lg:w-1/3 px-4 xxxl:py-3 hd:py-2 laptop:py-1 rounded-lg bg-inputBox outline-none"
      />
    </div>

    {/* Submit Button */}
    <div className="text-center ">
      <button
  type="submit"
  className="bg-loginBtn  w-full text-white rounded-full py-3 px-4 text-base font-semibold"
>

        Sign Up
      </button>
    </div>
    <p className="text-center xxxl:text-[14px] laptop:text-[10px] hd:text-[12px] text-[#89A28A]">
                Don’t have an account?{' '}
                <span
                  className="text-[#3A261A] font-semibold underline cursor-pointer"
                  onClick={onOpenLogin}
                >
                  Sign In 
                </span>
              </p>
  </form>
            </div>
            <div className="hidden lg:block w-1/2 relative">
              <img
                src="/images/signup-bg.png"
                alt="Background"
                className=" absolute inset-0 w-full h-full rounded-xl object-cover"
              />
              
            </div>
          </div>
        </div>
      </div>


      {/* Popup */}
      <NotificationPopup
        show={popup.show}
        type={popup.type}
        message={popup.message}
        onClose={() => setPopup({ ...popup, show: false })}
      />
      </div>
    </div>
  );
}
