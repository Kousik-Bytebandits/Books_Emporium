import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Loader from './components/Loader';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import ForgotPasswordPopup from './pages/ForgotPasswordPopup';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ShopList from './pages/ShopList';
import ProductDetails from './pages/ProductDetails';
import Home from './pages/Homes';
import ScrollToTop from './components/ScrollToTop';
import ShopCart from './pages/ShopCart';
import BookCrate from './pages/BookCrate';
import Contact from './pages/Contact';
import ShippingDeliveryPolicy from './pages/ShippingDeliveryPolicy';
import CancellationRefundPolicy from "./pages/CancellationRefundPolicy";
import PaymentPolicy from "./pages/PaymentPolicy";
import CopyrightPolicy from "./pages/CopyrightPolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";


export default function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

const handleOpenLogin = () => {
  setShowLogin(true);
  setShowSignup(false);
  setShowForgot(false);
};
const handleOpenSignup = () => {
  setShowSignup(true);
  setShowLogin(false);
  setShowForgot(false);
};
const handleOpenForgot = () => {
  setShowForgot(true);
  setShowLogin(false);
  setShowSignup(false);
};

// Close all
const handleCloseAllPopups = () => {
  setShowLogin(false);
  setShowSignup(false);
  setShowForgot(false);
};

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timeout);
  }, [location]);

  // Show login popup once on home page
  useEffect(() => {
    if (location.pathname === '/' && !localStorage.getItem('loginPopupShown')) {
      const timer = setTimeout(() => {
        setShowLogin(true);
        localStorage.setItem('loginPopupShown', 'true');
      }, 5000); 
      return () => clearTimeout(timer);
    }
  }, [location]);

  return (
    <>
      <ScrollToTop />

      <Navbar handleOpenLogin={handleOpenLogin} />

      {loading && <Loader />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<ShopList />} />
        <Route path="/productdetails/:id" element={<ProductDetails />} />
        <Route path="/shopcart" element={<ShopCart handleOpenLogin={handleOpenLogin} />} />
        <Route path="/bookcrate" element={<BookCrate  handleOpenLogin={handleOpenLogin}  handleOpenSignup={handleOpenSignup}  handleOpenForgot={handleOpenForgot} />}  />
        <Route path="/contact" element={<Contact />} />
         <Route path="/shipping-policy" element={<ShippingDeliveryPolicy />} />
      <Route path="/cancellation-policy" element={<CancellationRefundPolicy />} />
      <Route path="/payment-policy" element={<PaymentPolicy />} />
      <Route path="/copyright-policy" element={<CopyrightPolicy />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      </Routes>

      <Footer />

      {/* Modals */}
      {showLogin && (
        <div className="fixed inset-0 z-50 bg-black hide-scrollbar overflow-y-auto bg-opacity-40 flex justify-center items-center">
           <Login
    onClose={handleCloseAllPopups}
    onOpenSignup={handleOpenSignup}
    onOpenForgot={handleOpenForgot}
  />
        </div>
      )}

      {showSignup && (
        <div className="fixed inset-0 z-50 bg-black hide-scrollbar overflow-y-auto bg-opacity-40 flex justify-center items-center">
           <SignUp
    onClose={handleCloseAllPopups}
    onOpenLogin={handleOpenLogin}
  />
        </div>
      )}

      {showForgot && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 hide-scrollbar flex justify-center items-center overflow-y-auto">
          <ForgotPasswordPopup
    onClose={handleCloseAllPopups}
    onOpenLogin={handleOpenLogin}
  />
        </div>
      )}
    </>
  );
}
