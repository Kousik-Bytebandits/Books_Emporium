import { useState, useRef } from "react";
import endpoint_prefix from "../config/ApiConfig";
import NotificationPopup from "./NotificatioPopup";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordPopup({onClose}) {

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
   const [otpVerified, setOtpVerified] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const otpRefs = useRef([]);
   const [popup, setPopup] = useState({
    show: false,
    type: "success",
    message: "",
  });
 
const navigate = useNavigate();
  const showPopup = (type, message) => {
    setPopup({ show: true, type, message });
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
  try {
    const response = await fetch(`${endpoint_prefix}02_Authentication/auth/reset/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailOrPhone }), 
    });

    const data = await response.json();
     if (response.ok) {
        showPopup(
          "success",
          `Email sent to ${emailOrPhone}  Check spam if not received.`
        );
      } else {
        showPopup("error", data.message || "Failed to send OTP");
      }
  } catch (err) {
     showPopup("error", "An error occurred while sending OTP");
    console.error("Failed to send OTP:", err);
  }
};


  const verifyOtp = async () => {
    const otpString = otp.join("");
     if (otpString.length !== 6) {
      showPopup("error", "Please enter a valid 6-digit OTP");
      return;
    }
  try {
    const response = await fetch(`${endpoint_prefix}02_Authentication/auth/reset/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: emailOrPhone,
        otp: otpString,
      }),
    });

    const data = await response.json();
     if (response.ok) {
        setOtpVerified(true);
        showPopup("success", "OTP verified successfully");
      } else {
        showPopup("error", data.message || "Invalid OTP");
      }
  } catch (err) {
     showPopup("error", "An error occurred during OTP verification");
    console.error("Failed to verify OTP", err);
  }
};


  const handleChangePassword = async (e) => {
    e.preventDefault();
     if (!otpVerified) {
    showPopup("error", "Please verify OTP before signing up");
    return;
  }

  if (password !== confirmPassword) {
    showPopup("error", "Passwords do not match");
    return;
  }

    try {
      const response = await fetch(`${endpoint_prefix}02_Authentication/auth/reset/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailOrPhone,
          otp: otp.join(""),
          newPassword: password,
          confirmPassword: confirmPassword,
        }),
      });
      const data = await response.json();
         if (response.ok) {
      if (data.accessToken) {
        localStorage.setItem("access_token", data.accessToken);
        localStorage.setItem("refresh_token", data.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      showPopup("success", "Password Chnaged successfully");
      setTimeout(() => {
        navigate("/signin");
        onClose();
      }, 1500);
    } else {
      showPopup("error", data.message || "Password Reset failed");
    }
    } catch (err) {
      showPopup("error", "An error occurred during signup");
      console.error("Password reset failed", err);
    }
  };



  return (
    <div className="fixed inset-0 px-2 z-50 flex items-center justify-center ">
      <div className="relative rounded-xl px-4 bg-mobileGradient lg:bg-none lg:bg-white px-2 py-10 mx-4 lg:mx-0 lg:flex     lg:w-[75%] lg:h-[85%] text-center mx-auto  rounded-2xl shadow-around-soft lg:p-6 overflow-hidden">

        {/* Left Illustration */}
        <div className="hidden lg:flex  w-1/2 text-center  ">
         
          <img
            src="/images/forgot-bg.png"
            alt="Forgot Password Illustration"
            className="w-full h-full rounded-xl"
          />
        </div>
          
           <div className="flex items-center lg:hidden  justify-between xxxl:mb-14  laptop:mb-4 hd:mb-8 xxxl:px-10 laptop:px-6 hd:px-10">
           <div className="flex items-center ">
            <img src="/images/be-logo.png"
            className="xxxl:w-[58px] laptop:w-[40px] hd:w-[45px] w-[30px]"> 
            </img>
            <div className="flex flex-col text-left uppercase text-[#3A261A] text-[12px] leading-tight font-opensans font-bold xxxl:text-[25px] hd:text-[20px] laptop:text-[16px] xxxl:leading-[22px] hd:leading-[18px] laptop:leading-[14px]">
              <p>books</p>
              <p>emporium</p>
              </div>
            </div>
            <div>
              <button
              className="text-gray-500 hover:text-black"
             onClick={onClose}
              aria-label="Close"
            ><img src="/images/close.png" alt="Close"
              className="xxxl:w-[30px] hd:w-[20px] laptop:w-[18px] w-[20px]"></img></button>
              
            </div>
            </div>

        {/* Right Form */}
        <div className="w-full rounded-2xl shadow-around-soft lg:shadow mt-6 lg:mt-0 bg-white py-3 px-3 lg:w-1/2 lg:p-6 lg:flex lg:flex-col lg:justify-start flex flex-col justify-center relative">
       
          
           <div className="hidden lg:flex items-center   justify-between xxxl:mb-14  laptop:mb-4 hd:mb-8 xxxl:px-10 laptop:px-6 hd:px-10">
           <div className="flex items-center ">
            <img src="/images/be-logo.png"
            className="xxxl:w-[58px] laptop:w-[40px] hd:w-[45px] w-[30px]"> 
            </img>
            <div className="flex flex-col text-left uppercase text-[#3A261A] text-[12px] leading-tight font-opensans font-bold xxxl:text-[25px] hd:text-[20px] laptop:text-[16px] xxxl:leading-[22px] hd:leading-[18px] laptop:leading-[14px]">
              <p>books</p>
              <p>emporium</p>
              </div>
            </div>
            <div>
              <button
              className="text-gray-500 hover:text-black"
              onClick={onClose}
              aria-label="Close"
            ><img src="/images/close.png" alt="Close"
              className="xxxl:w-[30px] hd:w-[20px] laptop:w-[18px] w-[20px]"></img></button>
              
            </div>
            </div>

          {/* Heading */}
          <h2 className="xxxl:text-[45px]  text-[32px] laptop:text-[28px] hd:text-[36px] text-[#2B452C]  font-semibold">
              Welcome !
            </h2>
            <p className="xxxl:text-[16px] text-[14px] laptop:text-[12px] hd:text-[14px] mb-10 font-opensans">Reset Your Password</p>


          {/* Form */}
          <form onSubmit={handleChangePassword}
                        className="xxxl:space-y-5 laptop:space-y-3 hd:space-y-3 xxxl:px-26 laptop:px-10 hd:px-14">

            
            <input
              type="text"
              placeholder="Phone No / Email"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              className="w-full py-3 px-3 xxxl:px-3 laptop:px-2 hd:px-2 xxxl:py-3 hd:py-2 laptop:py-1 rounded text-left bg-inputBox outline-none"
              required
            />

            {/* OTP */}
            <div className="bg-gray-100 p-4 rounded-md mt-4 lg:mt-0 mb-4 lg:mb-0">
              <div className="flex justify-between mb-3 gap-2" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={(el) => (otpRefs.current[index] = el)}
                    className="w-9 h-10 xxxl:w-14 xxxl:h-10 laptop:w-10 laptop:h-8 hd:w-12 rounded bg-inputBox text-center text-xl focus:outline-none"
                  />
                ))}
              </div>

               <div className="flex justify-between font-archivo gap-4">
        <button
          type="button"
          onClick={sendOtp}
          className="bg-sendOtpBtn py-2  text-white w-1/2 xxxl:py-2 hd:py-1 laptop:py-1 rounded text-[18px]"
        >
          Send OTP
        </button>
        <button
          type="button"
          onClick={verifyOtp}
          className="bg-verifyOtpBtn py-2 text-white w-1/2 xxxl:py-2 hd:py-1 laptop:py-1 rounded text-[18px]"
        >
          Verify OTP
        </button>
      </div>
      <p className="text-[#4D4D4D] text-[12px] text-center mt-2 font-semibold">
        Resend OTP
      </p>
              </div>

            {/* Password Fields */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-3 mb-3 lg:mb-0 px-3 xxxl:py-3 hd:py-2 laptop:py-1 rounded bg-inputBox outline-none"
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-3 mb-3 lg:mb-0 xxxl:py-3 hd:py-2 laptop:py-1 rounded bg-inputBox outline-none"
              required
            />

            {/* Submit */}
            <button
              type="submit"
              className="bg-loginBtn text-white py-3 text-[16px] rounded-full xxxl:py-2 hd:py-2 laptop:py-1 px-20 xxxl:text-[22px] hd:text-[16px] laptop:text-[15px] "
            >
              Change Password
            </button>
          </form>
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
  );
}
