import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UserProfile({ onClose }) {
  const popupRef = useRef();
  const token = localStorage.getItem("accessToken");
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [onClose]);

useEffect(() => {
  const fetchProfile = async () => {
    try {
      const res = await fetch(
        "https://booksemporium.in/Microservices/Prod/02_Authentication/auth/profile",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();
      
      const { user = {}, address = {} } = result;

      const updatedProfile = {
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        phone: user.phone ?? "",
        email: user.email ?? "",
        address: address.street ?? "",
        city: address.city ?? "",
        state: address.state ?? "",
        pincode: address.postal_code ?? "",
      };

      setProfile(updatedProfile);

     
      

    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  fetchProfile();
}, );


  const handleChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch("https://booksemporium.in/Microservices/Prod/02_Authentication/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          first_name: profile.firstName,
          last_name: profile.lastName,
          phone: profile.phone,
          email: profile.email,
          address: {
            street: profile.address,
            city: profile.city,
            state: profile.state,
            postal_code: profile.pincode,
          },
        }),
      });

      if (res.ok) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="fixed inset-0 mt-[31%] lg:mt-[5.5%] z-50 bg-black bg-opacity-50 flex items- justify-start ">
      <div
        ref={popupRef}
        className="bg-background w-full  p-5 overflow-auto lg:max-h-[600px]"
      >
        <ToastContainer />
        <h2 className="text-center font-bold text-[24px] xxxl:text-[32px] laptop:text-[24px] hd:text-[28px] font-archivo mb-5">USER PROFILE</h2>

        <div className="flex flex-col lg:max-w-[80%] mx-auto lg:flex-row gap-5">
          {/* Profile Card */}
          <div className="bg-white  flex flex-col items-center justify-center rounded-xl font-archivon p-6 text-center shadow w-full lg:w-1/3">
            <img src="images/userprofile.png" alt="Profile" className="object-cover mx-auto mb-4" />
            <h3 className="font-semibold text-[30px]  xxxl:text-[32px] laptop:text-[24px] hd:text-[28px]">{profile.firstName?.toUpperCase() || "TEMP"}</h3>
            <p className="text-[#AEAEAE] text-[20px] mt-2 mb-2 lg:mt-6 lg:mb-4 xxxl:text-[25px] laptop:text-[18px] hd:text-[20px]">{profile.email}</p>
            <p className="text-[#AEAEAE] text-[20px]  xxxl:text-[25px] laptop:text-[18px] hd:text-[20px]">+91 {profile.phone}</p>
          </div>

          {/* Form Section */}
          <div className="w-full lg:w-2/3 bg-white rounded-xl p-8 shadow space-y-3">
            {/* Name */}
            <div className="flex flex-col sm:flex-row  gap-4 xxxl:text-[18px] laptop:text-[12px] hd:text-[12px]">
              <input
                type="text"
                placeholder="First Name"
                className="w-full border bg-[#FF9B5D33]   xxxl:text-[18px] laptop:text-[12px] hd:text-[12px]  rounded-md px-4 py-3 xxxl:py-3 laptop:py-2 hd:py-2 text-sm"
                value={profile.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
              />
              <input
                type="text"
                placeholder="Last Name"
                className="w-full border bg-[#FF9B5D33] xxxl:text-[18px] laptop:text-[12px] hd:text-[12px] rounded-md px-4 py-3 xxxl:py-3 laptop:py-2 hd:py-2 text-sm"
                value={profile.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
              />
            </div>

            {/* Phone & Email */}
            <input
              type="text"
              placeholder="Phone No"
              className="w-full border bg-[#FF9B5D33] xxxl:text-[18px] laptop:text-[12px] hd:text-[12px] rounded-md px-4 py-3 xxxl:py-3 laptop:py-2 hd:py-2 text-sm"
              value={profile.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full border bg-[#FF9B5D33] xxxl:text-[18px] laptop:text-[12px] hd:text-[12px] rounded-md px-4 py-3 xxxl:py-3 laptop:py-2 hd:py-2 text-sm"
              value={profile.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />

            {/* Address */}
            <textarea
              rows={3}
              placeholder="Street Address"
              className="w-full border bg-[#FF9B5D33] xxxl:text-[18px] laptop:text-[12px] hd:text-[12px] rounded-md px-4 py-3 xxxl:py-3 laptop:py-2 hd:py-2 text-sm resize-none"
              value={profile.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />

            {/* City, State, Pincode */}
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="City"
                className="w-full border bg-[#FF9B5D33] xxxl:text-[18px] laptop:text-[12px] hd:text-[12px] rounded-md px-4 py-3 xxxl:py-3 laptop:py-2 hd:py-2 text-sm"
                value={profile.city}
                onChange={(e) => handleChange("city", e.target.value)}
              />
              <input
                type="text"
                placeholder="State"
                className="w-full border bg-[#FF9B5D33] xxxl:text-[18px] laptop:text-[12px] hd:text-[12px] rounded-md px-4 py-3 xxxl:py-3 laptop:py-2 hd:py-2 text-sm"
                value={profile.state}
                onChange={(e) => handleChange("state", e.target.value)}
              />
              <input
                type="text"
                placeholder="Pincode"
                className="w-full border bg-[#FF9B5D33] xxxl:text-[18px] laptop:text-[12px] hd:text-[12px] rounded-md px-4 py-3 xxxl:py-3 laptop:py-2 hd:py-2 text-sm"
                value={profile.pincode}
                onChange={(e) => handleChange("pincode", e.target.value)}
              />
            </div>

            {/* Update Button - Mobile */}
            <div className="block lg:hidden">
              <button onClick={handleUpdate} className="bg-[#F6630A] text-white font-bold py-3 px-6 rounded-full w-full">
                UPDATE PROFILE
              </button>
            </div>
             <p className="lg:hidden text-sm text-[#585858] text-center mt-3">
          Want to update Password?{" "}
          <span className="text-[#3A261A] font-bold cursor-pointer">Reset Password</span>
        </p>
          </div>
        </div>

        {/* Update Button - Desktop */}
        <div className="hidden lg:flex justify-center mt-6">
          <button onClick={handleUpdate} className="bg-[#F6630A] text-white font-bold py-3 px-10 rounded-full">
            UPDATE PROFILE
          </button>
        </div>

        <p className="hidden lg:block text-sm text-center text-[#585858] mt-3">
          Want to update Password?{" "}
          <span className="text-[#3A261A] font-bold cursor-pointer">Reset Password</span>
        </p>
      </div>
    </div>
  );
}
