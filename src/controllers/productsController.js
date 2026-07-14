const productModel = require('../models/productModel')

const mongoose = require('mongoose');

const ObjectId = mongoose.Types.ObjectId;

exports.createProducts = async (req, res) =>{
    try {
        const {
             images,
               sort_description,
               price,
               is_discount,
               discount_price,
               remark,
               stock,
               color,
               size,
               description,
           
               // Relationships (Relational Fields)
               category_id,
               brand_id
        } = req.body 
    
         if( discount_price > price){
             return res.status(200).json({success:false, message:'the discount price must be smaller price than main price'})
         }
        
       let data = await productModel.create({
         images,
               sort_description,
               price,
               is_discount,
               discount_price,
               remark,
               stock,
               color,
               size,
               description,
           
               // Relationships (Relational Fields)
               category_id,
               brand_id
       })

       res.status(200).json({
        success : true,
        message : 'product create successful',
        data,
       })


    } catch (error) {
          res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Something went wrong.",
    }); 
    }
}


// get all products
exports.allProduct = async (req, res) => {
    try {
        // ১. রিকোয়েস্ট প্যারামস থেকে ভ্যালু রিসিভ করা ও সংখ্যায় রূপান্তর
        let page_no = Number(req.params.page_no) || 1;
        let per_page = Number(req.params.per_page) || 10;
        let category_id = req.params.category_id;
        let brand_id = req.params.brand_id;
        let remark = req.params.remark;
        let keyword = req.params.keyword;

        // ২. পেজিনেশন এবং সর্টিং ম্যাথ বা হিসাব
        let skipRow = (page_no - 1) * per_page;
        let sortStage = { createdAt: -1 }; // নতুন প্রোডাক্ট আগে দেখাবে

        // ৩. ডাইনামিক ফিল্টারিং স্টেজ (MatchingStage) তৈরি করা
        let MatchingStage = {};

        if (category_id !== "0") {
            MatchingStage = { $match: { category_id: new ObjectId(category_id) } };
        } 
        else if (brand_id !== "0") {
            MatchingStage = { $match: { brand_id: new ObjectId(brand_id) } };
        } 
        else if (remark !== "0") {
            MatchingStage = { $match: { remark: remark } };
        } 
        else if (keyword !== "0") {
            // টাইটেল বা ডেসক্রিপশনের ভেতর পারশিয়াল সার্চ
            MatchingStage = { 
                $match: { 
                    $or: [
                        { title: { $regex: keyword, $options: "i" } },
                        { description: { $regex: keyword, $options: "i" } }
                    ] 
                } 
            };
        } 
        else {
            // যদি সবগুলো প্যারামিটার "0" হয়, তবে সব প্রোডাক্ট রিটার্ন করবে
            MatchingStage = { $match: {} };
        }

        // ৪. ক্যাটাগরি টেবিলের সাথে জয়েন করা ($lookup)
        let joinWithCategory = {
            $lookup: {
                from: "categories",       // ডাটাবেজের কালেকশনের আসল নাম
                localField: "category_id",
                foreignField: "_id",
                as: "category"
            }
        };

        // ৫. ফ্যাসেট স্টেজ ($facet) দিয়ে টোটাল কাউন্ট এবং পেজ ডেটা এক কুয়েরিতে আনা
        let facetStage = {
            $facet: {
                totalCount: [{ $count: "count" }],
                products: [
                    { $sort: sortStage },
                    { $skip: skipRow },
                    { $limit: per_page },
                    joinWithCategory,
                    { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } }, // অ্যারে ভেঙে অবজেক্ট করা
                    
                    // 🔥 নতুন স্ক্রিনশট (image_450ee5.png) অনুযায়ী যোগ করা প্রোজেকশন স্টেজ
                    {
                        $project: {
                            _id: 1,
                            category_id: 1,
                            brand_id: 1,
                            title: 1,
                            images: 1,
                            price: 1,
                            is_discount: 1,
                            discount_price: 1,
                            remark: 1,
                            stock: 1,
                            createdAt: 1,
                            "category.category_name": 1 // ক্যাটাগরি জয়েন টেবিল থেকে শুধু নাম ফিল্ডটি নেওয়া
                        }
                    }
                ]
            }
        };

        // 🚀 ৬. ডাটাবেজে ফাইনাল কুয়েরি রান করা
        let products = await productModel.aggregate([
            MatchingStage,
            facetStage
        ]);

        // ৭. ক্লায়েন্টকে রেসপন্স পাঠানো
        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            data: products[0] // ফ্যাসেটের কারণে রেজাল্ট প্রথম ইনডেক্সেই থাকবে
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.toString(),
            message: "Something went wrong.",
        });
    }
};



