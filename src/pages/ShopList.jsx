import { useState, useEffect, useRef } from "react";
import { FaFilter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import { Helmet } from "react-helmet-async";
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
      <h3 className="font-semibold  text-black text-[16px] leading-[1rem] line-clamp-2 ">
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
const limit = isMobile ? 10000 : 20; 
   const [priceRange, setPriceRange] = useState([0, 0]);
const [discountRange, setDiscountRange] = useState([0, 0]);
const [yearRange, setYearRange] = useState([0, 0]);
const [isDropdownOpen, setIsDropdownOpen] = useState(true);
const [tempPrice, setTempPrice] = useState([0, 0]);
const [tempDiscount, setTempDiscount] = useState([0, 0]);
const [tempYear, setTempYear] = useState([0, 0]);
const [selectedCondition, setSelectedCondition] = useState("");
const [totalProducts, setTotalProducts] = useState(0);
const start = (currentPage - 1) * limit + 1;
const end = Math.min(currentPage * limit, totalProducts);
const totalPages = Math.ceil(totalProducts / limit) || 1;
const [isCrate] = useState(false);
const [showOutOfStock] = useState(false);
const [filterRanges, setFilterRanges] = useState(null);


useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

const handleConditionChange = (value) => {
  setSelectedCondition((prev) => (prev === value ? "" : value)); 
};

useEffect(() => {
  const fetchFilterRanges = async () => {
    try {
      const res = await fetch(
        "https://booksemporium.in/Microservices/Prod/04_user_website/api/filter-ranges"
      );
      if (!res.ok) throw new Error("Failed to fetch filter ranges");
      const data = await res.json();

      setFilterRanges(data);

      // initialize filters from backend
      setPriceRange([data.price_range.starting, data.price_range.ending]);
      setDiscountRange([data.discount_range.starting, data.discount_range.ending]);
      setYearRange([data.published_date.starting, data.published_date.ending]);

      setTempPrice([data.price_range.starting, data.price_range.ending]);
setTempDiscount([data.discount_range.starting, data.discount_range.ending]);
setTempYear([data.published_date.starting, data.published_date.ending]);
    } catch (error) {
      console.error("Error fetching filter ranges:", error);
    }
  };

  fetchFilterRanges();
}, []);



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
  }&is_crate=${isCrate ? "true" : "false"}&show_out_of_stock=${showOutOfStock ? "true" : "false"}`;

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
}, [sortOption, priceRange, discountRange, yearRange, selectedCategories, currentPage, selectedCondition]);


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
    <div className=" relative lg:mt-[6%] top-[4%] -left-[56%] w-[111%] lg:w-[280px] bg-white font-sans    lg:left-[0%] lg:z-0 z-0  lg:shadow-around-soft  text-black">
        <div className="px-4 pb-6 hidden lg:block">
          <h1 className="flex items-center justify-between pt-4 font-sans font-semibold text-[20px] text-black">Refine Your Search <FaFilter/></h1>
      {/* Price Range */}
      <div className="mb-6">
       
        <h3 className="text-[18px] font-semibold mb-2">Price Range:</h3>
        <p className="text-[16px] font-semibold mb-2 text-gray-700">₹{tempPrice[0]} - ₹{tempPrice[1]}</p>
        <div className="flex gap-2">
       <input
  type="range"
   min={filterRanges?.price_range?.starting ?? 0}
  max={filterRanges?.price_range?.ending ?? 5000}
  value={tempPrice[1]}
  onChange={(e) => setTempPrice([tempPrice[0], parseInt(e.target.value)])}
  className="w-full accent-[#77C7F6]"
/>
        <div>
      <button
   onClick={() => setPriceRange(tempPrice)}
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
        <p className="text-[16px] mb-2 text-gray-700">{tempDiscount[0]}% - {tempDiscount[1]}%</p>
       <div className="flex gap-2">
       <input
  type="range"
  min={filterRanges?.discount_range?.starting ?? 0}
  max={filterRanges?.discount_range?.ending ?? 90}
  step={5}
  value={tempDiscount[1]}
        onChange={(e) => setTempDiscount([tempDiscount[0], parseInt(e.target.value)])}
  className="w-full accent-[#77C7F6]"
/>

        <div>
        <button
   onClick={() => setDiscountRange(tempDiscount)}
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
        <p className="text-[16px] mb-2 text-gray-700">{tempYear[0]} - {tempYear[1]}</p>
       <div className="flex gap-2">
       <input
  type="range"
  min={filterRanges?.published_date?.starting ?? 1900}
  max={filterRanges?.published_date?.ending ?? new Date().getFullYear()}
  value={tempYear[1]}
      onChange={(e) => setTempYear([yearRange[0], parseInt(e.target.value)])}
  className="w-full accent-[#77C7F6]"
/>
         <div>
        <button
 onClick={() => setYearRange( tempYear)}
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
  <div
    className="space-y-2 mt-2 max-h-[58vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#8B4513] scrollbar-track-[#F5F5DC]"
  >
    {filterRanges?.categories?.type?.map((category) => (
      <label
        key={category}
        className="flex items-center space-x-2 text-[#676A5E] text-[16px]"
      >
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
  className="bg-[#CA1D1D] font-tenor text-white text-[14px] px-4 py-[6px] rounded-full"
  onClick={() => {
    // Reset only price range to API default
    setPriceRange([
      filterRanges?.price_range?.starting ?? 0,
      filterRanges?.price_range?.ending ?? 5000
    ]);
  }}
>
  Clear Price
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
            <span className="text-[16px] lg:hidden text-[#676A5E] mt-4">{totalProducts} Books</span>
          </div>

          <input
            type="range"
           min={filterRanges?.price_range?.starting ?? 0}
  max={filterRanges?.price_range?.ending ?? 5000}
  value={tempPrice[1]}
  onChange={(e) => setTempPrice([tempPrice[0], parseInt(e.target.value)])}
            className="w-full h-2 bg-[#B4541F] rounded-lg appearance-none cursor-pointer"
            style={{ accentColor: "#B4541F" }}
          />

          <div className="flex justify-between items-center mt-2 text-sm">
            <p className="text-[16px] text-[#768445] "> Price: ₹{tempPrice[0]} — ₹{tempPrice[1]}</p>
            <button
              onClick={() => setPriceRange(tempPrice)}
              className="bg-[#E6712C] text-white lg:hidden px-4 py-[6px] font-tenor rounded-full text-[14px] "
            >
              Apply Filter
            </button>
          </div>
        </div>

        {/* PRODUCT TYPE (Left column short, Right column long) */}
        <div className="mb-6">
  <p className="text-[18px] text-[#676A5E] font-tenor lg:text-[22px] uppercase mb-3">Categories</p>
  <div className="grid grid-cols-2 gap-3 text-[px] overflow-y-auto max-h-80">
     {filterRanges?.categories?.type?.map((category, index) => (
      <label key={index} className="flex  items-center space-x-2 text-[#676A5E] text-[16px]">
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
      <img src="/images/bookfilter.webp" alt="banner" className="mt-20 hidden lg:block   top-100 w-[300px]" />
 
  </>
);

useEffect(() => {
  setTempPrice(priceRange);
  setTempDiscount(discountRange);
  setTempYear(yearRange);
}, [priceRange, discountRange, yearRange]);


  return (
    <div>
      <Helmet>
        <title>Shop Second Hand Books Online Near Trichy | Books Emporium</title>
        <meta name="description" content="Browse and shop from a wide range of used books available in Trichy and all over India. Affordable second-hand books delivered to your doorstep." />
        <meta name="keywords" content="Used books Trichy, Buy books online near Trichy, Second hand books, Cheap books online, Old book shops Trichy" />
      </Helmet>

    <div className="lg:mt-[2%] mt-[30%]  min-h-screen overflow-hidden  pb-20 bg-background   lg:px-8 lg:pt-[6%] font-archivo text-[#676A5E]">
     

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
        <div className="flex flex-col gap-8 bg-white mt-24   shadow-around-soft p-6">
         <div className="flex justify-between items-center"> 
       <div className="text-[20px] font-sans font-semibold text-black tracking-wide">
    {start}-{end} of {totalProducts} Books
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
<div className="hidden lg:flex justify-end items-center text-[18px] text-[#676A5E] mt-8 mb-20 xxxl:mr-48">
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

    </div>
   
    </div>
  );
}
