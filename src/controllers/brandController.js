const brandModel = require('../models/brandModel')
const productModel = require('../models/productModel');

//! Brand Create Controller 
exports.createBrand = async (req, res) => {
    try {
        // ১. রিকোয়েস্ট বডি (req.body) থেকে ব্র্যান্ডের নাম এবং ইমেজ নেওয়া
        const { brand_name, brand_img } = req.body;

        // ২. মঙ্গুজ মডেল ব্যবহার করে ডাটাবেজে নতুন ব্র্যান্ড তৈরি করা
        let data = await brandModel.create({ brand_name, brand_img });

        // ৩. সাকসেস রেসপন্স পাঠানো
        res.status(200).json({
            success: true,
            message: "Brand created successfully",
            data,
        });

    } catch (error) {
        // ৪. কোনো এরর হলে ৫০০ ইন্টারনাল সার্ভার এরর রেসপন্স পাঠানো
        res.status(500).json({
            success: false,
            error: error.toString(),
            message: "Something went wrong."
        });
    }
};


//!all brand
exports.allBrand = async (req, res) => {
    try {
        // ১. রিকোয়েস্ট প্যারামস থেকে পেজ নম্বর এবং পার পেজ ডাটার সংখ্যা নেওয়া
        let page_no = Number(req.params.page_no) || 1;
        let per_page = Number(req.params.per_page) || 10;
        let skipRow = (page_no - 1) * per_page;
        let sortStage = { createdAt: -1 };

        // ২. প্রোডাক্ট টেবিল/কালেকশনের সাথে জয়েন করা (Lookup)
        let joinWithProduct = {
            $lookup: {
                from: "products",         // মঙ্গোডিবির প্রোডাক্ট কালেকশনের নাম
                localField: "_id",        // ব্র্যান্ডের নিজস্ব আইডি
                foreignField: "brand_id", // প্রোডাক্ট মডেলের ভেতরের ব্র্যান্ড আইডি
                as: "products"            // যে নামে ডাটা আউটপুট আসবে
            }
        };

        // ৩. ব্র্যান্ডের আন্ডারে মোট কয়টি প্রোডাক্ট আছে তা কাউন্ট করা
        const addProductCount = {
            $addFields: {
                totalProduct: { $size: "$products" }
            }
        };

        // ৪. ফ্যাসেট স্টেজ তৈরি করা (একসাথে টোটাল কাউন্ট ও পেজ ডাটা প্রসেস করার জন্য)
        let facetStage = {
            $facet: {
                totalCount: [{ $count: "count" }],
                brands: [
                    { $sort: sortStage },
                    { $skip: skipRow },
                    { $limit: per_page },
                    joinWithProduct,
                    addProductCount,
                    { 
                        $project: { 
                            __v: 0, 
                            updatedAt: 0, 
                            products: 0 // জয়েন করা এক্সট্রা প্রোডাক্টের ডিটেইলস হাইড রাখা
                        } 
                    }
                ]
            }
        };

        // ৫. ডাটাবেজে অ্যাগ্রিগেশন কোয়েরি চালানো
        let brands = await brandModel.aggregate([facetStage]);

        // ৬. সাকসেস রেসপন্স পাঠানো
        res.status(200).json({
            success: true,
            message: "Brands fetched successfully",
            data: brands[0], // ফ্যাসেটের আউটপুট অবজেক্টটি পাঠানো
        });

    } catch (error) {
        // ৭. এরর হ্যান্ডেল করা
        res.status(500).json({
            success: false,
            error: error.toString(),
            message: "Something went wrong."
        });
    }
};



// !Get Brand Single 
exports.singleBrand = async (req, res) => {
    try {
        // ১. রিকোয়েস্ট প্যারামিটার থেকে আইডি (id) নেওয়া
        const { id } = req.params;

        // ২. মঙ্গুজ মডেল ব্যবহার করে আইডি দিয়ে ডাটাবেজে সার্চ করা
        let data = await brandModel.findById(id);

        // ৩. সাকসেস রেসপন্স পাঠানো
        res.status(200).json({
            success: true,
            message: "Brand fetched successfully",
            data,
        });

    } catch (error) {
        // ৪. কোনো এরর হলে ৫০০ ইন্টারনাল সার্ভার এরর রেসপন্স পাঠানো
        res.status(500).json({
            success: false,
            error: error.toString(),
            message: "Something went wrong."
        });
    }
};


//! Brand update single 
exports.updateBrand = async (req, res) => {
    try {
        // ১. ইউআরএল থেকে আইডি এবং বডি থেকে নতুন ডাটা নেওয়া
        const { id } = req.params;
        const { brand_name, brand_img } = req.body;

        // ২. ডাটাবেজে আইডি খুঁজে আপডেট করা

        let data = await brandModel.findByIdAndUpdate(
            id,
            { brand_name, brand_img },
            { new: true }
        );

        // ৩. সাকসেস রেসপন্স পাঠানো
        res.status(200).json({
            success: true,
            message: "Brand updated successfully",
            data,
        });

    } catch (error) {
        // ৪. কোনো এরর হলে ৫০০ ইন্টারনাল সার্ভার এরর রেসপন্স পাঠানো
        res.status(500).json({
            success: false,
            error: error.toString(),
            message: "Something went wrong."
        });
    }
};



// !Brand delete single 
exports.deleteBrand = async (req, res) => {
    try {
        // ১. ইউআরএল প্যারামস থেকে ব্র্যান্ডের আইডি নেওয়া
        const { id } = req.params;

        // ২. চেক করা হচ্ছে এই ব্র্যান্ড আইডির আন্ডারে কোনো প্রোডাক্ট ডাটাবেজে আছে কি না
        let products = await productModel.find({ brand_id: id });
        
        // ৩. যদি প্রোডাক্ট থেকে থাকে, তবে ডিলিট করতে না দিয়ে অ্যালার্ট মেসেজ পাঠানো
        if (products.length > 0) {
            return res.status(200).json({
                success: false,
                message: "Please delete all products with this brand first."
            });
        }

        // ৪. কোনো প্রোডাক্ট না থাকলেই কেবল ডাটাবেজ থেকে ব্র্যান্ডটি ডিলিট হবে
        await brandModel.findByIdAndDelete(id);

        // ৫. সাকসেস রেসপন্স পাঠানো
        res.status(200).json({
            success: true,
            message: "Brand deleted successfully"
        });

    } catch (error) {
        // ৬. এরর হ্যান্ডেল করা
        res.status(500).json({
            success: false,
            error: error.toString(),
            message: "Something went wrong."
        });
    }
};