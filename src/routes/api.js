const express = require('express')
const router = express.Router();

const adminController = require('../controllers/adminController');
const userController = require('../controllers/userController');
const authVarificationAdmin = require('../middlewares/authVarificationAdmin');
const authVarificationUser = require('../middlewares/authVarificationUser');

const productController = require('../controllers/productsController');

const categoryController = require('../controllers/CreateCategory')

const brandController = require('../controllers/brandController')

const reviewController = require('../controllers/createReviewController')
 
const cartController = require('../controllers/createCartController')

const invoiceController = require('../controllers/invoiceController')

const dashboardSummaryController = require("../controllers/dashboardSummaryController.js");

const fileController = require("../controllers/fileController.js")

const fileUpload = require("../middlewares/fileUplods.js")


//!super admin
router.post("/admin-register", adminController.register)

router.post("/admin-login", adminController.login)

router.get("/admin", authVarificationAdmin, adminController.admin)

router.get("/adminVerify", authVarificationAdmin, adminController.adminVerify)

router.get("/adminLogout", authVarificationAdmin, adminController.adminLogout)

router.put("/adminUpdate", authVarificationAdmin, adminController.adminUpdate)






//!super user
router.post("/user-register", userController.register)

router.post("/user-login", userController.login)

router.get("/user", authVarificationUser, userController.user)

router.get("/userVerify", authVarificationUser, userController.userVerify)

router.get("/userLogout", authVarificationUser, userController.userLogout)

router.put("/userUpdate", authVarificationUser, userController.userUpdate)






//!create-products
router.post("/create-product", authVarificationAdmin, productController.createProducts)


router.get(
    "/all-products/:category_id/:brand_id/:remark/:keyword/:per_page/:page_no", 
    productController.allProduct
);


router.get('/product-id/:id', productController.productDetails);

router.put('/product-update/:id', authVarificationAdmin, productController.updateProduct);

router.delete('/product-delete/:id', authVarificationAdmin, productController.deleteProduct)






//!createCategory
router.post("/create-category", authVarificationAdmin, categoryController.CreateCategory)

router.get("/all-category/:per_page/:per_no", categoryController.allCategory)

router.get('/singleCategory/:id', categoryController.singleCategory)

router.put("/update-category/:id", authVarificationAdmin, categoryController.updateCategory);

router.delete("/delete-category/:id", authVarificationAdmin, categoryController.deleteCategory);






// !brand controller 
router.post('/brandController', authVarificationAdmin, brandController.createBrand)

router.get("/all-brand/:page_no/:per_page", brandController.allBrand);

router.get("/single-brand/:id", brandController.singleBrand);

router.put("/update-brand/:id", authVarificationAdmin, brandController.updateBrand);

router.delete("/delete-brand/:id", authVarificationAdmin, brandController.deleteBrand);





// !create-review
router.post("/create-review", authVarificationUser, reviewController.CreateReview );

router.get("/all-review/:page_no/:per_page", authVarificationUser, reviewController.allReview);

router.get("/review-by-product/:product_id", reviewController.reviewByProduct);





//!create-cart
router.post('/create-cart', authVarificationUser, cartController.createCart)

router.get('/read-cart', authVarificationUser, cartController.readCart)

router.put("/update-cart/:cart_id",authVarificationUser, cartController.cartUpdate);

router.delete("/delete-cart/:cart_id",authVarificationUser, cartController.cartUpdate);




//!invoice-controller
router.post("/create-invoice", authVarificationUser, invoiceController.createInvoice);

router.get(
  '/read-all-invoice-single-user/:page_no/:per_page', 
  authVarificationUser, 
  invoiceController.readAllInvoiceSingleUser
);


router.get(
  '/read-single-invoice-single-user/:invoice_id', 
  authVarificationUser, 
  invoiceController.readSingleInvoiceSingleUser
);

router.get(
  '/read-invoice-product-list-single-user/:page_no/:per_page', 
  authVarificationUser, 
  invoiceController.readInvoiceProductListSingleUser
);


router.post('/payment-success/:trx_id', invoiceController.paymentSuccess)
router.post('/payment-cancel/:trx_id', invoiceController.paymentDelete)
router.post('/payment-fail/:tran_id', invoiceController.paymentFail);

router.post('/payment-ipn/:trx_id', invoiceController.paymentIpn);

router.get(
  "/all-order-list/:per_page/:page_no", 
  authVarificationAdmin, 
  invoiceController.allOrderList
);

router.get("/export-csv", authVarificationAdmin, invoiceController.exportCSV);


//! dashboard Summary
router.get("/dashboard-summary", dashboardSummaryController.dashboardSummary);


//! update invoice
router.put(
  "/update-invoice",
  authVarificationAdmin,
  invoiceController.updateInvoice
);


// ! File Uploads
router.post(
  "/file-upload",
 authVarificationAdmin,
  fileUpload,
  fileController.fileUpload
);
router.get("/all-file/:per_page/:page_no", fileController.allFile);
router.post("/file-remove", authVarificationAdmin, fileController.fileRemove);


module.exports = router    