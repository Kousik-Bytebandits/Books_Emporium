import { Link } from "react-router-dom";


export default function Footer() {
  return (
    <footer className="bg-[#111111] text-white px-4 md:px-6 py-12 font-sans">
      <div className="max-w-[90%] xxxl:max-w-[80%] mx-auto space-y-10">
        {/* Top Section */}
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
          {/* Left - Logo and Description */}
          <div className="lg:w-[25%] space-y-4">
            <div className="flex items-center ">
              <img src="/images/be-logo.png" alt="Logo" className="w-[50px] lg:w-14 lg:h-14 " />
              <div className="text-[18px] font-bold leading-tight font-sans xxxl:text-[20px] laptop:text-[18px] hd:text-[17px]">BOOKS <br/> EMPORIUM</div>
            </div>
            <p className="text-sm lg:text-[15px] text-gray-300 leading-relaxed font-figtree">
              We Believe In The Magic Of Reading Whether It's Escaping Into Fiction, Learning Something New,
              Or Passing A Story From One Hand To Another. Our Curated Collection Is Made For Every Kind Of
              Reader, Delivered Straight To Your Doorstep With Care.
            </p>
          </div>

          {/* Right - Footer Links */}
          <div className="flex flex-row justify-between lg:mt-[5.5%] lg:gap-6 lg:grid lg:grid-cols-4  text-sm">
            
              {/* Useful Links */}
            <div>
              <h3 className="font-semibold mb-3 text-[15px] xxxl:text-[20px] laptop:text-[14px] hd:text-[17px]">Useful Links</h3>
              <ul className="space-y-2 text-gray-300 xxxl:text-[16px] laptop:text-[12px] hd:text-[14px]">
                <li>About Us</li>
                <li><Link to="/contact">Contact Us</Link></li>
  <li><Link to="/bookcrate">Book Crate</Link></li>
              </ul>
            </div>

           {/* Help */}
            <div>
              <h3 className="font-semibold mb-3 text-[15px] xxxl:text-[20px] laptop:text-[14px] hd:text-[17px]">Help</h3>
              <ul className="space-y-2 text-gray-300 xxxl:text-[16px] laptop:text-[12px] hd:text-[14px]">
                 <li><Link to="/payment-policy">Payment</Link></li>
  <li><Link to="/shipping-policy">Shipping</Link></li>
  <li><Link to="/cancellation-policy">Return</Link></li>
                <li className="lg:hidden">FAQ</li> {/* Only mobile */}
              </ul>
            </div>

          

            {/* Policies */}
            <div>
              <h3 className="font-semibold mb-3 text-[15px] xxxl:text-[20px] laptop:text-[14px] hd:text-[17px]">Policies</h3>
              <ul className="space-y-2 text-gray-300 xxxl:text-[16px] laptop:text-[12px] hd:text-[14px]">
                 <li><Link to="/privacy-policy">Privacy Policy</Link></li>
  <li><Link to="/terms-and-conditions">Terms & Conditions</Link></li>
  <li><Link to="/copyright-policy">Copyright Policy</Link></li>
              </ul>
            </div>

            {/* Email: shown in grid on desktop, separate center on mobile */}
            <div className="hidden lg:block">
              <h3 className="font-semibold mb-3 xxxl:text-[20px] laptop:text-[14px] hd:text-[17px]">Reach us out</h3>
              <div className="flex items-center gap-2 text-gray-300">
              <img src="images/bookmail.png"/>
                <span className="xxxl:text-[16px] laptop:text-[12px] hd:text-[14px]">booksemporium@gmail.com</span>
              </div>
              
            </div>
          </div>
        </div>

        {/* Mobile only Email section */}
        <div className="lg:hidden text-center space-y-2 font-figtree">
          <h3 className="font-semibold text-[20px] ">Reach us out</h3>
          <div className="flex justify-center items-center gap-2 text-gray-300">
          <img src="/images/bookmail.png"/>
            <span>booksemporium@gmail.com</span>
          </div>
          
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-4 text-center text-sm text-gray-400">
          Copyright © 2025. Books Emporium. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
