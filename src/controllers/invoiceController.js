const cartModel = require('../models/cartModel');
const productModel = require('../models/productModel');
const invoiceModel = require('../models/invoiceModel');
const invoiceProductModel = require('../models/invoiceProductModel');
const userModel = require('../models/userModel');
const mongoose = require('mongoose');
const { from } = require('form-data');
//const unwind = require('json2csv/transforms/unwind');
const axios = require('axios');
const { user } = require('./userController');
const ObjectId = mongoose.Types.ObjectId;
//let redirect_url = '/cart-thank-you'
const { Parser } = require("json2csv");
const { text } = require('express');






//!invoice create
exports.createInvoice = async(req, res) =>{
  try {
     
     let user_id = new ObjectId(req.headers._id) 
     let cus_email = req.headers.email


    //step1----------calculated total payble & vat-------------
    let matchstage = { $match : {user_id}};
    let JoinStageWithProduct = {
      $lookup : {
        from : 'products',
        localField : 'product_id',
        foreignField : '_id',
        as : 'product',
      },
    };

    let unwindStage = {$unwind : '$product'};

    let cartProducts = await cartModel.aggregate([
      matchstage, 
      JoinStageWithProduct, 
      unwindStage
    ]);

    if (cartProducts.length > 0) {
      let totalAmount = 0;
      cartProducts.forEach((item) => {
          let price; 
          if (item?.product?.is_discount === true) {
              price = parseFloat(item?.product?.discount_price); 
          } else {
              price = parseFloat(item?.product?.price); 
          }

          totalAmount = totalAmount + parseInt(item?.qty) * price;
      });

      // vat & shipping calculation
      let vat = totalAmount * 0.15;
      let shipping = 75;
      let totalPayable = totalAmount + vat + shipping;

      console.log("Total Payable Amount:", totalPayable);


      //step2-----------customar details & shipping details---------
      /**let user = await userModel.findById(user_id);

      console.log(user)

      if (
        [
          user.cus_add, user.cus_city, user.cus_country, user.cus_fax,
          user.cus_name, user.cus_phone, user.cus_postcode, user.cus_state,
          user.ship_add, user.ship_city, user.ship_country, user.ship_name,
          user.ship_phone, user.ship_postcode, user.ship_state,
        ].every((v) => v === undefined)
      ) {
        return res.status(200).json({
          success: false,
          message: "Please go dashboard & complete your profile information data!",
        });
      }
         
      let cus_details = [{
        Name : user?.cus_name,
        Email : user?.cus_email,
        Adress : user?.cus_add,
        Phone : user?.cus_phone
      }];

      //  নিচে ম্যাচ করানোর সুবিধার জন্য ভ্যারিয়েবলের নাম 'ship_details' রাখা হলো
      let ship_details = [{
        Name : user?.ship_name,
        City : user?.ship_city,
        Adress : user?.ship_add,
        Phone : user?.ship_phone
      }];


      // =========== Step-3: Transaction & other's ID =============
      let tran_id = "tra-" + Date.now() + Math.floor(Math.random() * 90000000);
      let val_id = "val-" + Date.now() + Math.floor(Math.random() * 90000000);


      // =========== Step-4: Create invoice =============
      let createInvoice = await invoiceModel.create({
        user_id: user_id,
        payable: parseFloat(totalPayable).toFixed(2),
        cus_details: cus_details,     
        ship_details: ship_details,   
        tran_id: tran_id,
        val_id: val_id,
        vat: vat,
        total: totalAmount,
        deliver_status: "pending", 
        payment_status: "pending"
      });



      //-----------step5 crate invoice product----------
      let invoice_id = createInvoice._id;


for (const item of cartProducts) {
  let currentPrice = item?.product?.is_discount === true
    ? item?.product?.discount_price
    : item?.product?.price;

  await invoiceProductModel.create({
    user_id: user_id,
    product_name: item?.product_name,
    product_id: item?.product_id,
    invoice_id: invoice_id,
    qty: item?.qty,
    price: currentPrice,
    color: item?.color,
    size: item?.size,
  });
}

      // STEP-6: STOCK REMOVE
// ==========================================
for (const item of cartProducts) {
  await productModel.updateOne(
    { _id: item.product_id },
    { $inc: { stock: -item.qty } }
  );
}


// ==========================================
// STEP-7: REMOVE CARTS
// ==========================================
await cartModel.deleteMany({ user_id: user_id });

                 
            // ==========================================
// STEP-8: PREPARE SSL PAYMENT
// ==========================================
let paymentSetting = {
  store_id: process.env.SSLCZ_STORE_ID,      
  store_passwd: process.env.SSLCZ_STORE_PASSWD, 
  currency: process.env.SSLCZ_CURRENCY,    
  success_url: process.env.SSLCZ_SUCCESS_URL,
  fail_url: process.env.SSLCZ_FAIL_URL,
  cancel_url: process.env.SSLCZ_CANCEL_URL,
  ipn_url: process.env.SSLCZ_IPN_URL,
  init_url: process.env.SSLCZ_INIT_URL,     
};



  // request param
  let form = new FormData()

form.append("store_id", paymentSetting.store_id);
form.append("store_passwd", paymentSetting.store_passwd);
form.append("total_amount", totalPayable.toString());
form.append("currency", paymentSetting.currency);
form.append("tran_id", tran_id);
form.append("success_url", `${paymentSetting.success_url}/${tran_id}`);
form.append("fail_url", `${paymentSetting.fail_url}/${tran_id}`);
form.append("cancel_url", `${paymentSetting.cancel_url}/${tran_id}`);
form.append("ipn_url", `${paymentSetting.ipn_url}/${tran_id}`);



  //  Customer Information
form.append("cus_name", user?.cus_name);
form.append("cus_email", cus_email);
form.append("cus_add1", user?.cus_add);
form.append("cus_add2", user?.cus_add);
form.append("cus_city", user?.cus_city);
form.append("cus_state", user?.cus_state);
form.append("cus_postcode", user?.cus_postcode);
form.append("cus_country", user?.cus_country);
form.append("cus_phone", user?.cus_phone);

//  Shipment Information
form.append("shipping_method", "YES");
form.append("ship_name", user?.ship_name);
form.append("ship_add1", user?.ship_add);
form.append("ship_add2", user?.ship_add);
form.append("ship_city", user?.ship_city);
form.append("ship_state", user?.ship_state);
form.append("ship_country", user?.ship_country);
form.append("ship_postcode", user?.ship_postcode);
form.append("ship_phone", user?.ship_phone);**/

//step2-----------customar details & shipping details---------
      let user = await userModel.findById(user_id);

     // console.log(user);

    
      let cus_details = [{
        Name : user?.cus_name || "Guest User",
        Email : cus_email || user?.cus_email || "customer@email.com",
        Adress : user?.cus_add || "Not Provided",
        Phone : user?.cus_phone || "01700000000"
      }];

      let ship_details = [{
        Name : user?.ship_name || user?.cus_name || "Guest User",
        City : user?.ship_city || "Dhaka",
        Adress : user?.ship_add || "Not Provided",
        Phone : user?.ship_phone || user?.cus_phone || "01700000000"
      }];


      // =========== Step-3: Transaction & other's ID =============
      let tran_id = "tra-" + Date.now() + Math.floor(Math.random() * 90000000);
      let val_id = "val-" + Date.now() + Math.floor(Math.random() * 90000000);


      // =========== Step-4: Create invoice =============
      let createInvoice = await invoiceModel.create({
        user_id: user_id,
        payable: parseFloat(totalPayable).toFixed(2),
        cus_details: cus_details,     
        ship_details: ship_details,   
        tran_id: tran_id,
        val_id: val_id,
        vat: vat,
        total: totalAmount,
        deliver_status: "pending", 
        payment_status: "pending"
      });


      //-----------step5 crate invoice product----------
      let invoice_id = createInvoice._id;

      for (const item of cartProducts) {
        let currentPrice = item?.product?.is_discount === true
          ? item?.product?.discount_price
          : item?.product?.price;

        await invoiceProductModel.create({
          user_id: user_id,
          product_name: item?.product_name || item?.product?.name || "Product",
          product_id: item?.product_id,
          invoice_id: invoice_id,
          qty: item?.qty,
          price: currentPrice,
          color: item?.color,
          size: item?.size,
        });
      }

      // STEP-6: STOCK REMOVE
      for (const item of cartProducts) {
        await productModel.updateOne(
          { _id: item.product_id },
          { $inc: { stock: -item.qty } }
        );
      } 

      // STEP-7: REMOVE CARTS
      await cartModel.deleteMany({ user_id: user_id });

                   
      // STEP-8: PREPARE SSL PAYMENT
      let paymentSetting = {
        store_id: process.env.SSLCZ_STORE_ID,      
        store_passwd: process.env.SSLCZ_STORE_PASSWD, 
        currency: process.env.SSLCZ_CURRENCY,    
        success_url: process.env.SSLCZ_SUCCESS_URL,
        fail_url: process.env.SSLCZ_FAIL_URL,
        cancel_url: process.env.SSLCZ_CANCEL_URL,
        ipn_url: process.env.SSLCZ_IPN_URL,
        init_url: process.env.SSLCZ_INIT_URL,     
      };

      // request param
      let form = new FormData();

      form.append("store_id", paymentSetting.store_id);
      form.append("store_passwd", paymentSetting.store_passwd);
      form.append("total_amount", totalPayable.toString());
      form.append("currency", paymentSetting.currency);
      form.append("tran_id", tran_id);
      form.append("success_url", `${paymentSetting.success_url}/${tran_id}`);
      form.append("fail_url", `${paymentSetting.fail_url}/${tran_id}`);
      form.append("cancel_url", `${paymentSetting.cancel_url}/${tran_id}`);
      form.append("ipn_url", `${paymentSetting.ipn_url}/${tran_id}`);


      //  Customer Information (ডাটাবেজ খালি থাকলেও যেন ক্র্যাশ না করে তার জন্য || দেওয়া হয়েছে)
      form.append("cus_name", user?.cus_name || "Guest User");
      form.append("cus_email", cus_email || user?.cus_email || "customer@email.com");
      form.append("cus_add1", user?.cus_add || "Not Provided");
      form.append("cus_add2", user?.cus_add || "Not Provided");
      form.append("cus_city", user?.cus_city || "Dhaka");
      form.append("cus_state", user?.cus_state || "Dhaka");
      form.append("cus_postcode", user?.cus_postcode || "1212");
      form.append("cus_country", user?.cus_country || "Bangladesh");
      form.append("cus_phone", user?.cus_phone || "01700000000");

      //  Shipment Information
      form.append("shipping_method", "YES");
      form.append("ship_name", user?.ship_name || user?.cus_name || "Guest User");
      form.append("ship_add1", user?.ship_add || "Not Provided");
      form.append("ship_add2", user?.ship_add || "Not Provided");
      form.append("ship_city", user?.ship_city || "Dhaka");
      form.append("ship_state", user?.ship_state || "Dhaka");
      form.append("ship_country", user?.ship_country || "Bangladesh");
      form.append("ship_postcode", user?.ship_postcode || "1212");
      form.append("ship_phone", user?.ship_phone || user?.cus_phone || "01700000000");

//  Product Information
form.append("product_name", "According Invoice");
form.append("product_category", "According Invoice");
form.append("product_profile", "According Invoice");
form.append("product_amount", "According Invoice");


let SSLres = await axios.post(paymentSetting.init_url, form)
 
  res.status(200).json({
    success: true,
    message : 'payment succussfully',
    data : SSLres.data
  })



      //  সফলভাবে ইনভয়েস মাস্টার তৈরি হওয়ার পর ক্লায়েন্টকে রেসপন্স পাঠানো
       return res.status(200).json({
        success: true,
       message: "Invoice created successfully!",
        data: createInvoice
        
      });
  
    } else {
       return res.status(200).json({
          success: false,
          message: "Cart empty!"
       });
    } 

  } catch (error) {
     return res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Something went wrong.",
    });
  }
}


