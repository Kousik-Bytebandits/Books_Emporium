import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../components/Loader";
import AddressPopup from "./AddressPopup";
import { Helmet } from "react-helmet";
import { showLoginToast } from "../components/ShowLoginToast";

const ProductDetails = ({ handleOpenLogin }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const selectRef = useRef(null);
const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [showDescription, setShowDescription] = useState(true);
  const [showDetails, setShowDetails] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [maxStock, setMaxStock] = useState(0);
  const [options, setOptions] = useState([]);
  const [quantity, setQuantity] = useState(1);
const [showPopup, setShowPopup] = useState(false);



  useEffect(() => {
    if (maxStock > 0) {
      const limit = Math.min(maxStock, 20);
      const opts = Array.from({ length: limit }, (_, i) => i + 1);
      setOptions(opts);
    }
  }, [maxStock]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://booksemporium.in/Microservices/Prod/04_user_website/api/books/${id}`
        );
        const data = await response.json();
        setProduct(data);
        
        const stockQty = Number(data.product_details.stock_quantity);
        setMaxStock(stockQty);

        if (!quantity || quantity < 1) {
          setQuantity(1);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
        toast.error("Failed to load product details.");
      }
    };

    fetchProduct();
  },[id] );

  if (!product) {
    return <div className="text-center py-10">Loading...</div>;
  }

  const handleAddToCart = async () => {
    const token = localStorage.getItem("accessToken");

    if (!quantity || quantity < 1) {
      toast.warning("Please select a valid quantity before adding to cart.");
      return;
    }

    if (!token || token === "forbidden") {
         showLoginToast(() => handleOpenLogin());

      return;
    }

    try {
      const response = await fetch(
        "https://booksemporium.in/Microservices/Prod/05_cart/cart/items",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            bookId: product.product_details.book_id,
            quantity: quantity,
          }),
        }
      );

      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to add product to cart");
        } else {
          const errorText = await response.text();
          throw new Error(errorText || "Failed to add product to cart");
        }
      }

      const result = await response.json();
      console.log(result);
      toast.success("Product added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Error: " + error.message);
    }
  };

  const handleBuyNow = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    showLoginToast(() => handleOpenLogin(true));
    return;
  }
  setShowPopup(true); 
};


    const processBuyNowPayment = async () => {
  const token = localStorage.getItem("accessToken");
  setLoading(true);

  try {
    const res = await fetch("https://booksemporium.in/Microservices/Prod/06_orders_and_payments/order/purchase-book", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source_type: "single_book",
        payment_method: "online",
        book_id: product.book_id || id,
        quantity: quantity,
      }),
    });

    const data = await res.json();

    if (data?.razorpayOrder) {
      const options = {
        key: "rzp_live_7MP3Y4nGgwo2nH",
        amount: data.razorpayOrder.amount,
        currency: "INR",
        name: data.user.name,
        description: data.items[0].title,
        image: "/logo.webp",
        order_id: data.razorpayOrder.id,
        handler: async function (response) {
          await verifyCratePayment(response, token);
        },
        prefill: {
          name: data.user.name,
          email: data.user.email,
          contact: data.user.phone,
        },
        notes: data.razorpayOrder.notes,
        theme: { color: "#00aaff" },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } else {
      toast.error("Please login to Buy products");
    }
  } catch (error) {
    console.error("Checkout error:", error);
    alert("An error occurred during checkout.");
  } finally {
    setLoading(false);
  }
};

 const verifyCratePayment = async (response, token) => {
  try {
    const verifyRes = await fetch("https://booksemporium.in/Microservices/Prod/06_orders_and_payments/order/verify", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
      }),
    });

    const result = await verifyRes.json();
    console.log("Payment verified:", result);

    
    await fetch("https://booksemporium.in/Microservices/Prod/07_contact_us/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        payment_id: response.razorpay_payment_id,
      }),
    });

   

  } catch (error) {
    console.error("Verification or callback error:", error);
    alert("Error verifying payment or sending payment ID.");
  }
};


  return (
   <>
      {loading && <Loader />}
     

  <AddressPopup
    isOpen={showPopup}
    onClose={() => {
      
      setShowPopup(false);
    }}
    onProceed={() => {
      setShowPopup(false);
      processBuyNowPayment(); // now do the actual Razorpay call
    }}
  />
 <Helmet>
  <title>{product?.title} | Buy Used Book at Best Price - Books Emporium</title>
  <meta name="description" content={`Buy ${product?.title} second hand online at Books Emporium. Best deals on used books with fast delivery in Trichy and India-wide.`} />
  <meta name="keywords" content="Used books, Buy used books, Cheap second hand books online, Books Emporium, Book Finder" />
</Helmet>


    <div className="bg-background  hidden lg:block  lg:pt-[8%] min-h-screen px-4 py-6 font-sans">
      {/* Breadcrumb */}
      <p className="text-black font-semibold text-[24px] tracking-wider font-archivo mb-10 hidden lg:block">
        Books &gt; The Power Of Your Subconscious Mind
      </p>

      <div className="bg-white font-archivon   p-6 flex flex-col  lg:pt-[4%] gap-6 shadow-around-soft">
        {/* Left: Book Image */}
        <div className="lg:flex lg:w-[80%] lg:mx-20">
        <div className="flex justify-center lg:w-1/2">
          <img
            src={product?.product_details?.image_url}
  alt={product?.product_details?.title}
            className="w-[220px] lg:w-[306px] lg:h-[473px] rounded-lg shadow-around-soft"
          />
        </div>

        {/* Right: Book Details */}
        <div className="lg:w-1/2 flex flex-col gap-2">
          <h2 className="text-2xl lg:text-[40px] mb-4  font-archivo font-semibold text-[#282828]">
           {product?.title}
          </h2>
          <p className="text-[#3D3D3D] text-lg lg:text-[32px]">	 {product?.product_details?.title}</p>

          {/* Pricing */}
          <div className="mt-4">
            <div className="text-[22px] lg:text-[50px] font-semibold text-black">
              ₹ {product?.product_details?.price} <span className="text-[#CA1D1D] text-[16px] lg:text-[35px] font-bold "> - {product?.product_details?.discount} %</span>
            </div>
            <div className="text-[#666666] mt-4 text-sm lg:text-[25px]">M.R.P: <span className="line-through"> {product?.product_details?.oldprice}</span></div>
            <div className="text-sm text-[#3D3D3D] lg:text-[25px] mt-8">Inclusive Of All Taxes</div>
          </div>

          {/* Quantity */}
   <div className="relative inline-flex items-center border border-black rounded-md bg-[#FFF7F0] px-3 py-2 w-[220px] my-4">
  <span className="text-sm text-black">Select Quantity</span>
  <div className="relative ml-auto">
    <select
      ref={selectRef}
      value={quantity}
      onChange={(e) => setQuantity(Number(e.target.value))}
      className="appearance-none bg-transparent text-black text-right pr-6 cursor-pointer"
    >
      {options.map((opt, i) => (
        <option
          key={opt}
          value={opt}
          style={{
            backgroundColor: i % 2 === 0 ? "#EFE0D3" : "#FFF7F0",
            textAlign: "center",
          }}
        >
          {opt}
        </option>
      ))}
    </select>
    <div className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-black">
      <FaChevronDown size={12} />
    </div>
  </div>
</div>


          <div className="flex justify-between  lg:mt-6">
           <button
            onClick={handleAddToCart} 
           className="bg-[#3A261A] text-md lg:text-[24px] text-white w-[45%] px-4 py-2 rounded-md font-semibold hover:bg-[#4a2615]">
              Add To Cart
            </button>
            <button  onClick={handleBuyNow} className="bg-[#145974] text-md lg:text-[24px] text-white px-4 py-2 w-[45%] rounded-md font-semibold hover:bg-[#084464]">
              Buy Now
            </button>
          </div>
         </div>
         </div>
          {/* Description */}
          <div className="  flex flex-col lg:w-[70%]  lg:mx-[16%] mb-10">
          <div className="mt-6 ">
            <h3 className="text-[18px] lg:text-[24px] font-semibold mb-2 text-[#4B4B4B] font-archivo">Description</h3>
            <p className="text-sm text-[#6A6A6A] lg:text-[20px] leading-6">
              {product?.product_details?.description}
            </p>
          </div>

          {/* Other Details */}
          <div className="mt-6">
            <h3 className="text-[18px] lg:text-[24px] font-semibold font-archivo mb-2 text-[#4B4B4B]">Other Details</h3>
            <ul className="text-sm text-[#6A6A6A] lg:text-[20px] space-y-3">
              <p><span className="font-semibold">Author:</span> {product?.product_details?.author}</p>
    <p><span className="font-semibold">Publisher:</span> {product?.product_details?.publisher}</p>
    <p><span className="font-semibold">Published Date:</span> {product?.product_details?.published_date}</p>
    <p><span className="font-semibold">Language:</span> {product?.product_details?.language}</p>
    <p><span className="font-semibold">Pages:</span> {product?.product_details?.pages}</p>
    <p><span className="font-semibold">ISBN:</span> {product?.product_details?.ean}</p>
            </ul>
          </div>
          </div>
        
      </div>

      {/* Top Picks Section */}
    {product?.related?.length > 0 && (
  <div className="mt-10">
    <h2 className="text-xl font-bold mb-4 text-black lg:text-[32px] font-archivo text-center">
      Top Picks For You
    </h2>

    <div className="flex gap-4 overflow-x-auto hide-scrollbar  pb-2 justify-evenly mt-10 mb-10 lg:w-[80%] mx-auto">
      {product.related.map((item, index) => (
        <div
        
          key={index}
           onClick={() => navigate(`/productdetails/${item.book_id}`)}
          className="min-w-[150px] w-[185px] h-[335px] p-2 bg-white cursor-pointer rounded-xl shadow-md flex-shrink-0"
        >
          <img
            src={item.image_url}
            alt={item.title}
            className="w-[150px] h-[230px] mx-auto rounded object-contain"
          />
          <div className="mt-2 text-sm text-black font-archivo font-semibold">
            {item.title}
          </div>
          <div className="text-xs text-[#666]">By: {item.author || "Unknown"}</div>
          <div className="flex items-center gap-2 mt-1">
            <p className="lg:text-[12px] font-bold text-black">₹{item.price}</p>
            <p className="lg:text-[12px] line-through text-gray-400">
              ₹{item.oldprice}
            </p>
            <p className="lg:text-[12px] text-[#CA1D1D] font-medium">
              -{" "}
              {item.discount} %
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

    </div>

    


<div className="lg:hidden pt-[40%]  px-4 py-4 bg-[#FFF8F4] font-archivo">
  {/* Delivery Banner */}
  <p className="text-center text-[20px] font-figtree font-semibold text-black mb-3">Delivery Within 4–6 Business Days</p>

  {/* Product Image */}
  <div className="bg-white p-6 rounded-lg shadow-around-soft flex justify-center">
    <img
       src={product?.product_details?.image_url}
  alt={product?.product_details?.title}
      className="w-[150px] h-[230px]  object-contain"
    />
  </div>

  {/* Product Info */}
  <div className="bg-white mt-3 p-4 rounded-lg shadow-around-soft">
    <h2 className="text-[24px] font-semibold ">
       {product?.product_details?.title}
    </h2>
    <p className="text-[20px] font-archivon text-[#3D3D3D] my-1">By:  {product?.product_details?.author}</p>

    {/* Pricing */}
   <div className="flex items-center gap-2 mt-2 font-archivon">
  <p className="text-[32px] font-bold text-[#3A261A]">₹{product?.product_details?.price}</p>
  <p className="text-[16px] text-[#666666]">
    M.R.P <span className="line-through">₹{product?.product_details?.oldprice}</span>
  </p>
  <p className="text-[16px] text-[#CA1D1D] font-semibold">
    - {product?.product_details?.discount}%
  </p>
</div>

    {/* Quantity Controls */}
  <div className="relative inline-flex items-center border border-black rounded-md bg-[#FFF7F0] px-3 py-2 w-[220px] my-4">
  <span className="text-sm text-black">Select Quantity</span>
  <div className="relative ml-auto">
    <select
      ref={selectRef}
      value={quantity}
      onChange={(e) => setQuantity(Number(e.target.value))}
      className="appearance-none bg-transparent text-black text-right pr-6 cursor-pointer outline-none"
      style={{ minWidth: '60px' }} // force consistent width
    >
      {options.map((opt, i) => (
        <option
          key={opt}
          value={opt}
          style={{
            backgroundColor: i % 2 === 0 ? "#EFE0D3" : "#FFF7F0",
            textAlign: "center",
          }}
        >
          {opt}
        </option>
      ))}
    </select>
    <div className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-black">
      <FaChevronDown size={12} />
    </div>
  </div>
</div>

    {/* Action Buttons */}
    <div className="flex gap-3 mt-4">
      <button
       onClick={handleAddToCart} 
        className="flex-1 bg-[#3A261A] text-white rounded-md py-3 text-[14px] font-semibold">
        Add To Cart
      </button>
      <button  onClick={handleBuyNow}
       className="flex-1 bg-[#145974] text-white rounded-md py-3 text-[14px] font-semibold">
        Buy Now
      </button>
    </div>
  </div>

  {/* Description */}
 <div className="bg-white mt-3 p-4 rounded-lg shadow-around-soft lg:hidden">
  {/* Description Section */}
  <div>
    <div
      onClick={() => setShowDescription(!showDescription)}
      className="flex justify-between items-center cursor-pointer"
    >
      <p className="font-semibold text-[18px] text-[#4B4B4B]">Description</p>
      <span className="text-[#666] text-[14px] transform transition-transform duration-300" style={{ transform: showDescription ? 'rotate(180deg)' : 'rotate(0deg)' }}><FaChevronDown/></span>
    </div>
    {showDescription && (
      <p className="mt-2 text-[14px] text-[#555] leading-relaxed">
        {isExpanded
          ? `How to harness the limitless power of your subconscious mind in order to succeed in every sphere of your life. This book explains how we can harness its power in order to become self-aware and succeed in all areas of our lives. This book explains how we can harness its limitless power in order to become self-aware and experience success in every sphere of our lives.This book has touched millions of lives. It is designed to help you improve your relationships, health, sleep, career, and it arms you with useful insights that help you cross any kind of obstacle in life. Drawing on both deep scientific research as well as spiritual wisdom, it acts as a guide in helping one form a close connection with one’s subconscious, overcome unresolved fears and understand and then manifest what one truly desires.Dr Joseph Murphy says, our lives and its landmark events are shaped by the workings of our conscious and subconscious minds. This book gives practical techniques through which one can change one’s destiny by focusing and redirecting the magical energy of one’s mind and spirit.
`
          : ` How to harness the limitless power of your sub conscious mind in order to succeed in every
              sphere of your life our subconscious mind has the power to change our lives. this book
              explains how we can harness its limitless power in order to become self-aware and experience
              success in every sphere of our lives.`}
        <span
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[#F24137] font-semibold cursor-pointer"
        >
          {isExpanded ? ' Show Less' : ' Read More...'}
        </span>
      </p>
    )}
  </div>

  {/* Dashed Divider */}
  <div className="my-4 border-t border-dashed border-gray-300" />

  {/* Other Details Section */}
  <div>
    <div
      onClick={() => setShowDetails(!showDetails)}
      className="flex justify-between items-center cursor-pointer"
    >
      <p className="font-semibold text-[#4B4B4B] text-[18px]">Other Details</p>
      <span className="text-[#666] text-[14px] transform transition-transform duration-300" style={{ transform: showDetails ? 'rotate(180deg)' : 'rotate(0deg)' }}><FaChevronDown/></span>
    </div>
   {showDetails && (
  <div className="mt-2 text-[14px] text-[#444] space-y-1">
    <p><span className="font-semibold">Author:</span> {product?.product_details?.author}</p>
    <p><span className="font-semibold">Publisher:</span> {product?.product_details?.publisher}</p>
    <p><span className="font-semibold">Published Date:</span> {product?.product_details?.published_date}</p>
    <p><span className="font-semibold">Language:</span> {product?.product_details?.language}</p>
    <p><span className="font-semibold">Pages:</span> {product?.product_details?.pages}</p>
    <p><span className="font-semibold">ISBN:</span> {product?.product_details?.ean}</p>
  </div>
)}
  </div>
</div>


  {/* Top Picks Section */}
{product?.related?.length > 0 && (
  <div className="mt-6">
    <h3 className="font-bold text-[20px] text-center mb-4">Top Picks For You</h3>
    
    <div className="flex gap-3  overflow-x-auto px-2 py-2 scrollbar-hide">
      {product.related.map((item) => (
        <div
          key={item.book_id}
          onClick={() => navigate(`/productdetails/${item.book_id}`)}
          className="w-[140px] bg-white h-[224px] rounded-lg p-2 shadow-around-soft text-center cursor-pointer flex-shrink-0"
        >
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-[130px] object-contain mx-auto"
          />
          <p className=" text-[10px] font-figtree font-semibold mt-2 line-clamp-2">{item.title}</p>
          <div className="mt-1 text-[9px] flex justify-start gap-3 px-2 items-center">
               <span className="text-[#F24137] font-semibold ml-1">-{item.discount}%</span>
            <span className="text-black font-bold text-[11px]">₹{item.price}</span>
           
             
          </div>
           <>
                <span className="text-[#999] ml-1 text-[12px]"> M.R.P <span className="line-through ">₹{item.oldprice}</span></span>
             
              </>
            
        </div>
      ))}
    </div>
  </div>
)}



      
</div>
<ToastContainer position="top-right" autoClose={5000} />
</>
  );
};

export default ProductDetails;
