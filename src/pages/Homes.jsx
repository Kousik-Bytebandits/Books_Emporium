import { useEffect, useState } from "react";
import BannerCarousel from "./BannerCarousel";
import CategorySelector from "./categoriesSelector";
import { useNavigate } from "react-router-dom";
export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  
useEffect(() => {
  const fetchBooks = async () => {
    try {
      const res = await fetch("https://booksemporium.in/Microservices/Prod/04_user_website/api/books");
      const data = await res.json();

      
      setBooks(data ) 
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


const navigate = useNavigate();
  const handleNavigate =()=>{
    navigate('/shop');
  }

  return (
    <div className="w-full  pt-[30%] lg:pt-[8%] font-sans bg-[#F2E3D6]">
      <BannerCarousel />
    
    <CategorySelector onBooksFetched={handleBooksByCategory} />

      {/* Services */}
      <div className="xxxl:w-[80%] h-[160px] xxxl:mx-auto grid grid-cols-2 md:grid-cols-4 lg:h-[160px] mt-10 md:px-20 bg-white shadow-around-soft lg:py-6 rounded-md mx-4 md:mx-10">
        {[
          { icon: "Truck.png", title: "Free Delivery", desc: "Order over Rs 1000" },
          { icon: "security.png", title: "Secured Payment", desc: "100% Guarantee Security" },
          { icon: "Tag.png", title: "Best Deals", desc: "Upto 30% Discount" },
          { icon: "rotate.png", title: "Free Returns", desc: "Within 15 days" },
        ].map((item, i) => (
          <div key={i} className="p-2 gap-2 flex items-center gap-4 lg:mx-auto mt-4 lg:mt-0">
            <img src={`images/${item.icon}`} className="w-[32px] lg:w-[48px] lg:mt-2" alt="img" />
            <div className="text-left text-[14px]">
              <p className="xxxl:text-[24px] hd:text-[20px] laptop:text-[18px] font-semibold">{item.title}</p>
              <p className="xxxl:text-[18px] hd:text-[16px] laptop:text-[14px] text-[11px] text-gray-500">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Product Sections */}
      {!loading &&
        sections.map((section, index) => (
          <div key={index} className="py-4">
            <div className="w-full xxxl:max-w-[80%] mx-auto bg-white lg:bg-transparent px-4 md:px-10 xxxl:px-0 py-6">
              <div className=" flex justify-between items-center font-figtree mb-4">
                <h2 className="text-xl lg:text-[40px] font-semibold mb-4">{section.title}</h2>
                <button 
                onClick={handleNavigate}
                className="text-black lg:text-[24px] font-medium -mt-2   border-b-2 border-black ">See more</button>
              </div>

              <div className="overflow-x-auto  hide-scrollbar lg:mt-16">
                <div className="flex gap-4">
                 {section.products.map((product, index) => (
  <div
  key={product.book_id || index}
  className="lg:w-[177px] lg:h-[272px] w-[132px] h-[222px]  shadow-around-soft border bg-white lg:p-3 p-1  rounded-md hover:shadow-lg transition flex-shrink- flex flex-col justify-between"
>
  <img
    src={product.image_url}
    alt={product.title}
    className="lg:w-[102px] lg:h-[157px] w-[87px] h-[125px] mx-auto object-contain mb-2 shadow-around-soft"
  />

  <div className="flex-grow flex flex-col justify-start">
    <p className="lg:text-[15px] text-[11px] font-semibold line-clamp-2 min-h-[32px] lg:min-h-[42px]">
      {product.title}
    </p>
    <p className="lg:text-[12px] text-[8px] text-gray-500 min-h-[18px]">
      By: {product.author}
    </p>

    <div className="flex items-center gap-1 lg:gap-2 lg:mt-1">
      <p className="lg:text-[12px] text-[10px] font-bold text-black">₹{product.price}</p>
      <p className="lg:text-[12px] text-[9px] line-through text-gray-400">₹{product.oldprice}</p>
      <p className="lg:text-[12px] text-[9px] text-[#CA1D1D] font-medium">-{product.discount}%</p>
    </div>
  </div>
</div>

))}

                </div>
              </div>
            </div>

            {section.title === "Best Seller" && (
              <div className="w-full bg-[#FFB372] lg:h-[700px] mt-6 py-10 px-4 md:px-10">
                <div className="max-w-screen-2xl mx-auto rounded-xl flex flex-row items-center gap-4">
                  <img
                    src="images/offer.jpg"
                    alt="Promo"
                    className="w-[127px] lg:w-[525px] lg:h-[590px] rounded-2xl  object-contain h-[143px]"
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