// invoice create 
/**exports.createInvoice = async (req, res) => {
  try {
    let user_id = new ObjectId(req.headers._id);
    let cus_email = req.headers.email;

    // ==========================================
    // STEP-1: CALCULATE TOTAL PAYABLE & VAT
    // ==========================================
    let matchstage = { $match: { user_id } };
    let JoinStageWithProduct = {
      $lookup: {
        from: 'products',
        localField: 'product_id',
        foreignField: '_id',
        as: 'product',
      },
    };

    let unwindStage = { $unwind: '$product' };

    let cartProducts = await cartModel.aggregate([
      matchstage,
      JoinStageWithProduct,
      unwindStage
    ]);

    // কার্টে প্রোডাক্ট থাকলেই কেবল ইনভয়েস প্রসেস হবে
    if (cartProducts.length > 0) {
      let totalAmount = 0;
      cartProducts.forEach((item) => {
        let price;
        if (item?.product?.is_discount === true) {
          price = parseFloat(item?.product?.discount_price);
        } else {
          price = parseFloat(item?.product?.price);
        }
        totalAmount = totalAmount + parseInt(item?.qty) * price;
      });

      // ভ্যাট ১৫% ও শিপিং ৭৫ টাকা হিসাব
      let vat = totalAmount * 0.15;
      let shipping = 75;
      let totalPayable = totalAmount + vat + shipping;

      console.log("Total Payable Amount:", totalPayable);


      // ==========================================
      // STEP-2: CUSTOMER DETAILS & SHIPPING DETAILS
      // ==========================================
      let user = await userModel.findById(user_id);

      // প্রোফাইল ডাটা ফাঁকা/null/undefined থাকলে ড্যাশবোর্ডে পাঠানোর এরর মেসেজ
      if (!user || 
        [
          user?.cus_add, user?.cus_city, user?.cus_country, user?.cus_fax,
          user?.cus_name, user?.cus_phone, user?.cus_postcode, user?.cus_state,
          user?.ship_add, user?.ship_city, user?.ship_country, user?.ship_name,
          user?.ship_phone, user?.ship_postcode, user?.ship_state,
        ].every((v) => v === undefined || v === null || v === "")
      ) {
        return res.status(200).json({
          success: false,
          message: "Please go dashboard & complete your profile information data!",
        });
      }

      // স্পেলিং মিস্টেক ও বড় হাতের অক্ষর ফিক্স করে স্কিমা অনুযায়ী ছোট হাতের অক্ষরে অবজেক্ট তৈরি
      let cus_details = [{
        name: user?.cus_name || "Guest User",
        email: cus_email || user?.cus_email || "guest@gmail.com",
        address: user?.cus_add || "Dhaka, Bangladesh",
        phone: user?.cus_phone || "01700000000"
      }];

      let ship_details = [{
        name: user?.ship_name || "Guest Receiver",
        city: user?.ship_city || "Dhaka",
        address: user?.ship_add || "Dhaka, Bangladesh",
        phone: user?.ship_phone || "01700000000"
      }];


      // ==========================================
      // STEP-3: TRANSACTION & OTHER'S ID
      // ==========================================
      let tran_id = "tra-" + Date.now() + Math.floor(Math.random() * 90000000);
      let val_id = "val-" + Date.now() + Math.floor(Math.random() * 90000000);


      // ==========================================
      // STEP-4: CREATE INVOICE MASTER
      // ==========================================
      let createInvoice = await invoiceModel.create({
        user_id: user_id,
        payable: parseFloat(totalPayable).toFixed(2),
        cus_details: cus_details, 
        ship_details: ship_details, 
        tran_id: tran_id,
        val_id: val_id,
        vat: vat,
        total: totalAmount,
        deliver_status: "pending",
        payment_status: "pending"
      });


      // ==========================================
      // STEP-5: CREATE INVOICE PRODUCT
      // ==========================================
      let invoice_id = createInvoice._id;

      for (const item of cartProducts) {
        let currentPrice = item?.product?.is_discount === true
          ? item?.product?.discount_price
          : item?.product?.price;

        await invoiceProductModel.create({
          user_id: user_id,
          product_name: item?.product_name || item?.product?.title || "Product Name",
          product_id: item?.product_id,
          invoice_id: invoice_id,
          qty: item?.qty,
          price: currentPrice,
          color: item?.color || "N/A",
          size: item?.size || "N/A",
        });
      }


      // ==========================================
      // STEP-6: STOCK REMOVE FROM PRODUCT MODEL
      // ==========================================
      for (const item of cartProducts) {
        await productModel.updateOne(
          { _id: item.product_id },
          { $inc: { stock: -item.qty } }
        );
      }


      // ==========================================
      // STEP-7: REMOVE CARTS FOR THE USER
      // ==========================================
      await cartModel.deleteMany({ user_id: user_id });


      // ==========================================
      // STEP-8: PREPARE SSL PAYMENT (FORM DATA)
      // ==========================================
      let paymentSetting = {
        store_id: process.env.SSLCZ_STORE_ID,
        store_passwd: process.env.SSLCZ_STORE_PASSWD,
        currency: process.env.SSLCZ_CURRENCY,
        success_url: process.env.SSLCZ_SUCCESS_URL,
        fail_url: process.env.SSLCZ_FAIL_URL,
        cancel_url: process.env.SSLCZ_CANCEL_URL,
        ipn_url: process.env.SSLCZ_IPN_URL,
        init_url: process.env.SSLCZ_INIT_URL, 
      };

      // 'from' কি-ওয়ার্ড বাগ ফিক্স করে 'form' ভ্যারিয়েবল সেট করা হলো
      let form = new FormData();

      form.append("store_id", paymentSetting.store_id);
      form.append("store_passwd", paymentSetting.store_passwd);
      form.append("total_amount", totalPayable.toString());
      form.append("currency", paymentSetting.currency);
      form.append("tran_id", tran_id);
      form.append("success_url", `${paymentSetting.success_url}/${tran_id}`);
      form.append("fail_url", `${paymentSetting.fail_url}/${tran_id}`);
      form.append("cancel_url", `${paymentSetting.cancel_url}/${tran_id}`);
      form.append("ipn_url", `${paymentSetting.ipn_url}/${tran_id}`);

      // Customer Information
      form.append("cus_name", user?.cus_name || "N/A");
      form.append("cus_email", cus_email || "N/A");
      form.append("cus_add1", user?.cus_add || "N/A");
      form.append("cus_add2", user?.cus_add || "N/A");
      form.append("cus_city", user?.cus_city || "N/A");
      form.append("cus_state", user?.cus_state || "N/A");
      form.append("cus_postcode", user?.cus_postcode || "N/A");
      form.append("cus_country", user?.cus_country || "N/A");
      form.append("cus_phone", user?.cus_phone || "N/A");

      // Shipment Information
      form.append("shipping_method", "YES");
      form.append("ship_name", user?.ship_name || "N/A");
      form.append("ship_add1", user?.ship_add || "N/A");
      form.append("ship_add2", user?.ship_add || "N/A");
      form.append("ship_city", user?.ship_city || "N/A");
      form.append("ship_state", user?.ship_state || "N/A");
      form.append("ship_country", user?.ship_country || "N/A");
      form.append("ship_postcode", user?.ship_postcode || "N/A");
      form.append("ship_phone", user?.ship_phone || "N/A");

      // Product Information
      form.append("product_name", "According Invoice");
      form.append("product_category", "According Invoice");
      form.append("product_profile", "According Invoice");
      form.append("product_amount", "According Invoice");

      // SSLCommerz গেটওয়েতে রিকোয়েস্ট পাঠানো
      let SSLres = await axios.post(paymentSetting.init_url, form);

      // ডাবল রেসপন্স বাগ ফিক্স সিঙ্গেল রেসপন্স রিটার্ন
      return res.status(200).json({
        success: true,
        message: 'Payment updated successfully',
        data: SSLres.data
      });

   

    } else {
      // কার্ট খালি থাকলে সরাসরি এই রেসপন্স যাবে
      return res.status(200).json({
        success: false,
        message: "Cart empty!"
      });
    }

  } catch (error) {
    // যেকোনো ব্যাকএন্ড ক্র্যাশ বা ডাটাবেজ এরর ক্যাচ করবে
    return res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Something went wrong.",
    });
  }
};**/

 

