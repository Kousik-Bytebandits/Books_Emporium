import { useState, useEffect } from "react";
import categories from "./categories";

export default function CategorySelector({ onBooksFetched }) {
  const [activeId, setActiveId] = useState();
  
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
        onBooksFetched(data); // optional: lift state to parent if needed
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } 
  };

  return (
    <div className=" bg-white mt-10 overflow-x-auto lg:w-[96%] mx-auto rounded-md "> 
      <h1 className="text-center font-figtree lg:text-[25px] text-[16px] font-semibold py-5">Categories</h1>

        <div className="flex gap-3 px-4 py-4 justify-evenly"> 
      {categories.map((cat) => {
        const isActive = cat.id === activeId;

        return (
          <div
            key={cat.id}
            onClick={() => handleCategoryClick(cat)}
            className={`lg:w-[146px] lg:h-[222px] w-[72px] h-[85px] flex flex-col items-center justify-center border rounded-xl p-3 cursor-pointer transition-all duration-200 shadow-md ${
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
            <span className="text-center text-[14px] lg:text-[20px] font-figtree font-semibold">{cat.title}</span>
          </div>
        );
      })}

      
    </div>
    </div>

  );
}
