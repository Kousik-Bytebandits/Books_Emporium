import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AddressPopup = ({ isOpen, onClose, onProceed }) => {
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
    const token = localStorage.getItem("accessToken");
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

    if (token && isOpen) fetchProfile();
  }, [isOpen]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("accessToken");
    const { firstName, lastName, phone, email, address, city, state, pincode } = profile;

    if (!firstName || !lastName || !phone || !address || !city || !state || !pincode) {
      toast.error("Please fill out all address fields before proceeding.");
      return;
    }

    try {
      const res = await fetch(
        "https://booksemporium.in/Microservices/Prod/02_Authentication/auth/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            phone,
            email,
            address: {
              street: address,
              city,
              state,
              postal_code: pincode,
            },
          }),
        }
      );

      if (res.ok) {
        toast.success("Address updated successfully!");
        onProceed();
      } else {
        toast.error("Failed to update Address.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Something went wrong.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed font-archivo inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white w-[90%] max-w-3xl p-6 rounded-lg relative">
        <button
          onClick={() => {
            toast.error("Please fill in your address to proceed with payment.");
            onClose();
          }}
          className="absolute top-4 right-4 text-2xl font-bold text-gray-700"
        >
         <img src="images/close.png" className="h-6 mt-4 mr-4"/>
        </button>

        <h2 className="text-[32px] font-archivo font-bold mb-6 text-[#3A261A]">Deliver To This Address</h2>

        <form className="space-y-4">
          <div className="flex gap-4">
            <div className="w-full">
              <label className="block text-[#624534] text-[16px] mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={profile.firstName}
                onChange={handleChange}
                className="w-full p-2 bg-[#FF9B5D33] rounded-md"
              />
            </div>
            <div className="w-full">
              <label className="block text-[#624534] text-[16px] mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={profile.lastName}
                onChange={handleChange}
                className="w-full p-2 bg-[#FF9B5D33] rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#624534] text-[16px] mb-1">Street Address</label>
            <textarea
              name="address"
              value={profile.address}
              onChange={handleChange}
              className="w-full p-2 bg-[#FF9B5D33] rounded-md h-24 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-[#624534] text-[16px] mb-1">Contact Number</label>
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className="w-full p-2 bg-[#FF9B5D33] rounded-md"
              />
            </div>
            <div>
              <label className="block text-[#624534] text-[16px] mb-1">City</label>
              <input
                type="text"
                name="city"
                value={profile.city}
                onChange={handleChange}
                className="w-full p-2 bg-[#FF9B5D33] rounded-md"
              />
            </div>
            <div>
              <label className="block text-[#624534] text-[16px] mb-1">State</label>
              <input
                type="text"
                name="state"
                value={profile.state}
                onChange={handleChange}
                className="w-full p-2 bg-[#FF9B5D33] rounded-md"
              />
            </div>
            <div>
              <label className="block text-[#624534] text-[16px] mb-1">Pincode</label>
              <input
                type="text"
                name="pincode"
                value={profile.pincode}
                onChange={handleChange}
                className="w-full p-2 bg-[#FF9B5D33] rounded-md"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="bg-[#FF9000] text-white text-[20px] font-bold w-[40%] py-3 rounded mt-4 hover:bg-orange-600"
          >
            Proceed To Checkout
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddressPopup;