//!read-all-invoice-single-user
exports.readAllInvoiceSingleUser = async(req, res) =>{
  try {
    //  হেডার থেকে ইউজারের আইডি নিয়ে ObjectId-তে কনভার্ট করা হচ্ছে
    let user_id = new ObjectId(req.headers._id);
    
    //  ইউআরএল প্যারামস থেকে পেজ নম্বর এবং প্রতি পেজে কয়টি ডাটা থাকবে তা নেওয়া হচ্ছে
    let page_no = Number(req.params.page_no);
    let per_page = Number(req.params.per_page);

    //  কত নম্বর রো (Row) থেকে ডাটা স্কিপ করতে হবে তার হিসাব
    let skipRow = (page_no - 1) * per_page;

    //  ফিল্টারিং স্টেজ (শুধু এই ইউজারের ইনভয়েস ম্যাচ করবে)
    let matchStage = {
      $match: {
        user_id: user_id,
      },
    };

    //  শর্টিং স্টেজ (লেটেস্ট ইনভয়েসগুলো সবার আগে দেখাবে)
    let sortStage = { createdAt: -1 };

    //  ফ্যাসেট স্টেজ (একই সাথে টোটাল কাউন্ট এবং পেজ অনুযায়ী ডাটা নিয়ে আসবে)
    let facetStage = {
      $facet: {
        totalCount: [{ $count: "count" }],
        data: [
          { $sort: sortStage },
          { $skip: skipRow },
          { $limit: per_page }
        ],
      },
    };

    //  ডাটাবেজে অ্যাগ্রিগেশন পাইপলাইন রান করা হচ্ছে
    let products = await invoiceModel.aggregate([matchStage, facetStage]);

    //  সফলভাবে ডাটা ক্লায়েন্টে পাঠানো হচ্ছে
    res.status(200).json({
      success: true,
      message: "Invoice fetched successfully",
      data: products[0],
    });

  } catch (error) {
    //  কোনো এরর হলে তা হ্যান্ডেল করা হচ্ছে
    res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Something went wrong.",
    });
  }
}


