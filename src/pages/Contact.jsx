import { useState } from "react";
import { Helmet } from "react-helmet";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../components/Loader";
const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    message: "",
  });
const [loading, setLoading] = useState(false); 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, email, message } = formData;
    if (!firstName || !email || !message) {
      toast.error("Please fill all required fields.");
      return;
    }
setLoading(true);
    try {
      const response = await fetch(
        "https://booksemporium.in/Microservices/Prod/07_contact_us/submit-form",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const text = await response.text();
    setLoading(true);
      if (response.ok) {
        toast.success("Thank you for contacting us! We will get back to you soon.");
      
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          message: "",
        });
      } else {
        toast.error("Submission failed: " + text);
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Something went wrong. Please try again.");
    }finally {
      setLoading(false);
    }

  };


  return (
    <div className="bg-cover bg-background bg-center min-h-screen flex flex-col justify-end">
      <Helmet>
  <title>Contact Books Emporium | Used Bookstore in Trichy</title>
  <meta name="description" content="Contact Books Emporium for queries about second-hand books, orders, or selling your books. We're here to help!" />
  <meta name="keywords" content="Contact Books Emporium, Used books Trichy, Sell used books online, Book store India" />
</Helmet>

      {/* Contact Form Section */}
      <img src="images/contact-bg.webp" className=" xxxl:h-[800px] laptop:h-[600px] hd:h-[700px] mt-20"/>
      <div className="bg-white  rounded-xl lg:flex p-6 shadow-around-soft inset-0 z-10 -mt-20 lg:-mt-[20%] xxxl:max-w-[80%] max-w-[90%] mx-auto">
        {/* Left Info */}
        <div className="lg:w-1/2 lg:p-4  text-black space-y-4 ">
          <h3 className="text-[16px] md:text-[18px] font-archivo font-semibold uppercase">Contact Us</h3>
          <p className="text-[14px] md:text-[16px] w-full font-archivo xxxl:max-w-[75%] hd:max-w-[80%] laptop:max-w-[100%] leading-relaxed">
           Books Emporium is your go-to destination for bestsellers, classics, and unique finds. We’re passionate about stories that inspire, entertain, and educate. Whether you're a lifelong reader or just starting out, we’re here to help. Reach out anytime. we’d love to connect and hear from you!
          </p>

          <div className="space-y-6 pt-4 md:text-[21px] ml-10 md:ml-28 md:pt-12  text-[#887562] font-archivon">
            <div className="flex items-center  gap-6">
              <img src="images/mailus.webp" className="w-8"/>
              <div>
                <p className="font-semibold text-[16px] lg:text-[23px]">MAIL US</p>
                <p>info@booksemporium.in</p>
              </div>
            </div>
            <div className="flex items-center  gap-6">
              <img src="images/wapp.webp"  className="w-8"/>
              <div>
                <p className="font-semibold text-[16px]  lg:text-[23px]">REACH US VIA WHATSAPP</p>
                <p>+91 - 7598241312</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <img src="images/phone.webp"  className="w-8" />
              <div>
                <p className="font-semibold text-[16px]  lg:text-[23px]">CALL US</p>
                <p>+91 - 7598241312</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="lg:w-1/2 md:p-4 font-archivon">
          <h3 className="mt-10 text-[16px] md:text-[20px] mb-3 font-semibold text-gray-700">
            Leave us a message and we’ll get back to you
          </h3>
          <form
            className="space-y-4 bg-[#FFF7F0] p-4 rounded-xl border border-[#BAA998] shadow-sm text-[18px]"
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#492C1E] mb-1">First Name*</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="w-full border border-[#8EB490]  bg-[#FFC49080] rounded px-2 py-2"
                />
              </div>
              <div>
                <label className="block text-[#492C1E] mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="w-full border border-[#8EB490] bg-[#FFC49080] rounded px-2 py-2"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#492C1E] mb-1">Email Address*</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="w-full border border-[#8EB490] bg-[#FFC49080] rounded px-2 py-2"
                />
              </div>
              <div>
                <label className="block text-[#492C1E] mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="w-full border border-[#8EB490] bg-[#FFC49080] rounded px-2 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#492C1E] mb-1">Message*</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                placeholder="Message"
                className="w-full border border-[#8EB490] bg-[#FFC49080] rounded px-2 py-1"
              ></textarea>
            </div>
            {loading && <Loader /> }
            <button
              type="submit"
              className="bg-[#E6712C] text-[20px] hover:bg-or[#492C1E] text-white px-6 py-3 rounded mt-2 w-full"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Info */}
       <div className="xxxl:w-[80%]  w-[90%] mx-auto mb-20 h-[160px]  grid grid-cols-2 md:grid-cols-4 lg:h-[160px] mt-10  bg-white shadow-around-soft lg:py-6 rounded-md  ">
        {[
          { icon: "Truck.webp", title: "Free Delivery", desc: "Order over Rs 1000" },
          { icon: "security.webp", title: "Secured Payment", desc: "100% Guarantee Security" },
          { icon: "Tag.webp", title: "Best Deals", desc: "Upto 30% Discount" },
          { icon: "rotate.webp", title: "Free Returns", desc: "Within 15 days" },
        ].map((item, i) => (
          <div key={i} className="md:p-2 gap-2 md:gap-4 flex justify-between items-center   mx-auto mt-4 lg:mt-0">
            <img src={`images/${item.icon}`} className="w-[32px] lg:w-[48px] lg:mt-2" alt="img" />
            <div className="text-left text-[14px]">
              <p className="xxxl:text-[24px] hd:text-[20px] laptop:text-[18px]  font-semibold">{item.title}</p>
              <p className="xxxl:text-[18px] hd:text-[16px] laptop:text-[14px] text-[11px] text-gray-500">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Contact;
