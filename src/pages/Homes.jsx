import { useEffect, useState } from "react";
import BannerCarousel from "./BannerCarousel";
import CategorySelector from "./categoriesSelector";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchBooks = async () => {
    try {
      const res = await fetch("https://booksemporium.in/Microservices/Prod/04_user_website/api/books");
      const data = await res.json();

      
      setBooks(Object.values(data).flat()) // now a flat list of products
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch books:", err);
      setLoading(false);
    }
  };

  fetchBooks();
}, []);

  const handleBooksByCategory = (fetchedBooks) => {
    setBooks(fetchedBooks);
  };

const sections = [
  { title: "Now Trending", products: books.trending || [] },
  { title: "Best Seller", products: books["best sellers"] || [] },
  { title: "New Arrivals", products: books["new arrivals"] || [] },
  { title: "International Bestseller", products: books["international bestsellers"] || [] },
];




  return (
    <div className="w-full pt-[30%] lg:pt-[8%] font-sans bg-[#F2E3D6]">
      <BannerCarousel />
    
    <CategorySelector onBooksFetched={handleBooksByCategory} />

      {/* Services */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:h-[160px] mt-10 md:px-20 bg-white shadow-around-soft py-6 rounded-md mx-4 md:mx-10">
        {[
          { icon: "Truck.png", title: "Free Delivery", desc: "Order over Rs 1000" },
          { icon: "security.png", title: "Secured Payment", desc: "100% Guarantee Security" },
          { icon: "Tag.png", title: "Best Deals", desc: "Upto 30% Discount" },
          { icon: "rotate.png", title: "Free Returns", desc: "Within 15 days" },
        ].map((item, i) => (
          <div key={i} className="p-2 gap-2 flex items-center mt-4 lg:mt-0">
            <img src={`images/${item.icon}`} className="w-[32px] lg:w-[48px] lg:mt-2" alt="img" />
            <div className="text-left text-[13px]">
              <p className="lg:text-[24px] font-semibold">{item.title}</p>
              <p className="lg:text-[18px] text-[10px] text-gray-500">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Product Sections */}
      {!loading &&
        sections.map((section, index) => (
          <div key={index} className="py-6">
            <div className="w-full bg-white px-4 md:px-10 py-6">
              <div className="flex justify-between items-center font-figtree mb-4">
                <h2 className="text-xl lg:text-[40px] font-semibold mb-4">{section.title}</h2>
                <button className="text-black lg:text-[24px] font-medium">See more</button>
              </div>

              <div className="overflow-x-auto hide-scrollbar lg:mt-16">
                <div className="flex gap-4">
                 {section.products.map((product, index) => (
  <div
     key={product.book_id || index}
    className="lg:w-[177px] lg:h-[272px] shadow-around-soft border p-3 rounded-md hover:shadow-lg transition flex-shrink-0"
  >
    <img
      src={product.image_url}
      alt={product.title}
      className="w-[102px] h-[157px] mx-auto object-contain mb-2 shadow-around-soft"
    />
    <p className="lg:text-[15px] font-figtree font-semibold leading-tight">{product.title}</p>
    <p className="lg:text-[12px] text-gray-500">By: {product.author}</p>
    <div className="flex items-center gap-2 mt-1">
      <p className="lg:text-[12px] font-bold text-black">₹{product.price}</p>
      <p className="lg:text-[12px] line-through text-gray-400">₹{product.oldprice}</p>
      <p className="lg:text-[12px] text-[#CA1D1D] font-medium">- {product.discount}%</p>
    </div>
  </div>
))}

                </div>
              </div>
            </div>

            {section.title === "Best Seller" && (
              <div className="w-full bg-[#FFB372] lg:h-[700px] mt-6 py-10 px-4 md:px-10">
                <div className="max-w-screen-2xl mx-auto flex flex-row items-center gap-4">
                  <img
                    src="images/offer.jpg"
                    alt="Promo"
                    className="w-[127px] lg:w-[70%] lg:h-[590px] rounded-md object-contain h-[143px]"
                  />
                  <div className="text-right w-full font-figtree">
                    <h3 className="text-[20px] lg:text-[64px] text-[#2C2C2C]">
                      One Of The <span className="text-black font-semibold">Popular</span><br />
                      Indian Used Book<br /> <span className="text-black font-semibold">Marketplace</span>
                    </h3>
                    <p className="text-[14px] lg:text-[36px] mt-2">
                      Unlock <span className="font-semibold">Extraordinary</span> Savings: Get<br />
                      Special<span className="font-semibold"> Discounts Upto 30%</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
    </div>
  );
}