//!read single invoice-single-user
exports.readSingleInvoiceSingleUser = async (req, res) => {
  try {
    //  ইউআরএল প্যারামস থেকে নির্দিষ্ট ইনভয়েস আইডি নিয়ে ObjectId-তে কনভার্ট করা হচ্ছে
    let invoice_id = new ObjectId(req.params.invoice_id);

    //  ফিল্টারিং স্টেজ (শুধু এই নির্দিষ্ট ইনভয়েসটি ম্যাচ করবে)
    let matchStage = {
      $match: {
        _id: invoice_id,
      },
    };

    // প্রোডাক্ট টেবিলের সাথে জয়েন করার স্টেজ ($lookup)
    let joinStageWithInvoiceProduct = {
      $lookup: {
        from: "invoicesproducts",      // মঙ্গোডিবি কালেকশনের আসল নাম
        localField: "_id",            // ইনভয়েস টেবিলের প্রাইমারি কি (_id)
        foreignField: "invoice_id",   // প্রোডাক্ট টেবিলের ফরেন কি (invoice_id)
        as: "invoiceProducts",        // যে নামে আউটপুট অবজেক্টের ভেতর অ্যারে তৈরি হবে
      },
    };

    //  ডাটাবেজে অ্যাগ্রিগেশন পাইপলাইন রান করা হচ্ছে
    let data = await invoiceModel.aggregate([
      matchStage,
      joinStageWithInvoiceProduct,
    ]);

    // সফলভাবে ডাটা ক্লায়েন্টে পাঠানো হচ্ছে (অ্যারের প্রথম ডাটা data?[0])
    res.status(200).json({
      success: true,
      message: "Invoice fetched successfully",
      data: data?.[0],
    });

  } catch (error) {
    //  কোনো এরর হলে তা হ্যান্ডেল করা হচ্ছে
    res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Something went wrong.",
    });
  }
};




