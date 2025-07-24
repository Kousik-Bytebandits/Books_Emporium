import {  Routes, Route } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import ForgotPasswordPopup from './pages/ForgotPasswordPopup';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ShopList from './pages/ShopList';
import { useLocation } from 'react-router-dom';
import ProductDetails from './pages/ProductDetails';
import Home from './pages/Homes';
import ScrollToTop from './components/ScrollToTop';
import ShopCart from './pages/ShopCart';
export default function App() {
    const location = useLocation();
   const hideNavbarRoutes = ['/signin', '/signup', '/forgot'];
  return (
    <>
    <ScrollToTop/>
     {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <Routes>
        
        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot" element={<ForgotPasswordPopup/>}/>
        <Route path='/productdetails/:id' element={<ProductDetails/>}/>
        <Route path='/shop' element={<ShopList/>}/>
        <Route path='/' element={<Home/>}/>
        <Route path='/shopcart' element={<ShopCart/>}/>
        
       </Routes>
        {!hideNavbarRoutes.includes(location.pathname) && <Footer />}
    </>
  );
}
