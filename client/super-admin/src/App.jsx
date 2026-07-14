import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "react-scroll-to-top";

import AllOrdersPage from './page/AllorderPage'
import AllProductPage from './page/AllproductPage'
import AllReviewPage from './page/AllReviewPage'
import BrandPage from './page/BrandPage'
import CategoryPage from './page/CategoryPage'
import CreateProductPage from './page/CreateProductPage'
import DashboardPage from './page/DeshBordPage'
import DashboardProfilePage from './page/DeshBordProfilePage'
import FileManagerPage from './page/FileManagerPage'
import LoginPage from './page/LoginPage'


function App() {
  return (
    <BrowserRouter basename="/super-admin">
   
      <ScrollToTop smooth color="#A847F0" />
      
      <Routes>
        { /* dashboard */}
         <Route exact path="/" element={<DashboardPage />} />
        <Route exact path="/profile" element={<DashboardProfilePage />} />
        <Route exact path="/create-product" element={<CreateProductPage />} />
        
        <Route exact path="/all-product" element={<AllProductPage />} />
        <Route exact path="/all-reviews" element={<AllReviewPage />} />
        <Route exact path="/category" element={<CategoryPage />} />
        <Route exact path="/brand" element={<BrandPage />} />
        <Route exact path="/all-orders" element={<AllOrdersPage />} />
        <Route exact path="/file-manager" element={<FileManagerPage />} />
        
        <Route exact path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App