//!read invoice product list single user
exports.readInvoiceProductListSingleUser = async (req, res) => {
  try {
    //  হেডার থেকে ইউজারের আইডি নিয়ে ObjectId-তে কনভার্ট করা হচ্ছে
    let user_id = new ObjectId(req.headers._id);
    
    //  ইউআরএল প্যারামস থেকে পেজ নম্বর এবং পার-পেজ ডাটার সংখ্যা নেওয়া হচ্ছে
    let page_no = Number(req.params.page_no);
    let per_page = Number(req.params.per_page);

    //  পেজিনেশন স্কিপ রো ক্যালকুলেশন
    let skipRow = (page_no - 1) * per_page;

    //  ফিল্টারিং স্টেজ (ইউজারের আইডি ম্যাচ করা হচ্ছে)
    let matchStage = {
      $match: {
        user_id: user_id,
      },
    };

    //  শর্টিং স্টেজ (লেটেস্ট প্রোডাক্ট সবার আগে আসবে)
    let sortStage = { createdAt: -1 };

    //  প্রোডাক্টস (products) কালেকশনের সাথে জয়েন করার স্টেজ ($lookup)
    let joinStageWithProduct = {
      $lookup: {
        from: "products",          
        localField: "product_id",   
        foreignField: "_id",       
        as: "product",
      },
    };

    //  অ্যারে ভেঙে সিঙ্গেল অবজেক্টে রূপান্তর করার স্টেজ ($unwind)
    let unwindStage = { $unwind: "$product" };

    //  প্রজেকশন স্টেজ (প্রয়োজনীয় ফিল্ড ফিল্টার করার জন্য ফাঁকা রাখা হয়েছে)
    let projectionStage = {};

    // ফ্যাসেট স্টেজ (টোটাল কাউন্ট এবং পেজ অনুযায়ী প্রোডাক্ট ডাটা আলাদা করা)
    let facetStage = {
      $facet: {
        totalCount: [{ $count: "count" }],
        products: [
          { $sort: sortStage },
          { $skip: skipRow },
          { $limit: per_page },
          unwindStage
        ],
      },
    };

    //  ডাটাবেজে আপনার আসল কালেকশন (invoiceProductModel) এ পাইপলাইন রান করা হচ্ছে
    let products = await invoiceProductModel.aggregate([
      matchStage,
      joinStageWithProduct,
      facetStage,
    ]);

    //  সফলভাবে রেসপন্স পাঠানো হচ্ছে
    res.status(200).json({
      success: true,
      message: "Invoice products fetched successfully",
      data: products[0],
    });

  } catch (error) {
    //  কোনো এরর হলে তা হ্যান্ডেল করা হচ্ছে
    res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Something went wrong.",
    });
  }
};


