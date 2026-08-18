import { Routes, Route } from 'react-router-dom';
import ProductPage from './pages/ProductPage';
import Layout from './components/Layout';
import Home from './pages/Home';
import RefundPolicy from './pages/RefundPolicy';
import ShippingPolicy from './pages/ShippingPolicy';
import StaticLayout from './components/StaticLayout';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import RingConfigure from './pages/RingConfigure';
import FooterLessLayout from './components/FooterLessLayout';
import Checkout from './pages/Checkout';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
      </Route>
      <Route element={<StaticLayout />}>
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/ring" element={<ProductPage />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/checkout" element={<Checkout />} />
      </Route>
      <Route element={<FooterLessLayout />}>
        <Route path="/ring-configure" element={<RingConfigure />} />
      </Route>
    </Routes>
  );
}

export default App;
