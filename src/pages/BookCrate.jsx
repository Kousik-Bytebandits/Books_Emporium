import { useState, useEffect, useRef } from "react";
import { FaFilter } from "react-icons/fa";
import { FaChevronDown, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import AddressPopup from "./AddressPopup";
import  {showSessionExpiredToast}  from "../components/showSessionExpiredToast";

import { showLoginToast } from "../components/ShowLoginToast";


function ProductCard({ product, addToCrate }) {

 return (
     <div 
   
  className="xxxl:w-[195px] xxxl:h-[350px] hd:h-[300px] laptop:h-[300px] w-[170px]  h-[263px] font-figtree mx-auto mb-4 border shadow-around-soft rounded-lg bg-white flex flex-col"
>
  <div className="p-2 flex flex-col flex-grow">
    <img
      src={product.image_url || "/images/book-left.webp"}
      alt={product.title}
      className="xxxl:w-[170px] laptop:w-[150px] laptop:h-[210px] hd:w-[150px] hd:h-[200px] xxxl:h-[230px] w-[96px] h-[148px] mx-auto  object-cover rounded-md shadow-around-soft"
    />

    <div className="mt-2 min-h-[38px] text-left px-2">
      <h3 className="font-semibold text-black text-[14px] leading-snug line-clamp-2">
        {product.title}
      </h3>
    </div>

    <p className="text-xs text-gray-600 mt-1 px-2 text-left min-h-[18px]">
      By: {product.author}
    </p>
  </div>

  <button 
   onClick={(e) => {
          e.stopPropagation(); 
          addToCrate(product.book_id);
        }}

    className="bg-[#E6712C] text-white text-[15px]  font-semibold py-2 w-full rounded-b-lg hover:bg-[#d7611c] transition-all"
  >
    ADD TO CRATE
  </button>
</div>


  );
}
const API_URL = "https://booksemporium.in/Microservices/Prod/05_cart/crate/books_crate";
const DISCARD_URL = `${API_URL}/all`;
const getToken = () => {
  return localStorage.getItem("accessToken");
};

const crates = [
  {
    name: "Mini Crate",
    books: 10,
    price: 100,
  },
  {
    name: "Classic Crate",
    books: 20,
    price: 200,
  },
  {
    name: "Mega Crate",
    books: 30,
    price: 300,
  },
];


export default function BookCrate({ handleOpenLogin}) {

  const [products, setProducts] = useState([]);
  const [sortOption, setSortOption] = useState("Relevance");
   const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(20);
 const [priceRange, setPriceRange] = useState([49, 5000]);
const [discountRange, setDiscountRange] = useState([10, 70]);
const [yearRange, setYearRange] = useState(['2000 BC', 2024]);
const [tempPrice, setTempPrice] = useState(priceRange[1]);
const [tempDiscount, setTempDiscount] = useState(discountRange[1]);
const [tempYear, setTempYear] = useState(yearRange[1]);
const [isDropdownOpen, setIsDropdownOpen] = useState(true);
const [selectedCrate, setSelectedCrate] = useState(crates[0]);
 const scrollRef = useRef(null);
const [showPopup, setShowPopup] = useState(false);
  const [books, setBooks] = useState([]);
  const [showCrateChangeConfirm, setShowCrateChangeConfirm] = useState(false);
const [pendingCrate, setPendingCrate] = useState(null);
const [crateSummary, setCrateSummary] = useState({
  totalBooks: 0,
  rate: 0,
  totalAmount: 0,
});
const navigate = useNavigate();
const [loading, setLoading] = useState(false);
const [showAddressPopup, setShowAddressPopup] = useState(false);
const [showLogin, setShowLogin] = useState(false);
const [showSignup, setShowSignup] = useState(false);

const [selectedCondition, setSelectedCondition] = useState("");
const [totalProducts, setTotalProducts] = useState(0);
const start = (currentPage - 1) * limit + 1;
const end = Math.min(currentPage * limit, totalProducts);
const totalPages = Math.ceil(totalProducts / limit) || 1;
const handleConditionChange = (value) => {
  setSelectedCondition((prev) => (prev === value ? "" : value)); // toggle off if same
};



const categories = [
  "Fiction",
  "Horror",
  "Sports",
  "History",
  "Reference",
  "Romance",
  "Action & Adventure",
  "Literature & Fiction",
  "Arts, Film & Photography",
  "Crafts, Hobbies & Home",
  "Crime, Thriller & Mystery",
  "Exam Preparation",
  "Medicine and Health Sciences Textbooks",
  "Health, Fitness & Nutrition",
  "Science and Mathematics Textbooks",
  "Diaries & True Accounts",
  "Sciences, Technology & Medicine",
  "Linguistics & Writing",
  "Textbooks & Study Guides",
  "Law",
  "Humour",
  "Business & Economics",
  "Children's Books",
  "Comics & Mangas",
  "Computers & Internet",
  "Engineering",
  "Historical Fiction",
  "Maps & Atlases",
  "Politics",
  "Religion & Spirituality",
  "School Books",
  "Biographies",
  "Teen & Young Adult",
  "Science Fiction & Fantasy",
  "Travel & Tourism",
  "Health, Family & Personal Development",
  
];
const crateNameToApiValue = {
  "Mini Crate": "small crate",
  "Classic Crate": "medium crate",
  "Mega Crate": "large crate",
};

  const filterRef = useRef(null);
const [selectedCategories, setSelectedCategories] = useState([]);
 
 const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };
 const openPopup = () => {
      fetchCrateBooks();
    setShowPopup(true);
  };

 
const toggleCategory = (category) => {
  setSelectedCategories((prev) =>
    prev.includes(category)
      ? prev.filter((c) => c !== category)
      : [...prev, category]
  );
};
const crateLimit = {
  "small crate": 10,
  "medium crate": 20,
  "large crate": 30,
};

const sortOptionMapping = {
  Relevance: "name_asc",
  NameDesc: "name_desc",
  PriceLowHigh: "price_low_high",
  PriceHighLow: "price_high_low",
};
const hasShown403 = useRef(false);

const handle403Redirect = (res) => {
  if (res.status === 403 && !hasShown403.current) {
    toast.error(" The session has expired. Please log in via 'My Account' ");
    hasShown403.current = true;
    return true;
  }
  return false;
};
useEffect(() => {
  hasShown403.current = false;
}, []);

const addToCrate = async (bookId) => {
    const token = localStorage.getItem("accessToken");

  if (!token) {
   showLoginToast(() => handleOpenLogin());

    return;
  }
  try {
    const crate_type = crateNameToApiValue[selectedCrate.name];
     
   const limit = crateLimit[selectedCrate.name];

    if (books.length >= limit) {
      toast.error(`You can't add more than ${limit} books to ${selectedCrate.name}`);
      return;
    }

    const payload = {
      bookId: Number(bookId),
      crate_type,
    };

    console.log("Sending payload:", payload);

    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    
 
    if (res.ok) {
      toast.success("Book added to crate!");
      fetchCrateBooks();
    } else {
      const error = await res.json();
      if (error?.error?.includes("already added")) {
        toast.error("You can't add the same book");
      } else {
        toast.error("Failed to add book to crate");
      }

      console.error("Failed to add book to crate:", error);
    }
  } catch (err) {
   
   toast.error("Something went wrong. Please try again.");
    console.error("Error adding book:", err);
  }
};

const fetchCrateBooks = async () => {
  try {
    const res = await fetch(API_URL, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
 if (handle403Redirect(res)) return;
    const data = await res.json();

    const apiKey = crateNameToApiValue[selectedCrate.name]; 
    const booksList = data[apiKey] || [];

    setBooks(booksList); 

   
    setCrateSummary({
      totalBooks: data.total_no_of_books || 0,
      rate: data.rate_per_book || 0,
      totalAmount: data.total_amount || 0,
    });
  } catch (err) {
    console.error("Error fetching crate books", err);
  }
};



const removeBook = async (bookId) => {
  try {
    const res = await fetch(API_URL, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bookId }),
    });
 if (handle403Redirect(res, navigate)) return;
    if (res.ok) {
      fetchCrateBooks(); 
    }
  } catch (err) {
    console.error("Error removing book", err);
  }
};