//!payment-success
exports.paymentSuccess = async(req, res) =>{
  try {
    let tran_id = req.params.tran_id

    await invoiceModel.updateOne(
      {tran_id : tran_id},
      {payment_status : "success"}
    )
     let redirect_url = 'http://localhost:5003/cart-thank-you'
    res.redirect(redirect_url);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Something went wrong.",
    });
  }
  }


//!payment-delete
exports.paymentDelete = async(req, res) =>{
  try {
     let tran_id = req.params.tran_id

    await invoiceModel.updateOne(
      {tran_id : tran_id},
      {payment_status : "cancel"}
    )
     let redirect_url = 'http://localhost:5003/cart'
    res.redirect(redirect_url);
  } catch (error) {
     res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Something went wrong.",
    });
  }
}  


//!payment fail
exports.paymentFail = async (req, res) => {
  try {
    let tran_id = req.params.tran_id;

    // ১. ডাটাবেজে ইনভয়েসের পেমেন্ট স্ট্যাটাস 'fail' করা হচ্ছে
    await invoiceModel.updateOne(
      { tran_id: tran_id },
      { $set: { payment_status: "fail" } }
    );

    // ২.  ফ্রন্টঅ্যান্ড পোর্টে (5003) রিডাইরেক্ট করা হচ্ছে
    // পেমেন্ট ফেইল করলে আমরা কাস্টমারকে ফ্রন্টঅ্যান্ডের একটি ফেইলর বা কার্ট পেজে রিডাইরেক্ট করব
    let redirect_url = 'http://localhost:5003/payment-fail'; 
    
    res.redirect(redirect_url);

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Something went wrong.",
    });
  }
};


