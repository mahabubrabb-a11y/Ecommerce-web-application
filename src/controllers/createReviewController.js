
const reviewModel = require('../models/reviewModel');

//create review
exports.CreateReview = async(req, res) =>{
    try {
        let user_id = req.headers._id;
        const { product_id, invoice_id, des, rating } = req.body;

        // ২. updateOne এবং upsert ব্যবহার করে ডাটা সেভ করা
        let data = await reviewModel.updateOne(
            { user_id, product_id, invoice_id }, // এই ফিল্টার দিয়ে খুঁজে দেখবে রিভিউ আগে আছে কি না
            { user_id, product_id, invoice_id, des, rating }, // নতুন ডাটা বা আপডেট ডাটা
            { upsert: true } // যদি না থাকে তবে তৈরি করবে, থাকলে আপডেট করবে
        );

        // ৩. সাকসেস রেসপন্স পাঠানো
        res.status(200).json({
            success: true,
            message: "Review created successfully",
            data
        });

    } catch (error) {
            res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Something went wrong.",
    }); 
    }
}


//all product

exports.allReview = async (req, res) => {
    try {
        // ১. পেজিনেশন প্যারামিটার সেট করা
        let page_no = Number(req.params.page_no) || 1;
        let per_page = Number(req.params.per_page) || 10;
        let skipRow = (page_no - 1) * per_page;
        
        // ২. সর্টিং স্টেজ (নতুন রিভিউ আগে দেখাবে)
        let sortStage = { $sort: { createdAt: -1 } };

        // ৩. ইউজার টেবিলের সাথে জয়েন করা (Join With User)
        let joinStageWithUser = {
            $lookup: {
                from: "users",         // ইউজার কালেকশনের নাম
                localField: "user_id", // রিভিউ মডেলে থাকা ইউজার আইডি
                foreignField: "_id",   // ইউজার মডেলে থাকা আইডি
                as: "user"             // যে নামে ডাটা আসবে
            }
        };

        // ৪. প্রোডাক্ট টেবিলের সাথে জয়েন করা (Join With Product)
        let joinStageWithProduct = {
            $lookup: {
                from: "products",         // প্রোডাক্ট কালেকশনের নাম
                localField: "product_id", // রিভিউ মডেলে থাকা প্রোডাক্ট আইডি
                foreignField: "_id",      // প্রোডাক্ট মডেলে থাকা আইডি
                as: "product"             // যে নামে ডাটা আসবে
            }
        };

        // ৫. আনওয়াইন্ড স্টেজ (অ্যারে থেকে অবজেক্টে রূপান্তর করা)
        let unwindStageUser = { $unwind: "$user" };
        let unwindStageProduct = { $unwind: "$product" };

        // ৬. প্রোজেকশন স্টেজ (ডাটাবেজ থেকে অপ্রয়োজনীয় ফিল্ড বাদ দেওয়া)
        let projectStage = {
            $project: {
                "user._id": 0,
                "user.password": 0,
                "product._id": 0,
                __v: 0
            }
        };

        // ৭. ফ্যাসেট স্টেজ (কাউন্ট এবং ডাটা একসাথে বের করা)
        let facetStage = {
            $facet: {
                totalCount: [{ $count: "count" }],
                data: [
                    sortStage,
                    { $skip: skipRow },
                    { $limit: per_page },
                    joinStageWithUser,
                    joinStageWithProduct,
                    unwindStageUser,
                    unwindStageProduct,
                    projectStage
                ]
            }
        };

        // ৮. ডাটাবেজে অ্যাগ্রিগেশন চালানো
        let result = await reviewModel.aggregate([facetStage]);

        // ৯. সাকসেস রেসপন্স পাঠানো
        res.status(200).json({
            success: true,
            message: "Review fetched successfully",
            data: result[0]
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.toString(),
            message: "Something went wrong."
        });
    }
};


//all-review by product

exports.reviewByProduct = async (req, res) => {
    try {
        // ১. ইউআরএল প্যারামস থেকে প্রোডাক্ট আইডি নেওয়া
        const { product_id } = req.params;
        
        // ২. মঙ্গোডিবি অবজেক্ট আইডি তে কনভার্ট করা (প্রয়োজন হতে পারে)
        const mongoose = require('mongoose');
        const ObjectId = mongoose.Types.ObjectId;

        // ৩. নির্দিষ্ট প্রোডাক্টের রিভিউ ফিল্টার করার স্টেজ
        let matchStage = { $match: { product_id: new ObjectId(product_id) } };

        // ৪. ইউজারের তথ্য জয়েন করা (Lookup)
        let joinWithUser = {
            $lookup: {
                from: "users",
                localField: "user_id",
                foreignField: "_id",
                as: "user"
            }
        };

        // ৫. আনওয়াইন্ড এবং প্রোজেকশন (ক্লিন ডাটা পাওয়ার জন্য)
        let unwindUser = { $unwind: "$user" };
        let projectStage = {
            $project: {
                "user.password": 0,
                "user.updatedAt": 0,
                "user.createdAt": 0,
                __v: 0
            }
        };

        // ৬. অ্যাগ্রিগেশন পাইপলাইন চালানো
        let data = await reviewModel.aggregate([
            matchStage,    // আগে ওই প্রোডাক্টের রিভিউগুলো আলাদা করবে
            joinWithUser,  // তারপর রিভিউ দাতা ইউজারের তথ্য আনবে
            unwindUser,    // অ্যারে থেকে অবজেক্ট করবে
            projectStage   // অপ্রয়োজনীয় ডাটা বাদ দিবে
        ]);

        // ৭. সাকসেস রেসপন্স
        res.status(200).json({
            success: true,
            message: "Reviews for this product fetched",
            data: data
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.toString(),
            message: "Something went wrong."
        });
    }
};



