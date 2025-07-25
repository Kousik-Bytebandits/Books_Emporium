import { useState, useEffect, useRef } from "react";
import { FaFilter } from "react-icons/fa";
import { FaChevronDown, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { RiArrowDropRightLine } from "react-icons/ri";
import { RiArrowDropLeftLine } from "react-icons/ri";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProductCard({ product, addToCrate }) {


  return (
     <div 
   
  className="xxxl:w-[195px] xxxl:h-[350px] w-[170px] h-[280px] font-figtree mx-auto border shadow-around-soft rounded-lg bg-white flex flex-col"
>
  <div className="p-3 flex flex-col flex-grow">
    <img
      src={product.image_url}
      alt={product.title}
      className="xxxl:w-[170px] xxxl:h-[230px] w-[130px] h-[190px] object-cover rounded-md shadow-around-soft"
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

    className="bg-[#E6712C] text-white text-[15px] font-semibold py-2 w-full rounded-b-lg hover:bg-[#d7611c] transition-all"
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


export default function BookCrate() {
  const [products, setProducts] = useState([]);
  const [sortOption, setSortOption] = useState("Relevance");
   const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
   const totalPages = 10;
  const [limit] = useState(12);
 const [priceRange, setPriceRange] = useState([100, 5000]);
const [discountRange, setDiscountRange] = useState([10, 70]);
const [yearRange, setYearRange] = useState(['2000 BC', 2024]);
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

const categories = [
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
const sortOptionMapping = {
  Relevance: "name_asc",
  NameDesc: "name_desc",
  PriceLowHigh: "price_low_high",
  PriceHighLow: "price_high_low",
};

const addToCrate = async (bookId) => {
  try {
    const crate_type = crateNameToApiValue[selectedCrate.name];

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
        toast.info("Book already in crate");
      } else {
        toast.error("Failed to add book to crate");
      }
      console.error("Failed to add book to crate:", error);
    }
  } catch (err) {
    toast.error("Something went wrong");
    console.error("Error adding book:", err);
  }
};

const fetchCrateBooks = async () => {
  try {
    const res = await fetch(API_URL, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    const data = await res.json();

    const apiKey = crateNameToApiValue[selectedCrate.name]; // eg. "small crate"
    const booksList = data[apiKey] || [];

    setBooks(booksList); // update displayed books

   
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

    if (res.ok) {
      fetchCrateBooks(); // refresh
    }
  } catch (err) {
    console.error("Error removing book", err);
  }
};

const handleConfirmCrateChange = async () => {
  await discardCrate(); // API call to clear existing books
  setSelectedCrate(pendingCrate); // switch to new crate
  setPendingCrate(null);
  setShowCrateChangeConfirm(false);
  fetchCrateBooks(); // refresh scroll list
};


const discardCrate = async () => {
  try {
    const res = await fetch(DISCARD_URL, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`
      },
    });

    if (res.ok) {
      setBooks([]);
    }
  } catch (err) {
    console.error("Failed to discard crate",err);
  }
};


const fetchProducts = () => {
  const sortQuery = sortOptionMapping[sortOption] || "name_asc";
 

  fetch(`https://booksemporium.in/Microservices/Prod/04_user_website/api/books/list?page=${currentPage}&limit=${limit}&sort=${sortQuery}`)

    .then((res) => res.json())
    .then((data) => {
      if (Array.isArray(data.results)) {
        setProducts(data.results);
      } else {
        console.error("Unexpected API response:", data);
      }
    })
    .catch((err) => console.error("Failed to fetch products", err));
};


useEffect(() => {
  fetchProducts();
  fetchCrateBooks();
}, [selectedCrate, currentPage, sortOption]);


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

  const totalProducts = products.length;
  


 const FilterSidebar = (
  <>
    <div className=" relative  top-[4%] -left-[56%] w-[111%] lg:w-[280px] bg-white font-sans    lg:left-[0%] lg:z-0 z-0  lg:shadow-around-soft  text-black">
        <div className="px-4 pb-6 hidden lg:block">
          <h1 className="flex items-center justify-between pt-4 font-sans font-semibold text-[20px] text-black">Refine Your Search <FaFilter/></h1>
      {/* Price Range */}
      <div className="mb-6">
        <h3 className="text-[18px] font-semibold mb-2">Price Range:</h3>
        <p className="text-[16px] font-semibold mb-2 text-gray-700">₹{priceRange[0]} - ₹{priceRange[1]}</p>
        <input
          type="range"
          min={49}
          max={5000}
         
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
          className="w-full accent-[#77C7F6] "
        />
      </div>

      {/* Discount Range */}
      <div className="mb-6 font-semibold">
        <h3 className="text-[18px] font-semibold mb-2">Discount Range:</h3>
        <p className="text-[16px] mb-2 text-gray-700">{discountRange[0]}% - {discountRange[1]}%</p>
        <input
          type="range"
          min={0}
          max={100}
          value={discountRange[1]}
          onChange={(e) => setDiscountRange([discountRange[0], parseInt(e.target.value)])}
          className="w-full accent-[#77C7F6]"
        />
      </div>

      {/* Year Published */}
      <div className="mb-6 font-semibold">
        <h3 className="text-[18px] font-semibold mb-2">Year Published:</h3>
        <p className="text-[16px] mb-2 text-gray-700">{yearRange[0]} - {yearRange[1]}</p>
        <input
          type="range"
          min={-2000}
          max={2024}
          value={yearRange[1]}
          onChange={(e) => setYearRange([yearRange[0], parseInt(e.target.value)])}
          className="w-full accent-[#77C7F6]"
        />
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
          <label key={category} className="flex items-center  space-x-2">
            <input
              type="checkbox"
              className="w-5 h-4"
              checked={selectedCategories.includes(category)}
              onChange={() => toggleCategory(category)}
            />
            <span className="text-[16px]">{category}</span>
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
  <div className="grid grid-cols-2 gap-3 text-[px]">
    {[
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

  return (
    <div>
    <div className="pt-[33%] min-h-screen overflow-hidden  pb-20 bg-background   lg:px-8 lg:pt-[6%] font-archivo text-[#676A5E]">
      <div className="hidden lg:flex justify-between items-center mb-4 px-4">
       
      </div>

      <div className="lg:hidden bg-[#B4541F] py-2 rounded flex items-center text-white justify-center mb-4">
        
        <div className="flex-1  flex items-center justify-center  font-archivo ">
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
 <h1 className="text-[18px] lg:hidden font-bold font-sans text-center text-black">Popular Indian Used-Book Marketplaces</h1>
      <div className="grid grid-cols-2 gap-3 px-3 pb-4 pt-2 font-archivo text-[#676A5E] lg:hidden">
       {Array.isArray(products) && products.map((product) => (
   <ProductCard key={product.book_id} product={product} addToCrate={addToCrate} />


))}


      </div>
    <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-6xl">
        {/* Left Side - Crate Selection */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-xl font-semibold mb-4">Select Your Crate</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {crates.map((crate, index) => (
              <div
                key={index}
                className={`border rounded-xl p-4 text-center transition-all duration-200 ${
                  selectedCrate.name === crate.name
                    ? "border-orange-400 bg-orange-50"
                    : "border-gray-200"
                }`}
              >
                <div className="flex justify-center mb-4">
                  <img
                    src={`/images/crate-${index + 1}.png`}
                    alt={crate.name}
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <h4 className="text-orange-600 font-semibold">{crate.name}</h4>
                <p className="text-sm text-gray-600">{crate.books} Books</p>
                <p className="mt-1 font-medium">₹ {crate.price}</p>
                <button
                   onClick={() => {
  if (selectedCrate.name !== crate.name) {
    setPendingCrate(crate);
    setShowCrateChangeConfirm(true);
  }
}}

                  className={`mt-3 px-4 py-1.5 rounded text-sm font-semibold w-full ${
                    selectedCrate.name === crate.name
                      ? "bg-[#3c2b1e] text-white cursor-default"
                      : "bg-orange-500 text-white hover:bg-orange-600"
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
    <div className="bg-white rounded-xl shadow-lg w-[300px] p-6 text-center">
      <div className="text-left">
        <h3 className="font-bold mb-2 text-gray-800">PLEASE NOTE:</h3>
        <p className="text-sm text-gray-700 mb-4">
          SELECTING A NEW CRATE WILL CLEAR ALL ITEMS ADDED TO THE CURRENT CRATE.
        </p>
      </div>
      <div className="flex gap-4 justify-between">
        <button
          onClick={handleConfirmCrateChange}
          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded font-semibold text-sm"
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
       <div className="bg-white rounded-xl p-6 shadow-md">
  <h3 className="text-lg font-medium mb-3">
    Selected Crate :{" "}
    <span className="text-orange-600 font-semibold">
      {selectedCrate.name}
    </span>
  </h3>
  <div className="bg-gray-100 p-4 rounded-md space-y-3 text-sm font-medium">
    <div className="flex justify-between">
      <span>Total No.of Books</span>
      <span>{crateSummary.totalBooks} Books</span>
    </div>
    <div className="flex justify-between">
      <span>Rate Per Book</span>
      <span>₹{crateSummary.rate.toFixed(2)}</span>
    </div>
    <div className="flex justify-between text-base font-bold border-t pt-2 border-gray-300">
      <span>Total Amount</span>
      <span>₹{crateSummary.totalAmount.toFixed(2)}</span>
    </div>
  </div>
  <div className="mt-4 flex gap-4">
    <button
      onClick={openPopup}
      className="flex-1 bg-[#3c2b1e] hover:bg-[#2d2015] text-white py-2 rounded font-semibold"
    >
      View Crate
    </button>
    <button className="flex-1 bg-[#0e1f36] hover:bg-[#091426] text-white py-2 rounded font-semibold">
      Place My Order
    </button>
  </div>
</div>

      </div>

      {/* Selected Books Slider */}
      <div className="mt-10 w-full max-w-6xl bg-white border-2 border-blue-400 rounded-xl p-4 relative">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-semibold text-lg">Selected Books</h4>
          <button
            onClick={openPopup}
            className="text-sm text-blue-600 hover:underline"
          >
            Show all
          </button>
        </div>

        <button
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow"
        >
          <FaChevronLeft className="text-gray-600" />
        </button>

      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide px-10" ref={scrollRef}>
  {books.map((book) => (
   <img
  key={book.book_id}
  src={book.image_url}
  alt="image"
  className="w-20 h-auto object-cover rounded shadow"
/>

  ))}
</div>


        <button
          onClick={() => scroll("right")}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow"
        >
          <FaChevronRight className="text-gray-600" />
        </button>
      </div>

      {/* Popup Modal */}
    {showPopup && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Your Crate Books</h2>
        <button onClick={() => setShowPopup(false)} className="text-red-500 font-bold">X</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {books.map((book) => (
  <div key={book.book_id} className="text-center">
    <img
      src={book.image_url}
      alt="image"
      className="w-full h-32 object-cover rounded mb-2"
    />
    <button
      onClick={() => removeBook(book.book_id)}
      className="bg-red-500 text-white px-3 py-1 text-xs rounded hover:bg-red-600"
    >
      Remove
    </button>
  </div>
))}

      </div>
    </div>
  </div>
)}

     
    
      <div className="grid lg:grid-cols-[270px_1fr] gap-8 hidden lg:grid">
        
        <div>{FilterSidebar}</div>
        <div className="flex flex-col gap-8 bg-white mt-16  shadow-around-soft p-6">
         <div className="flex justify-between items-center"> 
       <div className="text-[20px] font-sans font-semibold text-black tracking-wide"> {totalProducts} Results Found</div>
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

         <div className="grid grid-cols-2 md:grid-cols-3 xxxl:grid-cols-6 hd:grid-cols-5 laptop:grid-cols-4 gap-8">
  {products.map((product) => (
    <ProductCard key={product.book_id} product={product} addToCrate={addToCrate}/>
  ))}
</div>


      

        </div>
      </div>
      </div>
       
      <div className=" ">
 {/* Pagination Section */}
<div className=" hidden lg:flex justify-end items-center text-[18px] text-[#676A5E] mt-8 pb-20">
  <div className="flex items-center gap-2">

    {/* Previous Button */}
    <button
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      className="w-[64px] h-[64px] rounded-full border border-[#3A261A] bg-white flex items-center justify-center text-black text-xl"
    >
    <RiArrowDropLeftLine className="w-10 h-10"/>
    </button>

    {/* Page Numbers */}
    {[1, 2, 3].map((page) => (
      <button
        key={page}
        onClick={() => setCurrentPage(page)}
        className={`w-[64px] h-[64px] border border-[#3A261A] rounded-md font-semibold ${
          currentPage === page
            ? "bg-[#3A261A] text-white"
            : "bg-white text-[#3A261A]"
        }`}
      >
        {page}
      </button>
    ))}

{totalPages > 4 && (
      <button
        onClick={() => setCurrentPage(Math.min(currentPage + 3, totalPages))}
        className="w-[64px] h-[64px] border border-[#3A261A] rounded-md bg-white text-[#3A261A] font-semibold"
      >
        ...
      </button>
    )}

    {/* Last Page */}
    <button
      onClick={() => setCurrentPage(totalPages)}
      className={`w-[64px] h-[64px] border border-[#3A261A] rounded-md font-semibold ${
        currentPage === totalPages
          ? "bg-[#3A261A] text-white"
          : "bg-white text-[#3A261A]"
      }`}
    >
      {totalPages}
    </button>

    {/* Next Button */}
    <button
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      className="w-[64px] h-[64px] rounded-full border border-[#3A261A] bg-white flex items-center justify-center text-black text-xl"
    >
      <RiArrowDropRightLine className="w-10 h-10"/>
    </button>
  </div>
</div>

</div>
<ToastContainer position="top-right" autoClose={3000} />


    </div>
   
    
  );
}