//!payment-ipn
exports.paymentIpn = async (req, res) => {
  try {
    let trx_id = req.params.trx_id; 

    //  SSLCommerz যখন IPN হিট করে, তখন বডিতে status পাঠায় (যেমন: "VALID" বা "VALIDATED")
    let status = req.body.status; 

    if (status === "VALID" || status === "VALIDATED") {
      //  ডাটাবেজে ইনভয়েসের পেমেন্ট স্ট্যাটাস 'success' করা হচ্ছে
      await invoiceModel.updateOne(
        { tran_id: trx_id },
        { $set: { payment_status: "success" } }
      );
      
      return res.status(200).json({
        success: true,
        message: "IPN Received. Payment status updated to success."
      });
    } else {
      // যদি পেমেন্ট ভ্যালিড না হয়
      await invoiceModel.updateOne(
        { tran_id: trx_id },
        { $set: { payment_status: "fail" } }
      );

      return res.status(200).json({
        success: false,
        message: "IPN Received but payment was not valid."
      });
    }

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Something went wrong.",
    });
  }
};


// ! All Order List by date filter & pagination
exports.allOrderList = async (req, res) => {
  try {
   
    const page_no = Number(req.params.page_no) || 1;
    const per_page = Number(req.params.per_page) || 10;
    const skipRow = (page_no - 1) * per_page;

    
    const { from, to } = req.query;

   
    const fromDate = from 
      ? new Date(`${from}T00:00:00.000Z`) 
      : new Date("1970-01-01T00:00:00.000Z");

   
    const toDate = to 
      ? new Date(`${to}T23:59:59.999Z`) 
      : new Date();

  
    const matchStage = {
      $match: {
        createdAt: {
          $gte: fromDate,
          $lte: toDate,
        }
      }
    };

   
    let joinStageWithProduct = {
      $lookup: {
        from: "invoicesproducts", 
        localField: "_id",
        foreignField: "invoice_id",
        as: "products",
      }
    };

  
    const facetStage = {
      $facet: {
        totalCount: [{ $count: "count" }],
        data: [                  
          joinStageWithProduct,      
          { $sort: { createdAt: -1 } }, 
          { $skip: skipRow },         
          { $limit: per_page }        
        ]
      }
    };
  
    const products = await invoiceModel.aggregate([
      matchStage,
      facetStage
    ]);

   
    return res.status(200).json({
      success: true,
      message: "Invoices fetched successfully",
      data: products[0] // $facet ব্যবহার করলে ডাটা অ্যারের ১ম ইনডেক্সে [0] থাকে
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
      error: error.toString(),
    });
  }
};



