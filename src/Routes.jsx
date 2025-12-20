import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import HomePage from "./pages/homepage"; // Keep Home static for performance
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
import { useUserStore } from "./store/userStore";
import Skeleton from "./components/Skeleton";

// Lazy imports
const NotFound = lazy(() => import("./pages/notFound.jsx"));
const UserLogin = lazy(() => import("./pages/user-login"));
const UserSignup = lazy(() => import("./pages/user-signup"));
const ForgotPassword = lazy(() => import("./pages/forgot-password"));
const ResetPassword = lazy(() => import("./pages/reset-password"));
const SearchResults = lazy(() => import("./pages/search-results"));
const Messages = lazy(() => import("./pages/messages"));
const UserDashboard = lazy(() => import("./pages/user-dashboard"));
const UserDashboard1 = lazy(() => import("./pages/user-dashboard1"));
const UserProfile = lazy(() => import("./pages/user-profile"));
const PublicProfile = lazy(() => import("./pages/public-profile/index.jsx"));
const Browse = lazy(() => import("./pages/browse"));
const ProductPage = lazy(() => import("./pages/productPage"));
const Notifications = lazy(() => import("./pages/notifications"));
const MyListings = lazy(() => import("./pages/mylistings"));
const WishlistPage = lazy(() => import("./pages/wishlist"));
const SettingsComp = lazy(() => import("./pages/settings"));
const SellItem = lazy(() => import("./pages/sell-item"));
const RoomPage = lazy(() => import("./pages/roomPage"));
const ServicePage = lazy(() => import("./pages/services"));
const JobsPage = lazy(() => import("./pages/jobs"));
const Rides = lazy(() => import("./pages/rides"));
const AcceptRides = lazy(() => import("./pages/rides/AcceptRides"));
const LiveRide = lazy(() => import("./pages/rides/LiveRide"));
const PromotionsPage = lazy(() => import("./pages/promotions"));
const NotificationDetail = lazy(() => import("./pages/notifications/NotificationDetail.jsx"));
const AdminDashboard = lazy(() => import("./pages/admin-dashboard"));
const AdminUserProfile = lazy(() => import("./pages/admin-dashboard/UserProfile.jsx"));

// Requests Pages
const RequestsList = lazy(() => import("./pages/requests/index.jsx"));
const CreateRequest = lazy(() => import("./pages/requests/CreateRequest.jsx"));
const RequestDetails = lazy(() => import("./pages/requests/RequestDetails.jsx"));

// Static/Info pages lazy
const HowToBuy = lazy(() => import("./pages/forUsers/HowToBuy"));
const HowToSell = lazy(() => import("./pages/forUsers/HowToSell"));
const SafetyTips = lazy(() => import("./pages/forUsers/SafetyTips"));
const PricingGuide = lazy(() => import("./pages/forUsers/PricingGuide"));
const SuccessStories = lazy(() => import("./pages/forUsers/SuccessStories"));
const AboutUs = lazy(() => import("./pages/company/AboutUs"));
const Careers = lazy(() => import("./pages/company/Careers"));
const Press = lazy(() => import("./pages/company/Press"));
const Blog = lazy(() => import("./pages/company/Blog"));
const Contact = lazy(() => import("./pages/company/Contact"));
const HelpCenter = lazy(() => import("./pages/support/HelpCenter"));
const CommunityGuidelines = lazy(() => import("./pages/support/CommunityGuidelines"));
const PrivacyPolicy = lazy(() => import("./pages/support/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/support/TermsOfService"));
const CookiePolicy = lazy(() => import("./pages/support/CookiePolicy"));

// Test pages
const Testlocation = lazy(() => import("./testlocation"));
const TestNotifications = lazy(() => import("./pages/TestNotifications"));

const LoadingFallback = () => (
  <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
    <Skeleton width="100%" height="64px" style={{ marginBottom: '24px' }} />
    <div style={{ display: 'flex', gap: '24px' }}>
      <div style={{ width: '250px', display: window.innerWidth < 768 ? 'none' : 'block' }}>
        <Skeleton width="100%" height="400px" />
      </div>
      <div style={{ flex: 1 }}>
        <Skeleton width="100%" height="200px" style={{ marginBottom: '24px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
          <Skeleton width="100%" height="280px" />
          <Skeleton width="100%" height="280px" />
          <Skeleton width="100%" height="280px" />
          <Skeleton width="100%" height="280px" />
        </div>
      </div>
    </div>
  </div>
);

const Routes = () => {
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <Suspense fallback={<LoadingFallback />}>
          <RouterRoutes>
            <Route path="/" element={<HomePage />} />
            <Route path="/homepage" element={<HomePage />} />
            <Route path="/user-login" element={<UserLogin />} />
            <Route path="/user-signup" element={<UserSignup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/search-results" element={<SearchResults />} />
            <Route path="/user-messages" element={isAuthenticated ? <Messages /> : <UserLogin />} />
            <Route path="/user-dashboard" element={isAuthenticated ? <UserDashboard /> : <UserLogin />} />
            <Route path="/user-dashboard1" element={<UserDashboard1 />} />
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/profile/:userId" element={<PublicProfile />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/productPage" element={<ProductPage />} />
            <Route path="/testlocation" element={<Testlocation />} />
            <Route path="/notifications" element={isAuthenticated ? <Notifications /> : <UserLogin />} />
            <Route path="/user-listings" element={isAuthenticated ? <MyListings /> : <UserLogin />} />
            <Route path="/user-favorites" element={isAuthenticated ? <WishlistPage /> : <UserLogin />} />
            <Route path="/settings" element={isAuthenticated ? <SettingsComp /> : <UserLogin />} />
            <Route path="/sell-item" element={isAuthenticated ? <SellItem /> : <UserLogin />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/test-notifications" element={<TestNotifications />} />
            <Route path="/rooms/:id" element={<RoomPage />} />
            <Route path="/services/:id" element={<ServicePage />} />
            <Route path="/jobs/:id" element={<JobsPage />} />
            <Route path="/rides" element={<Rides />} />
            <Route path="/rides/accept" element={isAuthenticated ? <AcceptRides /> : <UserLogin />} />
            <Route path="/rides/live/:rideId" element={isAuthenticated ? <LiveRide /> : <UserLogin />} />
            <Route path="/promotions" element={<PromotionsPage />} />
            <Route path="/notifications/:id" element={<NotificationDetail />} />
            <Route path="/admin-dashboard" element={isAuthenticated ? <AdminDashboard /> : <UserLogin />} />
            <Route path="/admin/users/:id" element={isAuthenticated ? <AdminUserProfile /> : <UserLogin />} />

            {/* Request Routes */}
            <Route path="/requests" element={<RequestsList />} />
            <Route path="/requests/create" element={isAuthenticated ? <CreateRequest /> : <UserLogin />} />
            <Route path="/requests/:id" element={<RequestDetails />} />

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
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