//single product 
exports.productDetails = async (req, res) => {
    try {
        // ১. রিকোয়েস্ট প্যারামস থেকে প্রোডাক্টের আইডি নিয়ে ওআইডি (ObjectId) তে রূপান্তর
        let id = new ObjectId(req.params.id);

        // ২. নির্দিষ্ট প্রোডাক্ট আইডি ম্যাচ করার স্টেজ
        let matchStage = {
            $match: { _id: id }
        };

        // ৩. ক্যাটাগরি কালেকশনের সাথে জয়েন ($lookup)
        let joinWithCategory = {
            $lookup: {
                from: "categories",       // ডাটাবেজের ক্যাটাগরি কালেকশনের আসল নাম
                localField: "category_id",
                foreignField: "_id",
                as: "category"
            }
        };

        // ৪. ব্র্যান্ড কালেকশনের সাথে জয়েন ($lookup)
        let joinWithBrand = {
            $lookup: {
                from: "brands",           // ডাটাবেজের ব্র্যান্ড কালেকশনের আসল নাম
                localField: "brand_id",
                foreignField: "_id",
                as: "brand"
            }
        };

        // ৫. জয়েন করা অ্যারেগুলোকে ভেঙে অবজেক্টে রূপান্তর করা ($unwind)
        // ফ্রন্টএন্ডে সহজে ব্যবহারের জন্য এগুলোকে সিঙ্গেল অবজেক্ট করা বেস্ট প্র্যাকটিস
        let unwindCategory = { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } };
        let unwindBrand = { $unwind: { path: "$brand", preserveNullAndEmptyArrays: true } };

        // ৬. ডাটাবেজে অ্যাগ্রিগেশন কুয়েরি রান করা
        let data = await productModel.aggregate([
            matchStage,
            joinWithCategory,
            joinWithBrand,
            unwindCategory,
            unwindBrand
        ]);

        // যদি এই আইডির কোনো প্রোডাক্ট খুঁজে পাওয়া না যায়
        if (data.length === 0) {
            return res.status(444).json({
                success: false,
                message: "Product not found."
            });
        }

        // ৭. ক্লায়েন্টকে রেসপন্স পাঠানো (যেহেতু একটি প্রোডাক্ট, তাই প্রথম ইনডেক্স data[0] পাঠানো হচ্ছে)
        res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            data: data[0]
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.toString(),
            message: "Something went wrong.",
        });
    }
};



//update-products
/**exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            images,
            sort_description,
            price,
            is_discount,
            discount_price,
            remark,
            stock,
            color,
            size,
            description,
            category_id,
            brand_id,
        } = req.body;

        if (discount_price > price) {
            return res.status(200).json({
                success: false,
                message: "The discount price must be smaller than the main price.",
            });
        }

        let data = await productModel.findByIdAndDelete(
    { id },
    {
        title,
        images,
        sort_description,
        price,
        is_discount,
        discount_price,
        remark,
        stock,
        color,
        size,
        description,
        category_id,
        brand_id,
    },
    { new: true }
);

res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data,
});
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.toString(),
            message: "Something went wrong.",
        });
    }
};**/


exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            images,
            sort_description,
            price,
            is_discount,
            discount_price,
            remark,
            stock,
            color,
            size,
            description,
            category_id,
            brand_id,
        } = req.body;

        // ডিসকাউন্ট প্রাইস মেইন প্রাইসের চেয়ে বড় কিনা তা চেক করা
        if (discount_price > price) {
            return res.status(200).json({
                success: false,
                message: "The discount price must be smaller than the main price.",
            });
        }

        // এখানে findByIdAndUpdate ব্যবহার করা হয়েছে এবং { id } এর বদলে শুধু id দেওয়া হয়েছে
        let data = await productModel.findByIdAndUpdate(
            id, 
            {
                title,
                images,
                sort_description,
                price,
                is_discount,
                discount_price,
                remark,
                stock,
                color,
                size,
                description,
                category_id,
                brand_id,
            },
            { new: true } // এর ফলে আপডেট হওয়া নতুন ডাটাটি 'data' ভ্যারিয়েবলে রিটার্ন আসবে
        );

        // যদি ডাটাবেজে এই আইডির কোনো প্রোডাক্ট না পাওয়া যায়
        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Product not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.toString(),
            message: "Something went wrong.",
        });
    }
};


//delete product
exports.deleteProduct = async(req, res) => {
    try {
      const { id } = req.params;

    let data = await productModel.findByIdAndDelete(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data,
    });

    } catch (error) {
         res.status(500).json({
            success: false,
            error: error.toString(),
            message: "Something went wrong.",
        });
    }
} 