//export csv
/**exports.exportCSV = async(req, res) => {
  try {
    
    // ২. কোয়েরি থেকে ডেট ফিল্টার নেওয়া হচ্ছে 
    const { from, to } = req.query;

    // ৩. শুরুর তারিখ সেট করা (না থাকলে একদম শুরুর সময় 1970 সাল ধরা হবে)
    const fromDate = from 
      ? new Date(`${from}T00:00:00.000Z`) 
      : new Date("1970-01-01T00:00:00.000Z");

       // ৪. শেষের তারিখ সেট করা (না থাকলে বর্তমান সময় ধরা হবে)
    const toDate = to 
      ? new Date(`${to}T23:59:59.999Z`) 
      : new Date();

    // ৫. তারিখের কন্ডিশন ম্যাচ করানোর স্টেজ
    const matchStage = {
      $match: {
        createdAt: {
          $gte: fromDate,
          $lte: toDate,
        }
      }
    };

   

    //get invoice
 const data = await invoiceModel.find(matchStage).sort({ createdAt : - 1});

   //cloum from csv
    const fields = [
        "_id", 
        "user_id",
        "payble",
        "dalevary_status",
        "Payment_status", 
        "total",
        "vat",
        "createdAt",
    ];


    //convert csv
    const perser = new Parser ({fields})
    const csv = perser.parse(data)

    //send file
    res.headers('context-type', text/csv)
    res.attachment('invoices.csv')
    res.send(csv)
  } catch (error) {
    
    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
      error: error.toString(),
    });
  
};

}**/

// !export csv
exports.exportCSV = async (req, res) => {
  try {
    
    const { from, to } = req.query;

    
    const fromDate = from 
      ? new Date(`${from}T00:00:00.000Z`) 
      : new Date("1970-01-01T00:00:00.000Z");

  
    const toDate = to 
      ? new Date(`${to}T23:59:59.999Z`) 
      : new Date();

   
    const query = {
      createdAt: {
        $gte: fromDate,
        $lte: toDate,
      }
    };

    // get invoice ডেটা তুলে আনা
    const data = await invoiceModel.find(query).sort({ createdAt: -1 }).lean();

    // columns for csv
    const fields = [
        "_id", 
        "user_id",
        "payable", 
        "deliver_status", 
        "payment_status", 
        "total",
        "vat",
        "createdAt",
    ];

    // convert csv
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(data);

    // send file
    res.setHeader("Content-Type", "text/csv");
    res.attachment("invoices.csv");
    return res.status(200).send(csv);

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
      error: error.toString(),
    });
  }
};



//! invoice update
exports.updateInvoice = async (req, res) => {
  try {
    const { _id, user_id, deliver_status } = req.body;

    // Step 1: Find the invoice
    const checkInvoice = await invoiceModel.findById(_id);
    if (!checkInvoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found!",
      });
    }

    // Step 2: Prevent multiple updates
    if (checkInvoice.deliver_status === "delivered") {
      return res.status(200).json({
        success: false,
        message: "Product already delivered!",
      });
    }
    if (checkInvoice.deliver_status === "cancel") {
      return res.status(200).json({
        success: false,
        message: "Product already canceled!",
      });
    }

    // Step 3: Handle logic based on payment_status
    const paymentStatus = checkInvoice.payment_status;

    if (paymentStatus === "success") {
      // ✅ Payment successful: allow deliver or cancel

      if (deliver_status === "delivered") {
        // Update invoice as delivered
        const data = await invoiceModel.findByIdAndUpdate(
          { _id, user_id },
          { deliver_status },
          { new: true }
        );

        return res.status(200).json({
          success: true,
          message: "Product delivered successfully!",
          data,
        });
      }

      if (deliver_status === "cancel") {
        return res.status(200).json({
          success: false,
          message: "Payment is success. You can't cancel!",
        });
      }

      // Invalid deliver_status
      return res.status(200).json({
        success: false,
        message: "Invalid deliver status update!",
      });
    } else {
      // ❌ Payment not successful: allow only cancel
      if (deliver_status === "cancel") {
        const invoiceProducts = await invoiceProductModel.find({
          invoice_id: _id,
        });
        // Restock each product
        for (const item of invoiceProducts) {
          await productModel.updateOne(
            { _id: item.product_id },
            { $inc: { stock: item.qty } }
          );
        }

        // Update invoice as canceled

        const data = await invoiceModel.findByIdAndUpdate(
          { _id, user_id },
          { deliver_status },
          { new: true }
        );

        return res.status(200).json({
          success: true,
          message: "Unpaid order canceled and stock restored!",
          data,
        });
      }

      return res.status(200).json({
        success: false,
        message: "Cannot deliver because payment was not successful!",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong.",
      error: error.message,
    });
  }
};






