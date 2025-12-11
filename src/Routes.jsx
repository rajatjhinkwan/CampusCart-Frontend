import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import HomePage from "./pages/homepage";
import NotFound from "./pages/notFound.jsx";
import UserLogin from "./pages/user-login";
import UserSignup from "./pages/user-signup";
import SearchResults from "./pages/search-results";
import Messages from "./pages/messages";
import UserDashboard from "./pages/user-dashboard";
import UserDashboard1 from "./pages/user-dashboard1";
import UserProfile from "./pages/user-profile";
import Browse from "./pages/browse";
import ProductPage from "./pages/productPage";
import ErrorBoundary from "./components/ErrorBoundary"; // to be completed
import ScrollToTop from "./components/ScrollToTop"; // to be completed
import Testlocation from "./testlocation";
import Notifications from "./pages/notifications";
import MyListings from "./pages/mylistings";
import SettingsComp from "./pages/settings";
import SellItem from "./pages/sell-item";
import RoomPage from "./pages/roomPage"
import ServicePage from "./pages/services"
import JobsPage from "./pages/jobs"


import HowToBuy from "./pages/forUsers/HowToBuy";
import HowToSell from "./pages/forUsers/HowToSell";
import SafetyTips from "./pages/forUsers/SafetyTips";
import PricingGuide from "./pages/forUsers/PricingGuide";
import SuccessStories from "./pages/forUsers/SuccessStories";

import AboutUs from "./pages/company/AboutUs";
import Careers from "./pages/company/Careers";
import Press from "./pages/company/Press";
import Blog from "./pages/company/Blog";
import Contact from "./pages/company/Contact";

import HelpCenter from "./pages/support/HelpCenter";
import CommunityGuidelines from "./pages/support/CommunityGuidelines";
import PrivacyPolicy from "./pages/support/PrivacyPolicy";
import TermsOfService from "./pages/support/TermsOfService";
import CookiePolicy from "./pages/support/CookiePolicy";
// import Settings icon from lucide-react

import { Settings } from "lucide-react";
// In your router configuration (e.g., App.js or Routes.js)
import TestNotifications from './pages/TestNotifications';

// Add this to your routes
const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />

        <RouterRoutes>
          {/* Define your route here */}
          <Route path="/" element={<HomePage />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/user-login" element={<UserLogin />} />
          <Route path="/user-signup" element={<UserSignup />} />
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/user-messages" element={<Messages />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/user-dashboard1" element={<UserDashboard1 />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/productPage" element={<ProductPage />} />
          <Route path="/testlocation" element={<Testlocation />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/user-listings" element={<MyListings />} />
          <Route path="/settings" element={<SettingsComp />} />
          <Route path="/sell-item" element={<SellItem />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/test-notifications" element={<TestNotifications />} />
          <Route path="/rooms/:id" element={<RoomPage />} />
          <Route path="/services/:id" element={<ServicePage />} />
          <Route path="/jobs/:id" element={<JobsPage />} />


          <Route path="/how-to-buy" element={<HowToBuy />} />
          <Route path="/how-to-sell" element={<HowToSell />} />
          <Route path="/safety-tips" element={<SafetyTips />} />
          <Route path="/pricing-guide" element={<PricingGuide />} />
          <Route path="/success-stories" element={<SuccessStories />} />

          <Route path="/about" element={<AboutUs />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/press" element={<Press />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/help" element={<HelpCenter />} />
          <Route path="/community-guidelines" element={<CommunityGuidelines />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />

          <Route path="*" element={<NotFound />} />
        </RouterRoutes>

      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;