const handleConfirmCrateChange = async () => {
  await discardCrate(); 
  setSelectedCrate(pendingCrate); 
  setPendingCrate(null);
  setShowCrateChangeConfirm(false);
  fetchCrateBooks(); 
};


const discardCrate = async () => {
  try {
    const res = await fetch(DISCARD_URL, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`
      },
    });
 if (handle403Redirect(res, navigate)) return;
    if (res.ok) {
      setBooks([]);
    }
  } catch (err) {
    console.error("Failed to discard crate",err);
  }
};


const fetchProducts = (conditionValue = selectedCondition) => {
  const sortQuery = sortOptionMapping[sortOption] || "name_asc";
  const [minPrice, maxPrice] = priceRange;
  const [, maxDiscount] = discountRange;
  const [fromYear, toYear] = yearRange;
  const category = selectedCategories.length > 0 ? selectedCategories[0] : "";

  let discountLabel = "";
  if (maxDiscount <= 20) discountLabel = "upto_20";
  else if (maxDiscount <= 30) discountLabel = "upto_30";
  else if (maxDiscount <= 50) discountLabel = "upto_50";
  else discountLabel = "upto_70";

  const apiURL = `https://booksemporium.in/Microservices/Prod/04_user_website/api/books/list?page=${currentPage}&limit=${limit}&category=${encodeURIComponent(
    category
  )}&sort=${sortQuery}&min_price=${minPrice}&max_price=${maxPrice}&date_from=${fromYear}&date_to=${toYear}&discount=${discountLabel}${
    conditionValue ? `&condition=${conditionValue}` : ""
  }`;

  fetch(apiURL)
    .then((res) => res.json())
    .then((data) => {
      if (Array.isArray(data.results)) {
        setProducts(data.results);
        setTotalProducts(data.total || 0); // ✅ capture total count from API
      } else {
        console.error("Unexpected API response format:", data);
      }
    })
    .catch((err) => {
      console.error("Failed to fetch products:", err);
    });
};


useEffect(() => {
   fetchProducts();
    fetchCrateBooks();
}, [sortOption, priceRange, discountRange, yearRange, selectedCategories, currentPage, selectedCrate, selectedCondition]);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilter(false);
      }
    };
    if (showFilter) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilter]);

  
  
const FilterSidebar = (
  <>
    <div className=" relative  top-[4%] -left-[56%] w-[111%] lg:w-[280px] bg-white font-sans    lg:left-[0%] lg:z-0 z-0  lg:shadow-around-soft  text-black">
        <div className="px-4 pb-6 hidden lg:block">
          <h1 className="flex items-center justify-between pt-4 font-sans font-semibold text-[20px] text-black">Refine Your Search <FaFilter/></h1>
      {/* Price Range */}
      <div className="mb-6">
       
        <h3 className="text-[18px] font-semibold mb-2">Price Range:</h3>
        <p className="text-[16px] font-semibold mb-2 text-gray-700">₹{priceRange[0]} - ₹{tempPrice}</p>
        <div className="flex gap-2">
       <input
  type="range"
  min={49}
  max={5000}
  value={tempPrice}
  onChange={(e) => setTempPrice(parseInt(e.target.value))}
  className="w-full accent-[#77C7F6]"
/>
        <div>
      <button
  onClick={() => setPriceRange([priceRange[0], tempPrice])}
  className="rounded-full bg-orange-400 w-10 text-white font-semibold py-[2px]"
>
  Go
</button>
              </div>
        </div>
      </div>

      {/* Discount Range */}
      <div className="mb-6 font-semibold">
        <h3 className="text-[18px] font-semibold mb-2">Discount Range:</h3>
        <p className="text-[16px] mb-2 text-gray-700">{discountRange[0]}% - {tempDiscount}%</p>
       <div className="flex gap-2">
       <input
  type="range"
  min={0}
  max={70}
  step={10}
  value={tempDiscount}
  onChange={(e) => setTempDiscount(parseInt(e.target.value))}
  className="w-full accent-[#77C7F6]"
/>

        <div>
        <button
  onClick={() => setDiscountRange([discountRange[0], tempDiscount])}
  className="rounded-full bg-orange-400 w-10 text-white font-semibold py-[2px]"
>
  Go
</button>

        </div>
        </div>
      </div>

      {/* Year Published */}
      <div className="mb-6 font-semibold">
        <h3 className="text-[18px] font-semibold mb-2">Year Published:</h3>
        <p className="text-[16px] mb-2 text-gray-700">{yearRange[0]} - {tempYear}</p>
       <div className="flex gap-2">
       <input
  type="range"
  min={-2000}
  max={2024}
  value={tempYear}
  onChange={(e) => setTempYear(parseInt(e.target.value))}
  className="w-full accent-[#77C7F6]"
/>
         <div>
        <button
  onClick={() => setYearRange([yearRange[0], tempYear])}
  className="rounded-full bg-orange-400 w-10 text-white font-semibold py-[2px]"
>
  Go
</button>
        </div>
        </div>
      </div>
{/* Book Condition */}
<div className="mb-6">
  <h3 className="text-[18px] font-semibold mb-2">Book Condition:</h3>
  <div className="space-y-2">
    {[
      { label: "New", value: "new_book" },
      { label: "Used Good", value: "used_good" },
      { label: "Used Old", value: "used_old" }
    ].map((cond) => (
      <label key={cond.value} className="flex items-center space-x-2 text-[#676A5E] text-[16px]">
        <input
          type="checkbox"
          className="w-4 h-4 border border-[#B8BCA2] rounded-sm focus:ring-0 accent-[#B8BCA2]"
          checked={selectedCondition === cond.value}
          onChange={() => handleConditionChange(cond.value)}
        />
        <span className="text-[14px]">{cond.label}</span>
      </label>
    ))}
  </div>
</div>


      {/* Categories */}
      <div className="mb-6">
       <div
      className="flex justify-between items-center cursor-pointer border-t pt-3 pb-2"
      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
    >
      <h3 className="text-[16px] font-semibold">Categories</h3>
      <FaChevronDown
        className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
      />
    </div>

    {/* Dropdown content */}
    {isDropdownOpen && (
      <div className="space-y-2 mt-2">
        {categories.map((category) => (
          <label key={category} className="flex items-center space-x-2 text-[#676A5E] text-[16px]">
            <input
              type="checkbox"
              className="w-4 h-4 accent-[#77C7F6]"
              checked={selectedCategories.includes(category)}
              onChange={() => toggleCategory(category)}
            />
            <span className="line-clamp-1 text-[13px]">{category}</span>
          </label>
        ))}
      </div>
    )}

      </div>
    </div>
      <div className="lg:hidden  lg:bg-white font-archivo flex justify-between items-center px-4 py-3">
        <button
          className="bg-[#CA1D1D] font-tenor text-white text-[14px] px-4 py-[6px] rounded-full "
          onClick={() => {
            setPriceRange([49, 1500]);
            setSelectedCategories([]);
          }}
        >
          Clear Filter
        </button>
        <button
          onClick={() => setShowFilter(false)}
          className="text-[24px] font-bold lg:hidden"
        >
          ✕
        </button>
        <button
          onClick={fetchProducts}
          className="bg-[#3A753C] hidden lg:block text-white px-4 py-[6px] font-tenor rounded-full text-[14px] "
        >
          Apply Filter
        </button>
      </div>
      <div className="w-full hidden   h-px bg-[#C5C5C5] mb-3" />

      <div className="px-4 pb-6 lg:hidden">

        {/* Price Filter */}
        <div className="mb-6">
          <div className="flex justify-between text-sm font-medium mb-2">
            <h3 className="tracking-wide text-[#676A5E] mt-4 text-[16px] lg:text-[22px] font-tenor uppercase">FILTER BY PRICE</h3>
            <span className="text-[16px] lg:hidden text-[#676A5E] mt-4">1 - 20 of 350 Products</span>
          </div>

          <input
            type="range"
            min={49}
            max={2500}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([49, parseInt(e.target.value)])}
            className="w-full h-2 bg-[#B4541F] rounded-lg appearance-none cursor-pointer"
            style={{ accentColor: "#B4541F" }}
          />

          <div className="flex justify-between items-center mt-2 text-sm">
            <p className="text-[16px] text-[#768445] ">Price: ₹{priceRange[0]} — ₹{priceRange[1]}</p>
            <button
              onClick={fetchProducts}
              className="bg-[#E6712C] text-white lg:hidden px-4 py-[6px] font-tenor rounded-full text-[14px] "
            >
              Apply Filter
            </button>
          </div>
        </div>

        {/* PRODUCT TYPE (Left column short, Right column long) */}
        <div className="mb-6">
  <p className="text-[18px] text-[#676A5E] font-tenor lg:text-[22px] uppercase mb-3">Categories</p>
  <div className="grid grid-cols-2 gap-3 text-[px] ">
    {[
      "Fiction",
      "Horror",
      "Action & Adventure",
      "Arts, Film & Photography",
      "Biographies, Diaries & True Accounts",
      "Business & Economics",
      "Children's Books",
      "Comics & Mangas",
      "Computers & Internet",
      "Crafts, Hobbies & Home",
      "Crime, Thriller & Mystery",
      "Engineering",
      "Exam Preparation",
      "Health, Family & Personal Development",
      "Health, Fitness & Nutrition",
      "Historical Fiction",
      "History",
      "Humour",
      "Language, Linguistics & Writing",
      "Law",
      "Literature & Fiction",
      "Maps & Atlases",
      "Medicine and Health Sciences Textbooks",
      "Politics",
      "Reference",
      "Religion & Spirituality",
      "Romance",
      "School Books",
      "Science and Mathematics Textbooks",
      "Science Fiction & Fantasy",
      "Sciences, Technology & Medicine",
      "Society & Social Sciences",
      "Sports",
      "Teen & Young Adult",
      "Textbooks & Study Guides",
      "Travel & Tourism"
    ].map((category, index) => (
      <label key={index} className="flex items-center space-x-2 text-[#676A5E] text-[16px]">
        <input
          type="checkbox"
          className="accent-[#B2BA98] w-[14px] h-[14px]"
          checked={selectedCategories.includes(category)}
          onChange={() => toggleCategory(category)}
        />
        <span className="text-[10px]">{category}</span>
      </label>
    ))}
  </div>
</div>


      </div>
    
    </div>
    
  </>
);

 
useEffect(() => {
  setTempPrice(priceRange[1]);
  setTempDiscount(discountRange[1]);
  setTempYear(yearRange[1]);
}, []);

const handleCrateCheckoutClick = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    toast.error("Please login to proceed");
    return;
  }
  setShowAddressPopup(true); 
};


const handleCrateCheckout = async () => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    showSessionExpiredToast(handleOpenLogin);
    return;
  }

  setLoading(true);

  try {
    const res = await fetch("https://booksemporium.in/Microservices/Prod/06_orders_and_payments/order/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source_type: "crate",
        payment_method: "online",
      }),
    });

    const data = await res.json();

    if (data?.razorpayOrder) {
      const options = {
        key: "rzp_live_7MP3Y4nGgwo2nH",
        amount: data.razorpayOrder.amount,
        currency: "INR",
        name: data.user.name,
        description: "Book Crate Purchase",
        image: "/images/be-logo.webp",
        order_id: data.razorpayOrder.id,
        handler: async function (response) {
          await verifyCratePayment(response, token);

          try {
            const deleteRes = await fetch("https://booksemporium.in/Microservices/Prod/05_cart/crate/books_crate/all", {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (deleteRes.ok) {
              console.log("Crate successfully deleted.");
            } else {
              console.error("Failed to delete crate.");
            }
          } catch (err) {
            console.error("Error deleting crate:", err);
          }

          navigate("/");
        },
        prefill: {
          name: data.user.name,
          email: data.user.email,
          contact: data.user.phone || "",
        },
        notes: data.razorpayOrder.notes || {},
        theme: { color: "#00aaff" },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } else {
      toast.error("Something went wrong while creating the order.");
    }
  } catch (error) {
    console.error("Checkout error:", error);

    if (error?.response?.status === 401 || error?.message.includes("401")) {
      showSessionExpiredToast(handleOpenLogin);
    } else {
      toast.error("An error occurred during checkout.");
    }
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

   
    setLoading(false); 
  } catch (error) {
    console.error("Verification or callback error:", error);
    alert("Error verifying payment or sending payment ID.");
    setLoading(false); 
  }
};



  return (
    <div>
      {loading && <Loader />}
     {showLogin && (
  <Login
    onClose={() => setShowLogin(false)}
    onOpenSignup={() => {
      setShowLogin(false);
      setShowSignup(true);
    }}
    onOpenForgot={() => {
      setShowLogin(false);
    }}
  />
)}
{showSignup && (
  <SignUp
    onClose={() => setShowSignup(false)}
    onOpenLogin={() => {
        console.log("Switching to signup");
      setShowSignup(false);
      setShowLogin(true);
    }}
  />
)}


  <AddressPopup
    isOpen={showAddressPopup}
    onClose={() => {
      setShowAddressPopup(false);
     
    }}
    onProceed={() => {
      setShowAddressPopup(false);
      handleCrateCheckout(); 
    }}
  />


    <div className="pt-[31%]  min-h-screen overflow-hidden  pb-20 bg-background   lg:px-8 lg:pt-[6%] font-archivo text-[#676A5E]">
    
    <div className="lg:hidden bg-[#B4541F] py-2 rounded flex items-center text-white justify-center mb-4">
        
        <div className="flex-1 text-[14px]  flex items-center justify-center  font-archivo ">
          Sort by :
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-transparent text-[14px] tracking-wide font-archivo focus:outline-none"
          >
              <option value="Relevance" className="bg-nav text-black ">Name Ascending</option>
            <option value="NameDesc" className="bg-nav text-black ">Name Descending</option>
            <option value="PriceLowHigh" className="bg-nav text-black ">Price-Low to High</option>
            <option value="PriceHighLow" className="bg-nav text-black ">Price-High to Low</option>
          </select>
        </div>

        <div className="w-px h-10 bg-gray-900 "></div>
<div className="flex-1 relative flex justify-center">
  <button
    onClick={() => setShowFilter(!showFilter)}
    className="font-archivo tracking-wider text-md flex items-center gap-1"
  >
    Filter By <FaFilter className="text-sm" />
  </button>

  {showFilter && (
    <div className="absolute top-full left-0 z-0 mt-3 w-[90vw]  rounded-lg  ">
     

      {/* Filter Panel */}
      <div ref={filterRef} className="shadow-around-soft">
        {FilterSidebar}
       
      </div>
    </div>
  )}
</div>


      </div>
      <div className="xxxl:w-[80%] mx-auto lg:hidden p-4   font-archivo justify-center items-center">
        <h1 className="text-[20px] text-center text-black  font-semibold ">Choose Your<br/> Perfect Book Crate</h1>
        <p className="text-[11px] text-center text-black">Get a box of surprise books — hand-picked and shipped to your door</p>
        
    <div className="  mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6 w-full ">
        {/* Left Side - Crate Selection */}
      <div className="bg-white  rounded-xl p-6 shadow-around-soft">
  <h3 className="lg:text-[24px] text-[20px] text-black font-bold  mb-4">Select Your Crate</h3>
  <div className="grid grid-cols-3  lg:grid-cols-3 gap-2 lg:gap-6">
    {crates.map((crate, index) => (
      <div
        key={index}
        className={`flex flex-col shadow-around-soft items-center justify-between border rounded-xl p-4 h-full transition-all duration-200 ${
          selectedCrate.name === crate.name
            ? "border-orange-400 bg-orange-50"
            : "border-gray-200"
        }`}
      >
        {/* Box image */}
        <div className="xxxl:h-[140px] laptop:h-[80px] hd:h-[120px] h-[100px] flex items-center justify-center mb-4">
          <img
            src={`/images/crate-${index + 1}.webp`}
            alt={crate.name}
            className=" object-contain"
          />
        </div>

        {/* Crate info */}
        <div className="text-center mb-4 text-black ">
          <h4 className="text-[#A06616] xxxl:text-[24px] laptop:text-[18px] hd:text-[20px] text-[10px] font-semibold ">{crate.name}</h4>
          <p className="text-[10px] xxxl:text-[20px] laptop:text-[14px] hd:text-[16px]">{crate.books} Books</p>
          <p className="mt-1 text-[10px] xxxl:text-[18px] laptop:text-[12px] hd:text-[14px] font-medium">₹ {crate.price}</p>
        </div>

        {/* Select button */}
        <button
          onClick={() => {
            if (selectedCrate.name !== crate.name) {
              setPendingCrate(crate);
              setShowCrateChangeConfirm(true);
            }
          }}
          className={`mt-auto w-full lg:px-4 xxxl:py-3 laptop:py-1.5 hd:py-2 py-1.5 text-[10px] rounded lg:text-[14px]  font-semibold ${
            selectedCrate.name === crate.name
              ? "bg-[#492C1E] text-white cursor-default"
              : "bg-[#E6712C] text-white hover:bg-orange-600"
          }`}
        >
          {selectedCrate.name === crate.name ? "SELECTED" : "SELECT"}
        </button>
      </div>
    ))}
  </div>
</div>

        {showCrateChangeConfirm && (
  <div className="fixed inset-0 z-50 flex px-4 items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-xl shadow-lg w-full  p-6 text-center">
      <div className="text-left">
        <h3 className="font-bold mb-2 text-gray-800">PLEASE NOTE:</h3>
        <p className="text-sm text-black font-semibold mb-4">
          SELECTING A NEW CRATE WILL CLEAR ALL ITEMS ADDED TO THE CURRENT CRATE.
        </p>
      </div>
      <div className="flex gap-4 justify-between">
        <button
          onClick={handleConfirmCrateChange}
          className="flex-1  bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded font-semibold text-sm"
        >
          SELECT CRATE
        </button>
        <button
          onClick={() => setShowCrateChangeConfirm(false)}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold text-sm"
        >
          CANCEL
        </button>
      </div>
      
    </div>
  </div>
)}


        {/* Right Side - Crate Details */}
       <div className="bg-white font-archivon rounded-xl p-6 shadow-around-soft">
  <h3 className="xxxl:text-[24px] laptop:text-[18px] hd:text-[20px] text-[18px]  text-[#4B4B4B] font-semibold mb-3">
    Selected Crate :{" "}
    <span className="text-[#A06616] font-semibold">
      {selectedCrate.name}
    </span>
  </h3>
  <div className="  rounded-md    font-archivon xxxl:text-[24px] laptop:text-[18px] hd:text-[20px] text-[18px] font-semibold text-[#4B4B4B] ">
    <div className="flex justify-between">
      <span>Total No.of Books</span>
      <span className="text-[18px]">{crateSummary.totalBooks} Books</span>
    </div>
    <div className="flex justify-between  ">
      <span>Rate Per Book</span>
      <span className="text-[18px]">₹{crateSummary.rate.toFixed(2)}</span>
    </div>
    <div className="flex justify-between   ">
      <span>Total Amount</span>
      <span className="text-[18px]">  ₹{crateSummary.totalAmount.toFixed(2)}</span>
    </div>

  <div className="mt-6  flex   gap-4  text-[16px] xxxl:text-[18px] laptop:text-[12px] hd:text-[14px]">
    <button
      onClick={openPopup}
      className="flex-1 bg-[#3c2b1e] hover:bg-[#2d2015] text-white  xxxl:py-3 laptop:py-1.5 hd:py-2 py-2 rounded  font-semibold"
    >
      View Crate
    </button>
    <button  
    onClick={handleCrateCheckoutClick}
    className="flex-1 bg-[#0e1f36] hover:bg-[#091426] text-white  xxxl:py-3 laptop:py-1.5 hd:py-2 py-2  rounded font-semibold">
      Place My Order
    </button>
  </div>
    </div>
</div>

     

      {/* Selected Books Slider */}
      <div className=" w-full  bg-white   rounded-xl p-4 relative">
        <div className="flex justify-between text-black items-center mb-2">
          <h4 className="font-semibold  text-lg">Selected Books</h4>
          <button
            onClick={openPopup}
            className="text-[15px] border-b-2 border-black font-archivon hover:underline"
          >
            Show all
          </button>
        </div>

       

      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide " ref={scrollRef}>
  {books.map((book) => (
   <img
  key={book.book_id}
  src={book.image_url}
  alt="image"
  className="w-20 h-auto object-cover rounded shadow"
/>

  ))}
</div>


       
      </div>

       <div className="grid grid-cols-2 gap-4  pt-2 font-archivo text-[#676A5E] ">
       {Array.isArray(products) && products.map((product) => (
   <ProductCard key={product.book_id} product={product} addToCrate={addToCrate} />


))}
 </div>
</div>
      {/* Popup Modal */}
    {showPopup && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[20px] text-black font-semibold ">Your Crate Books</h2>
        <button onClick={() => setShowPopup(false)} className="text-red-500 font-bold"><img src="images/close.webp" className="w-5"/></button>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
        {books.map((book) => (
  <div key={book.book_id} className="text-center">
    <img
      src={book.image_url}
      alt="image"
      className="w-[101px] h-[150px] mx-auto object-cover rounded mb-2"
    />
    <button
      onClick={() => removeBook(book.book_id)}
      className="bg-[#AA1414] text-white px-4 py-1 text-[15px] rounded hover:bg-red-600"
    >
      Remove
    </button>
  </div>
))}

      </div>
    </div>
  </div>
)}

     

      </div>
    
       
     
      <div className="xxxl:w-[80%] mx-auto hidden lg:flex flex-col font-archivo justify-center items-center">
        <h1 className="text-[32px] text-black  font-semibold ">Choose Your Perfect Book Crate</h1>
        <p className="text-[20px] text-black">Get a box of surprise books — hand-picked and shipped to your door</p>
        
    <div className="h-[386px]  mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6 w-full ">
        {/* Left Side - Crate Selection */}
      <div className="bg-white rounded-xl p-6 shadow-around-soft">
  <h3 className="text-[24px] text-black font-bold font-sans mb-4">Select Your Crate</h3>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {crates.map((crate, index) => (
      <div
        key={index}
        className={`flex flex-col shadow-around-soft items-center justify-between border rounded-xl p-4 h-full transition-all duration-200 ${
          selectedCrate.name === crate.name
            ? "border-orange-400 bg-orange-50"
            : "border-gray-200"
        }`}
      >
        {/* Box image */}
        <div className="xxxl:h-[140px] laptop:h-[80px] hd:h-[120px] flex items-center justify-center mb-4">
          <img
            src={`/images/crate-${index + 1}.webp`}
            alt={crate.name}
            className=" object-contain"
          />
        </div>

        {/* Crate info */}
        <div className="text-center mb-4 text-black">
          <h4 className="text-[#A06616] xxxl:text-[24px] laptop:text-[18px] hd:text-[20px] text-[16px] font-semibold ">{crate.name}</h4>
          <p className="text-[12px] xxxl:text-[20px] laptop:text-[14px] hd:text-[16px]">{crate.books} Books</p>
          <p className="mt-1 text-[10px] xxxl:text-[18px] laptop:text-[12px] hd:text-[14px] font-medium">₹ {crate.price}</p>
        </div>

        {/* Select button */}
        <button
          onClick={() => {
            if (selectedCrate.name !== crate.name) {
              setPendingCrate(crate);
              setShowCrateChangeConfirm(true);
            }
          }}
          className={`mt-auto w-full px-4 xxxl:py-3 laptop:py-1.5 hd:py-2 py-2 rounded text-[14px]  font-semibold ${
            selectedCrate.name === crate.name
              ? "bg-[#492C1E] text-white cursor-default"
              : "bg-[#E6712C] text-white hover:bg-orange-600"
          }`}
        >
          {selectedCrate.name === crate.name ? "SELECTED" : "SELECT"}
        </button>
      </div>
    ))}
  </div>
</div>

        {showCrateChangeConfirm && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-xl shadow-lg xxxl:w-[28%] lg:w-[30%] p-6 text-center">
      <div className="text-left">
        <h3 className="font-bold mb-2 xxxl:text-[25px] text-[20px] text-gray-800">PLEASE NOTE:</h3>
        <p className="text-[14px] text-black xxxl:text-[18px] font-semibold mb-8">
          SELECTING A NEW CRATE WILL CLEAR ALL <br/>  ITEMS ADDED TO THE CURRENT CRATE.
        </p>
      </div>
      <div className="flex gap-4 justify-between">
        <button
          onClick={handleConfirmCrateChange}
          className="flex-1  bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded font-semibold xxxl:text-[16px] text-[14px]"
        >
          SELECT CRATE
        </button>
        <button
          onClick={() => setShowCrateChangeConfirm(false)}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded font-semibold xxxl:text-[16px] text-[14px]"
        >
          CANCEL
        </button>
      </div>
      <button
        onClick={() => setShowCrateChangeConfirm(false)}
        className="absolute top-2 right-3 text-gray-600 hover:text-black font-bold text-lg"
      >
        ×
      </button>
    </div>
  </div>
)}


        {/* Right Side - Crate Details */}
       <div className="bg-white rounded-xl p-6 shadow-around-soft">
  <h3 className="xxxl:text-[24px] laptop:text-[18px] hd:text-[20px] text-[16px] font-sans text-[#4B4B4B] font-medium mb-3">
    Selected Crate :{" "}
    <span className="text-[#DD6017] font-semibold">
      {selectedCrate.name}
    </span>
  </h3>
  <div className="shadow-around p-4 rounded-md    font-archivo xxxl:text-[24px] laptop:text-[18px] hd:text-[20px] text-[16px] font-semibold text-black ">
    <div className="flex justify-around  py-4 mt-4">
      <span>Total No.of Books</span>
      <span>{crateSummary.totalBooks} Books</span>
    </div>
    <div className="flex justify-around py-4 ">
      <span>Rate Per Book</span>
      <span>₹{crateSummary.rate.toFixed(2)}</span>
    </div>
    <div className="flex justify-around py-4  text-base font-bold   xxxl:text-[24px] laptop:text-[18px] hd:text-[20px] text-[16px] ">
      <span>Total Amount</span>
      <span>₹{crateSummary.totalAmount.toFixed(2)}</span>
    </div>

  <div className="mt-4 px-4 flex gap-4 py-4 text-[10px] xxxl:text-[18px] laptop:text-[12px] hd:text-[14px]">
    <button
      onClick={openPopup}
      className="flex-1 bg-[#3c2b1e] hover:bg-[#2d2015] text-white  xxxl:py-3 laptop:py-1.5 hd:py-2 py-2 rounded  font-semibold"
    >
      View Crate
    </button>
    <button onClick={handleCrateCheckoutClick}
     className="flex-1 bg-[#0e1f36] hover:bg-[#091426] text-white  xxxl:py-3 laptop:py-1.5 hd:py-2 py-2  rounded font-semibold">
      Place My Order
    </button>
  </div>
    </div>
</div>

      </div>

      {/* Selected Books Slider */}
      <div className="mt-20 xxxl:h-[277px] h-[250px] w-full  bg-white  rounded-xl p-4 relative">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-semibold text-[24px] text-black font-archivo">Selected Books</h4>
          <button
            onClick={openPopup}
            className="text-[24px] font-archivon text-black border-b-2 border-black"
          >
            Show all
          </button>
        </div>

        <button
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow"
        >
          <FaChevronLeft className="text-gray-600 " size={22} />
        </button>

      <div className="flex items-center gap-10 overflow-x-auto hide-scrollbar px-10" ref={scrollRef}>
  {books.map((book) => (
   <img
  key={book.book_id}
  src={book.image_url}
  alt="image"
  className="w-[108px] xxxl:h-[168px]   object-cover rounded-lg shadow-around-soft"
/>

  ))}
</div>


        <button
          onClick={() => scroll("right")}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow"
        >
          <FaChevronRight className="text-gray-600" size={22} />
        </button>
      </div>

      {/* Popup Modal */}
    {showPopup && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-xl lg:max-w-[80%] w-full max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Your Crate Books</h2>
        <button onClick={() => setShowPopup(false)} ><img src="images/close.webp" className="w-5"/></button>
      </div>

      <div className="grid grid-cols-3 xxxl:grid-cols-10 laptop:grid-cols-8  gap-4">
        {books.map((book) => (
  <div key={book.book_id} className="text-">
    <img
      src={book.image_url}
      alt="image"
      className="w-[101px] h-[160px] object-cover rounded mb-2"
    />
    <button
      onClick={() => removeBook(book.book_id)}
      className="bg-[#AA1414] text-white px-5 py-1  rounded hover:bg-red-600"
    >
      Remove
    </button>
  </div>
))}

      </div>
    </div>
  </div>
)}

     
    
      <div className="grid lg:grid-cols-[270px_1fr]  lg:w-full gap-8 hidden lg:grid">
        
        <div>{FilterSidebar}</div>
        <div className="flex flex-col gap-8 bg-white mt-16  shadow-around-soft p-6">
         <div className="flex justify-between items-center"> 
        <div className="text-[20px] font-sans font-semibold text-black tracking-wide">
    {start}-{end} of {totalProducts} Products
  </div>
        <div className=" flex items-center gap-2 text-[18px] text-black   rounded-lg">
          Sort by:
         <div className="relative">
  <select
    value={sortOption}
    onChange={(e) => setSortOption(e.target.value)}
    className="appearance-none bg-[#3A261A] text-[18px] border border-[#C5C5C5] px-4 pr-10 py-2 rounded-md text-white tracking-wider focus:outline-none"
  >
    <option value="Relevance">Name Ascending</option>
    <option value="NameDesc">Name Descending</option>
    <option value="PriceLowHigh">Price-Low to High</option>
    <option value="PriceHighLow">Price-High to Low</option>
  </select>
  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-white">
    <FaChevronDown/>
  </div>
</div>

        </div>
        </div>

         <div className="grid grid-cols-2 md:grid-cols-3 xxxl:grid-cols-5 hd:grid-cols-5 laptop:grid-cols-4 gap-8">
  {products.map((product) => (
    <ProductCard key={product.book_id} product={product} addToCrate={addToCrate}/>
  ))}
</div>


      

        </div>
      </div>
      </div>
       
      <div className="xxxl:max-w-[90%] w-full ">
 {/* Pagination Section */}
<div className="hidden lg:flex justify-end items-center text-[18px] text-[#676A5E] mt-8 mb-20">
  <div className="flex gap-2">
    {/* Prev */}
    <button
      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
      disabled={currentPage === 1}
      className={`w-[64px] h-[64px] font-bold rounded flex items-center justify-center border border-[#2B452C] ${
        currentPage === 1
          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
          : "bg-white text-[#3A261A]"
      }`}
    >
      Prev
    </button>

    {/* Page numbers with ellipsis */}
    {(() => {
      const pages = [];
      if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
      } else if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }

      return pages.map((p, i) =>
        p === "..." ? (
          <div
            key={`dots-${i}`}
            className="w-[64px] h-[64px] flex items-center justify-center"
          >
            ...
          </div>
        ) : (
          <button
            key={p}
            onClick={() => setCurrentPage(p)}
            className={`w-[64px] h-[64px] border border-[#2B452C] rounded flex items-center justify-center font-semibold ${
              currentPage === p ? "bg-[#3A261A] text-white" : "bg-white text-[#3A261A]"
            }`}
          >
            {p}
          </button>
        )
      );
    })()}

    {/* Next */}
    <button
      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
      disabled={currentPage === totalPages}
      className={`w-[64px] h-[64px] font-bold rounded flex items-center justify-center border border-[#2B452C] ${
        currentPage === totalPages
          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
          : "bg-white text-[#3A261A]"
      }`}
    >
      Next
    </button>
  </div>
</div>

</div>
<ToastContainer position="top-right" autoClose={3000}  />
</div>

    </div>
   
    
  );
}
