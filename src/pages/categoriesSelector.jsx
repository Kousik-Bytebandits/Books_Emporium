import { useState, useEffect } from "react";
import categories from "./categories";
import { Helmet } from "react-helmet-async";
export default function CategorySelector({ onBooksFetched }) {
  const [activeId, setActiveId] = useState(true);
  
const defaultCategory = categories.find((cat) => cat.title === "Fiction");

  useEffect(() => {
    if (defaultCategory) {
      setActiveId(defaultCategory.id);
      fetchBooksByCategory(defaultCategory.title);
    }
  }, []);


  const handleCategoryClick = (cat) => {
    setActiveId(cat.id);
    fetchBooksByCategory(cat.title);
  };

  const fetchBooksByCategory = async (category) => {
    
    try {
      const res = await fetch(
        `https://booksemporium.in/Microservices/Prod/04_user_website/api/books?category=${category}`,
        {
          method: "GET",
          redirect: "follow",
        }
      );

      const text = await res.text();
      const data = JSON.parse(text);

      console.log("Books Fetched:", data);

      if (onBooksFetched) {
        onBooksFetched(data); 
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } 
  };

  return (
 <div className="bg-white mt-10 overflow-x-auto w-[94%] xxxl:max-w-[80%] md:w-[96%] mx-auto rounded-md shadow-around-soft">
 <Helmet>
  <title>Book Categories | Buy Old Books by Genre - Books Emporium</title>
  <meta name="description" content="Select from a variety of book categories. From fiction to educational, find the best second-hand books online." />
  <meta name="keywords" content="Book categories, Buy used books by genre, Cheap books India, Old book categories, Book Finder" />
</Helmet>

  <h1 className="text-center font-archivo font-bold lg:text-[25px] text-[18px]  py-2 lg:py-5">
    Categories
  </h1>

  <div
    className="flex gap-6 px-5 py-4 lg:justify-evenly overflow-x-auto scrollbar-hide"
    style={{ WebkitOverflowScrolling: "touch" }} 
  >
    {categories.map((cat) => {
      const isActive = cat.id === activeId;

      return (
        <div
          key={cat.id}
          onClick={() => handleCategoryClick(cat)}
          className={`flex-shrink-0 lg:w-[146px] lg:h-[222px] w-[72px] h-[85px] flex flex-col items-center justify-center border rounded-xl p-3 cursor-pointer transition-all duration-200 shadow-md ${
            isActive
              ? "bg-[#B4541F] text-white"
              : "bg-white border-[#B4541F] text-[#B4541F]"
          }`}
        >
          <img
            src={isActive ? cat.whiteImg : cat.brownImg}
            alt={cat.title}
            className="lg:w-[80px] w-[30px] mb-2 lg:mb-4"
          />
          <span className="text-center text-[14px] lg:text-[20px] font-figtree font-semibold">
            {cat.title}
          </span>
        </div>
      );
    })}
  </div>
</div>


  );
}
