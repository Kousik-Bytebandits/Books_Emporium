import { useState, useEffect,useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaMinus, FaPlus , FaChevronDown} from "react-icons/fa";

export default function ShopCart({handleOpenLogin}) {
  
  const selectRef = useRef();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
 const [cartTotal, setCartTotal] = useState(0);
const [subTotal, setSubTotal] = useState(0);
const [discount, setDiscount] = useState(0);
 
  const token = localStorage.getItem("accessToken");
  useEffect(() => {
    if (!token) {
      handleOpenLogin();
      return;
    }

    fetchCart();
  }, );

  const fetchCart = async () => {
    try {
      const response = await fetch("https://booksemporium.in/Microservices/Prod/05_cart/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch cart");

      const data = await response.json();
      
      setItems(data.items || []);
      setSubTotal(data.cart_items || 0); 
    setCartTotal(data.totalPrice || 0); 
    setDiscount(data.discount || 0);

    const totalQuantity = (data.items || []).reduce((acc, item) => acc + item.quantity, 0);
localStorage.setItem("cartCount", totalQuantity);
window.dispatchEvent(new Event("storage")); 

    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, );

 
  const handleUpdateQuantity = async (bookId, quantity) => {
    try {
      const response = await fetch("https://booksemporium.in/Microservices/Prod/05_cart/cart/items", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookId, quantity }),
      });

      if (!response.ok) throw new Error("Failed to update quantity");

      fetchCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

 
  const removeItem = async (bookId) => {
    try {
      const response = await fetch(
        `https://booksemporium.in/Microservices/Prod/05_cart/cart/items/${bookId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete item");

      fetchCart(); 
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };
    

   const handleCheckout = async () => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
  handleOpenLogin();
    return;
  }

  try {
    const response = await fetch(
      "https://booksemporium.in/Microservices/Prod/06_orders_and_payments/order/create",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source_type: "cart",
          payment_method: "online",
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.razorpayOrder) {
      alert("Failed to create order.");
      return;
    }

    const options = {
      key: "rzp_test_qQ40l1wBMtOxc0", 
      amount: data.razorpayOrder.amount,
      currency: "INR",
      name: "Books Emporium",
      description: "Cart Payment",
      order_id: data.razorpayOrder.id,
      handler: async function (response) {
        
        try {
          const verifyRes = await fetch(
            "https://booksemporium.in/Microservices/Prod/06_orders_and_payments/order/verify",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            }
          );

          if (!verifyRes.ok) {
            alert("Payment verification failed");
            return;
          }

          const verifyData = await verifyRes.json();
          alert("Payment successful!");
          navigate("/"); 
          console.log(verifyData);
        } catch (err) {
          console.error("Verification failed:", err);
          alert("Error verifying payment.");
        }
      },
      theme: {
        color: "#121212",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    console.error("Checkout failed:", err);
    alert("Something went wrong during checkout.");
  }
};

  return (
    <>
      <div className="max-w-[100%]  lg:bg-background  pt-[35%] lg:pt-[6%] mx-auto py-8 font-archivon">
        <h2 className="xxxl:text-[50px]  font-archivo font-semibold uppercase text-center laptop:text-[35px] hd:text-[40px]  pt-4 font-tenor  text-[20px]">
          Shopping Cart
        </h2>
      <p className="xxxl:text-[25px] font-archivo tracking-wide  text-center laptop:text-[20px] hd:text-[20px] lg:mb-10  font-tenor  text-[14px]">Get books — shipped to your door</p>
        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[35px]">Your cart is empty.</p>
          </div>
        ) : (
          <>
            {/*  Desktop View */}
            <div className="hidden lg:flex gap-6 mb-20 xxxl:max-w-[80%] mx-auto laptop:max-w-[90%] ">
             <div className="w-full bg-white shadow-around-soft rounded-xl p-6 font-archivo">
  {items.map((item) => (
    <div
      key={item.book_id}
      className="flex justify-between py-6 items-center border-b-2 border-dashed border-[#B7B7B7] last:border-none"
    >
      {/* Product Image + Details */}
      <div className="flex items-center gap-6 xxxl:w-[70%] laptop:w-[50%] hd:w-[45%]">
        <img src={item.image_url} alt={item.title} className="xxxl:w-[85px] xxxl:h-[130px] laptop:w-[88px] laptop:h-[110px] hd:w-[100px] hd:h-[120px] object-contain" />
        <div className="space-y-2">
          <p className="text-[18px] xxxl:text-[24px] laptop:text-[20px] hd:text-[22px] font-semibold uppercase text-[#202020]">
            {item.title}
          </p>
          <p className="text-[#A0A0A0] text-[16px]">By:{item.author} </p>
          <div className=" text-[20px] font-semibold  ">
        <div className="flex  items-center  gap-4">
          <span className="text-[#FF1010]">- {item.discount} %</span>
          <div className="flex items-center gap-4">
            <span className="line-through text-[#A3A3A3] text-[20px]">₹{item.old_price}</span>
            <span className="text-black text-[20px]">₹{item.price}</span>
          </div>
        </div>
      </div>
        </div>
      </div>

     
     

      {/* Quantity + Delete */}
      <div className="flex items-center  w-[35%] justify-evenly">
         {item && (
  <div className="relative inline-flex items-center border border-black rounded-md bg-[#FFF7F0] px-3 py-2 w-[220px] my-4">
    {/* Label + Current Quantity */}
    <span className="text-sm text-black mr-2">
      Select Quantity:
      
    </span>

    {/* Dropdown */}
    <div className="relative ml-auto">
      <select
        ref={selectRef}
        value={item.quantity}
        onChange={(e) =>
          handleUpdateQuantity(item.book_id, Number(e.target.value))
        }
        className="appearance-none bg-transparent text-black text-right pr-6 cursor-pointer"
      >
        {Array.from({
          length: Math.min(
            (item.quantity || 0) + (item.stock_left || 0),
            20
          ),
        }, (_, i) => i + 1).map((opt, i) => (
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

      {/* Dropdown Icon */}
      <div className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-black">
        <FaChevronDown size={12} />
      </div>
    </div>
  </div>
)}

        <button
          onClick={() => removeItem(item.book_id)}
          className="bg-[#BE0000] w-[35%] text-white  py-2 text-[16px] font-semibold rounded-full"
        >
          Delete
        </button>
      </div>
    </div>
  ))}
</div>


              {/* ✅ Right Sidebar */}
               {items.length > 0 && (
              <div className="w-[35%] space-y-6">
                <div className="bg-[#EFEFEF] rounded-lg shadow-around-soft px-6 pt-6">
                  <h3 className="text-[24px] border-b border-[#A3A3A3] pb-6 mb-6">
                    Order Summary
                  </h3>

                  <div className="space-y-6">
                    <div className="flex justify-between text-[18px] text-[#5E5C5C]">
                      <span>Cart Items</span>
                      <span className="font-semibold">
                        ₹ {subTotal.toFixed(2)} INR
                      </span>
                    </div>
                    <div className="flex justify-between text-[18px] text-[#5E5C5C]">
                      <span>Discount</span>
                      <span className="text-[#FF6565] font-semibold">
                        - {discount} %
                      </span>
                    </div>
                    <div className="flex justify-between text-[18px] text-[#5E5C5C]">
                      <span>Delivery Charges</span>
                      <span className="line-through font-semibold">
                        ₹ 80 INR
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#E8E8E8] rounded-b-lg -mx-6 mt-8">
                    <div className="flex justify-between px-6 pt-5 pb-2 font-semibold text-[20px]">
                      <span>Total:</span>
                      <span>₹ {cartTotal.toFixed(2)} INR</span>
                    </div>
                    <p className="flex justify-end px-6 text-[#929292] text-[10px] pb-4">
                      Free Shipping
                    </p>
                  
                    <button
                  onClick={handleCheckout}
                  className="w-[80%] mx-10 bg-[#111111] xxxl:text-[26px] laptop:text-[16px] hd:text-[18px] text-white font-tenor xxxl:py-4 laptop:py-2 hd:py-3 rounded-lg mb-8 mt-4"
                >
                  Proceed to checkout
                </button>
                </div>
                </div>

              

               
      </div> )}
      </div>
           

            {/* ✅ Mobile View */}
            <div className="lg:hidden ">
              <div className="max-w-md mx-auto bg-white rounded-lg p-4">
                {items.map((item,index) => (
                  <div
                    key={index}
                    className="border-b-2 mt-8 ...987\l
                    border-dashed border-[#D1D1D1] pb-4 relative"
                  >
                  
                    <div className="flex gap-4">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-[117px] h-[155px] "
                      />
                      <div className="flex flex-col justify-between py-2 w-full">
                        <div>
                          <h3 className="font-medium text-[18px] leading-tight tracking-wider">
                            {item.title}
                          </h3>
                          <p className="text-[14px] text-[#AEAEAE]">
                            By:{item.author}
                          </p>
                        </div>
                        
                         <div className="flex items-center gap-3">
        <p className="text-[20px] text-[#FF1010] ">- {item.discount} %</p>
        <p className="line-through text-[#AEAEAE] text-[20px]"> ₹{item.old_price}</p>
        <p className="text-[24px] font-bold">₹{item.price}</p>
      </div>
                        <div className="flex justify-start gap-4 items-center mt-2">
                         
                         <div className="shadow-around-soft flex items-center gap-1 border border-[#D5D5D5] rounded-full h-[34px]">
                <button
                  className="px-3"
                  onClick={() =>
                      item.quantity > 1 &&
                     handleUpdateQuantity(item.book_id, item.quantity - 1)
                    }
                >
                  <FaMinus size={16}/>
                </button>
                <span className="text-[#4C4B4B] text-[20px] ">{item.quantity}</span>
                <div className="px-3 items-center flex">
                  <button onClick={() =>
                     handleUpdateQuantity(item.book_id, item.quantity + 1)
                    }><FaPlus className=" " size={16}/></button>
                </div>
              </div>
              <div>
                <button  onClick={() => removeItem(item.book_id)} className="rounded-full bg-[#BE0000] text-white px-8 py-1.5">Delete</button>
                </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="sticky bottom-0 bg-white p-4 rounded-lg shadow-xl mt-4 space-y-2 pb-4">
                <div className="flex justify-between text-[14px] text-[#5E5C5C]">
                  <span>Cart Items</span>
                  <span className="font-semibold text-[16px]">
                    ₹ {subTotal.toFixed(2)} INR
                  </span>
                </div>
                <div className="flex justify-between text-[14px] text-[#5E5C5C]">
                  <span>Discount</span>
                  <span className="text-[#FF6565] font-semibold text-[16px]">
                    - {discount} %
                  </span>
                </div>
                <div className="flex justify-between text-[14px] text-[#5E5C5C]">
                  <span>Delivery Charges</span>
                  <span className="line-through font-semibold text-[16px]">
                    ₹ 80 INR
                  </span>
                </div>
                <div className="flex justify-between font-semibold tracking-wide text-[18px]">
                  <span>Total:</span>
                  <span>₹ {cartTotal.toFixed(2)} INR</span>
                </div>
                <p className="flex justify-end text-[#929292] text-[11px]">
                  Free Shipping
                </p>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#111111] font-tenor text-[18px] text-white py-3 mt-2 rounded-lg"
                >
                  Proceed to checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    
    </>
  );
}
