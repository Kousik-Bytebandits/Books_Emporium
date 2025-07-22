import {  Routes, Route } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import ForgotPasswordPopup from './pages/ForgotPasswordPopup';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ShopList from './pages/ShopList';
import { useLocation } from 'react-router-dom';
import Home from './pages/Homes';
export default function App() {
    const location = useLocation();
   const hideNavbarRoutes = ['/signin', '/signup', '/forgot'];
  return (
    <>
     {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <Routes>
        
        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot" element={<ForgotPasswordPopup/>}/>
       
        <Route path='/shop' element={<ShopList/>}/>
        <Route path='/' element={<Home/>}/>
        
       </Routes>
        {!hideNavbarRoutes.includes(location.pathname) && <Footer />}
    </>
  );
}
