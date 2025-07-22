import React, { useState } from "react";

const slides = [
  {
    id: 1,
    title: "OWN STORIES THAT\nLIVED BEFORE",
    button: "SHOP NOW",
    bgGradient: "images/carousal2.png",
    books: "/images/book-left.png",
    imagePosition: "left",
    textAlign: "right",
  },
  {
    id: 2,
    title: "BUY PRE-LOVED\nBOOKS ONLINE",
    button: "SHOP NOW",
    bgGradient: "images/carousal1.png",
    books: "/images/book-right.png",
    imagePosition: "right",
    textAlign: "left",
  },
];

const BannerCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleDotClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className="w-[96%] mx-auto overflow-hidden rounded">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            style={{
              backgroundImage: `url(${slide.bgGradient})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            className="min-w-full h-[170px] md:h-[420px] relative px-4 lg:px-10 py-4 flex items-center text-white"
          >
            {slide.imagePosition === "left" && (
              <img
                src={slide.books}
                alt="book"
                className="w-[100px] md:w-[130px] xl:w-[340px] mr-4"
              />
            )}

            <div
              className={`flex flex-col flex-1 ${
                slide.textAlign === "right"
                  ? "items-end text-right"
                  : "items-start text-left"
              }`}
            >
              <h2 className="whitespace-pre-line font-bold text-[20px] md:text-[64px] leading-tight mb-3 lg:mb-6">
                {slide.title}
              </h2>
              <button className="bg-[#B4541F] text-white px-6 py-2 lg:py-6 lg:px-16 rounded-full text-sm md:text-[26px] font-semibold">
                {slide.button}
              </button>
            </div>

            {slide.imagePosition === "right" && (
              <img
                src={slide.books}
                alt="book"
                className="w-[100px] md:w-[130px] xl:w-[340px] ml-4"
              />
            )}

            {/* Dots inside the banner */}
            {index === activeIndex && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {slides.map((_, dotIndex) => (
                  <div
                    key={dotIndex}
                    onClick={() => handleDotClick(dotIndex)}
                    className={`w-2.5 h-2.5 rounded-full cursor-pointer ${
                      activeIndex === dotIndex
                        ? "bg-[#E86A33]"
                        : "bg-white/50"
                    }`}
                  ></div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;
