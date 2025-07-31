import { useState, useEffect, useRef } from "react";
import { FaFilter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import { RiArrowDropRightLine } from "react-icons/ri";
import { RiArrowDropLeftLine } from "react-icons/ri";
function ProductCard({ product }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/productdetails/${product.book_id}`);
  };

  return (
      <div
  onClick={handleCardClick}
  className="lg:w-[206px] lg:h-[352px]  w-[170px] h-[280px] font-figtree mx-auto border p-3 shadow-around-soft rounded-lg bg-white flex flex-col justify-between"
>
  {/* Image */}
  <img
    src={product.image_url}
    alt={product.title}
    className="lg:w-[169px] lg:h-[253px] w-[100px] h-[148px] object-cover rounded shadow-around-soft mx-auto"
  />

  {/* Title + Author + Price */}
  <div className="flex flex-col justify-between flex-1 mt-1 ">
    {/* Title */}
    <div className="lg:min-h-[22px] text-left px-2">
      <h3 className="font-semibold  text-black text-[16px] leading-[1rem] ">
        {product.title}
      </h3>
    </div>

    {/* Author */}
    <p className="text-[13px] text-gray-600 mt-[2px] px-2 text-left min-h-[18px]">
      By: {product.author}
    </p>

    {/* Price Section */}
    <div className="flex items-center gap-2  mx-2 min-h-[20px]">
      <p className="text-black font-bold text-[13px]">₹{product.price}</p>
      <p className="line-through text-gray-400 font-sans lg:text-[13px] text-[9px]">
        ₹{product.oldprice}
      </p>
      {product.discount && (
        <p className="lg:text-[13px] text-[8px] text-[#CA1D1D]">-{product.discount}%</p>
      )}
    </div>
  </div>
</div>


  );
}
export default function ShopList() {
  const [products, setProducts] = useState([]);
  const [sortOption, setSortOption] = useState("Relevance");
   const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
   const totalPages = 10;
  const [limit] = useState(20);
 const [priceRange, setPriceRange] = useState([49, 5000]);
const [discountRange, setDiscountRange] = useState([0, 70]);
const [yearRange, setYearRange] = useState(['2000 BC', 2024]);
const [isDropdownOpen, setIsDropdownOpen] = useState(true);
const [tempPrice, setTempPrice] = useState(priceRange[1]);
const [tempDiscount, setTempDiscount] = useState(discountRange[1]);
const [tempYear, setTempYear] = useState(yearRange[1]);


const categories = [
  "Fiction",
  "Romance",
  "Mythology & Retellings",
  "Thriller",
  "Crime",
  "Mystery",
  "Historical Fiction",
  "Self-Help & Motivation",
  "Biographies & Memoirs",
  "Business & Economics",
];
  const filterRef = useRef(null);
const [selectedCategories, setSelectedCategories] = useState([]);
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
const fetchProducts = () => {


  // Prepare query values
  const sortQuery = sortOptionMapping[sortOption] || "name_asc";
  const [minPrice, maxPrice] = priceRange;
  const [ ,maxDiscount] = discountRange;
  const [fromYear, toYear] = yearRange;

  // Handle category (using first category or all joined)
  const category = selectedCategories.length > 0 ? selectedCategories[0] : "";

  // Convert discount max into label for API
  let discountLabel = "";
  if (maxDiscount <= 20) discountLabel = "upto_20";
  else if (maxDiscount <= 30) discountLabel = "upto_30";
  else if (maxDiscount <= 50) discountLabel = "upto_50";
  else discountLabel = "upto_70";

  // Build API URL
  const apiURL = `https://booksemporium.in/Microservices/Prod/04_user_website/api/books/list?page=${currentPage}&limit=${limit}&category=${encodeURIComponent(
    category
  )}&sort=${sortQuery}&min_price=${minPrice}&max_price=${maxPrice}&date_from=${fromYear}&date_to=${toYear}&discount=${discountLabel}`;

  // Fetch data
 fetch(apiURL)
  .then((res) => res.json())
  
  .then((data) => {
    if (Array.isArray(data.results)) {
      setProducts(data.results);


    } else {
      console.error("Unexpected API response format:", data);
    }
  })
  .catch((err) => {
    console.error("Failed to fetch products:", err);
  })
 

}
 useEffect(() => {
  fetchProducts();
}, [sortOption, priceRange, discountRange, yearRange, selectedCategories, currentPage]);


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
    <div className=" relative lg:mt-[6%] top-[4%] -left-[56%] w-[111%] lg:w-[280px] bg-white font-sans    lg:left-[0%] lg:z-0 z-0  lg:shadow-around-soft  text-black">
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
          <label key={category} className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="w-4 h-4"
              checked={selectedCategories.includes(category)}
              onChange={() => toggleCategory(category)}
            />
            <span>{category}</span>
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
      <img src="/images/bookfilter.png" alt="banner" className="mt-20 hidden lg:block   top-100 w-[300px]" />
 
  </>
);
useEffect(() => {
  setTempPrice(priceRange[1]);
  setTempDiscount(discountRange[1]);
  setTempYear(yearRange[1]);
}, []);

  return (
    <div>
    <div className="lg:mt-[2%]  min-h-screen overflow-hidden  pb-20 bg-background   lg:px-8 lg:pt-[6%] font-archivo text-[#676A5E]">
     

      <div className="lg:hidden bg-[#B4541F] py-2 rounded flex items-center text-white justify-center mb-4">
        
        <div className="flex-1 text-[13px] flex items-center justify-center  font-archivo ">
          Sort by :
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-transparent text-[13px] tracking-wide font-archivo focus:outline-none"
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
       
  { (Array.isArray(products) && products.map((product) => (
    <ProductCard key={product.book_id} product={product} />
  ))
)}

  </div>
     <div>
      <h1 className="text-[32px]  hidden lg:block font-semibold font-sans text-center text-black">Popular Indian Used-Book Marketplaces</h1>
      <div className="grid lg:grid-cols-[270px_1fr] gap-8 hidden lg:grid xxxl:w-[80%] mx-auto">
        
        <div className="mt-2">{FilterSidebar}</div>
        <div className="flex flex-col gap-8 bg-white mt-20  shadow-around-soft p-6">
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

         <div className="grid grid-cols-2 md:grid-cols-3 xxxl:grid-cols-5 hd:grid-cols-5 laptop:grid-cols-4 gap-4">
  {(Array.isArray(products) && products.map((product) => (
    <ProductCard key={product.book_id} product={product} />
  ))
)}
</div>


      

        </div>
      </div>
      </div>
       
      <div className=" ">
 {/* Pagination Section */}
<div className=" hidden lg:flex xxxl:w-[90%] w-full justify-end items-center text-[18px] text-[#676A5E] mt-8 pb-20">
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

    </div>
   
    </div>
  );
}
