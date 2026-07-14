import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "react-scroll-to-top";
import RouteScrollToTop from "../src/helper/RouteScrollTo Top";
import AllProductPage from "../src/page/AllProductPage";
import CartPage from "../src/page/CartPage";
import CartPersonalPage from "../src/page/CartPersonalPage";
import CartThankYouPage from "../src/page/CartThankYouPage";
import ContactPage from "../src/page/ContactPage";
import DashboardProfilePage from "../src/page/DashboardProfilePage";
import HomePage from "../src/page/HomePage";
import LoginPage from "../src/page/LoginPage";
import OrdersPage from "../src/page/OrdersPage";
import ProductDetailsPage from "../src/page/ProductDetailsPage";
import RegisterPage from "../src/page/RegisterPage";
import ReviewPage from "../src/page/ReviewPage";
import PrivateRoute from "../src/layout/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <RouteScrollToTop />
      <ScrollToTop smooth color='#A847F0' />
      <Routes>
        <Route exact path='/' element={<HomePage />} />
        {/* all-products/:category_id/:brand_id/:remark/:keyword/:per_page/:page_no */}
        <Route exact path='/all-products' element={<AllProductPage />} />
        <Route exact path='/product-details' element={<ProductDetailsPage />} />
        <Route exact path='/contact' element={<ContactPage />} />

        <Route exact path='/register' element={<RegisterPage />} />
        <Route exact path='/login' element={<LoginPage />} />
        <Route
          exact
          path='/cart'
          element={
            <PrivateRoute>
              <CartPage />
            </PrivateRoute>
          }
        />
        <Route
          exact
          path='/cart-personal'
          element={
            <PrivateRoute>
              <CartPersonalPage />
            </PrivateRoute>
          }
        />
        <Route
          exact
          path='/cart-thank-you'
          element={
            <PrivateRoute>
              <CartThankYouPage />
            </PrivateRoute>
          }
        />

        {/* dashboard */}
        <Route
          exact
          path='/dashboard-profile'
          element={
            <PrivateRoute>
              <DashboardProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          exact
          path='/dashboard-all-orders'
          element={
            <PrivateRoute>
              <OrdersPage />
            </PrivateRoute>
          }
        />
        <Route
          exact
          path='/dashboard-review'
          element={
            <PrivateRoute>
              <ReviewPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
