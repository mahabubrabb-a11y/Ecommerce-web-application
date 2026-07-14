const cartModel = require('../models/cartModel');
const productModel = require('../models/productModel');

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

//create-cart
exports.createCart = async (req, res) => {
    try {
        // ১. হেডার থেকে ইউজার আইডি এবং বডি থেকে কার্টের ডাটা নেওয়া
        let user_id = req.headers._id;
        const { product_id, product_name, color, qty, size } = req.body;

        // ২. প্রোডাক্টের স্টক চেক করার জন্য প্রোডাক্ট খুঁজে বের করা
        let product = await productModel.findById(product_id);

        // ৩. এই ইউজারের কার্টে এই প্রোডাক্টটি অলরেডি আছে কি না তা দেখা
        let existingCart = await cartModel.findOne({
            user_id,
            product_id,
            product_name,
            color,
            size
        });

        // কন্ডিশন ১: প্রোডাক্টটি যদি অলরেডি কার্টে থাকে (Existing Product)
        if (!!existingCart === true) {
            
            // নতুন অবজেক্ট বডি তৈরি করা এবং কোয়ান্টিটি যোগ করা
            let newReqBody = {
                user_id,
                product_id,
                product_name,
                color,
                size,
                qty: parseInt(existingCart.qty) + parseInt(qty)
            };

            // ডাটাবেজের এই প্রোডাক্টের টোটাল কত কোয়ান্টিটি কার্টে আছে তা বের করা
            const carts = await cartModel.find({ product_id }).select("qty");
            const totalQty = carts.reduce((sum, item) => sum + parseInt(item.qty || 0), 0);

            //  স্টক টাইপ ফিক্সসহ চেক (parseInt)
            if (parseInt(product?.stock || 0) < (totalQty + parseInt(qty))) {
                return res.status(200).json({
                    success: false,
                    message: "You have added all the products in stock."
                });
            }

            // স্টক ঠিক থাকলে কার্টের ডাটা আপডেট করা
            const updateData = await cartModel.updateOne(
                {
                    _id: existingCart._id,
                    user_id: existingCart.user_id
                },
                { $set: newReqBody }
            );

            return res.status(200).json({
                success: true,
                message: "Cart update.",
                updateData
            });

        } 
        //  কন্ডিশন ২: প্রোডাক্টটি যদি কার্টে একদম নতুন হয় (New Product)
        else {
            // ডাটাবেজের এই প্রোডাক্টের টোটাল কত কোয়ান্টিটি কার্টে আছে তা বের করা
            const carts = await cartModel.find({ product_id }).select("qty");
            const totalQty = carts.reduce((sum, item) => sum + parseInt(item.qty || 0), 0);

            //  স্টক টাইপ ফিক্সসহ চেক (parseInt)
            if (parseInt(product?.stock || 0) < (totalQty + parseInt(qty))) {
                return res.status(200).json({
                    success: false,
                    message: "You have added all the products in stock."
                });
            }

            // নতুন কার্ট আইটেম তৈরি করা
            const data = await cartModel.create({
                user_id,
                product_id,
                product_name,
                color,
                qty: parseInt(qty),
                size
            });

            return res.status(200).json({
                success: true,
                message: "Product add to cart successfully",
                data
            });
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.toString(),
            message: "Something went wrong."
        });
    }
};


//read-card
exports.readCart = async (req, res) => {
    try {
        let user_id = new ObjectId(req.headers._id);
        let matchStage = { $match: { user_id: user_id } };

        let joinWithProduct = {
            $lookup: {
                from: "products",
                localField: "product_id",
                foreignField: "_id",
                as: "product"
            }
        };
        // যদি প্রোডাক্ট না-ও মেলে, তাও ডাটা ড্রপ হবে না
        let unwindProductStage = { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } };

        let joinWithBrand = {
            $lookup: {
                from: "brands",
                localField: "product.brand_id",
                foreignField: "_id",
                as: "brand"
            }
        };
        //  যদি ব্র্যান্ড ডাটাবেজে না থাকে, তাও কার্টের লিস্ট দেখাবে
        let unwindBrandStage = { $unwind: { path: "$brand", preserveNullAndEmptyArrays: true } };

        let joinWithCategory = {
            $lookup: {
                from: "categories",
                localField: "product.category_id",
                foreignField: "_id",
                as: "category"
            }
        };
        //  যদি ক্যাটাগরি ফোল্ডারে মিল না পাওয়া যায়, তাও ডাটা ভ্যানিশ হবে না
        let unwindCategoryStage = { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } };

        let projectionStage = {
            $project: {
                _id: 1,
                user_id: 0,
                "product._id": 0,
                "product.category_id": 0,
                "product.brand_id": 0,
                "product.createdAt": 0,
                "product.updatedAt": 0,
                "product.description": 0,
                "brand._id": 0,
                "brand.createdAt": 0,
                "brand.updatedAt": 0,
                "category._id": 0,
                "category.createdAt": 0,
                "category.updatedAt": 0,
                category_id: 0,
                brand_id: 0,
                createdAt: 0,
                updatedAt: 0
            }
        };

        // সম্পূর্ণ পাইপলাইন দিয়ে ডাটা খোঁজা
        let data = await cartModel.aggregate([
            matchStage,
            joinWithProduct,
            unwindProductStage,
            joinWithBrand,
            unwindBrandStage,
            joinWithCategory,
            unwindCategoryStage,
            projectionStage
        ]);

        return res.status(200).json({
            success: true,
            message: "Cart list fetch successfully.",
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


//update-cart
exports.cartUpdate = async (req, res) =>{
    try {
      
      const { product_id, qty, inc } = req.body;

        let user_id = req.headers._id;
        let cart_id = new ObjectId(req.params.cart_id);
        let initQTY = 1;

        if (inc) {
            //  ১. প্লাস (+) বাটনের কাজ: দোকানে আসল স্টক কত আছে চেক করা
            let product = await productModel.findById(product_id);
            const carts = await cartModel.find({ product_id }).select("qty");
            const totalQty = carts.reduce((sum, item) => sum + item.qty, 0);

            // স্টকের সাথে তুলনা করা
            if (product?.stock >= totalQty + initQTY) {
                const data = await cartModel.updateOne(
                    { _id: cart_id, user_id: user_id },
                    { $set: { user_id, product_id, qty } }
                );

                return res.status(200).json({
                    success: true,
                    message: "Cart update successfully. inc +",
                    data
                });
            } else {
                // স্টক শেষ হয়ে গেলে এরর রেসপন্স
                return res.status(200).json({
                    success: false,
                    message: "You have added all the products in stock."
                });
            }

        } else {
            // ২. মাইনাস (-) বাটনের কাজ: কোনো চেক ছাড়াই সরাসরি কোয়ান্টিটি কমিয়ে দেওয়া
            const data = await cartModel.updateOne(
                { _id: cart_id, user_id: user_id },
                { $set: { user_id, product_id, qty } }
            );

            return res.status(200).json({
                success: true,
                message: "Cart update successfully. inc -",
                data
            });
        }

    } catch (error) {
          res.status(500).json({
            success: false,
            error: error.toString(),
            message: "Something went wrong."
        });
    }
}


//delete-cart
exports.removeCartList = async (req, res) => {
    try {
        let user_id = req.headers._id;
        let cart_id = new ObjectId(req.params.cart_id);

        // ডাটাবেজ থেকে ওই ইউজারের নির্দিষ্ট কার্ট আইটেমটি ডিলিট করা
        let data = await cartModel.deleteOne({ _id: cart_id, user_id: user_id });

        // যদি কার্ট আইটেমটি খুঁজে না পাওয়া যায় বা অলরেডি ডিলিট হয়ে থাকে
        if (data.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found or already deleted."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Cart item removed successfully.",
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
















/**const cartModel = require('../models/cartModel');
const productModel = require('../models/productModel');

exports.createCart = async (req, res) => {
    try {
        // ১. হেডার থেকে ইউজার আইডি এবং বডি থেকে কার্টের ডাটা নেওয়া
        let user_id = req.headers._id;
        const { product_id, product_name, color, qty, size } = req.body;

        // ২. প্রোডাক্টের স্টক চেক করার জন্য প্রোডাক্ট খুঁজে বের করা
        let product = await productModel.findById(product_id);

        // ৩. এই ইউজারের কার্টে এই প্রোডাক্টটি অলরেডি আছে কি না তা দেখা
        let existingCart = await cartModel.findOne({
            user_id,
            product_id,
            product_name,
            color,
            size
        });

        // কন্ডিশন ১: প্রোডাক্টটি যদি অলরেডি কার্টে থাকে (Existing Product)
        if (!!existingCart === true) {
            
            // নতুন অবজেক্ট বডি তৈরি করা এবং কোয়ান্টিটি যোগ করা
            let newReqBody = {
                user_id,
                product_id,
                product_name,
                color,
                size,
                qty: parseInt(existingCart.qty) + parseInt(qty)
            };

            // ডাটাবেজের এই প্রোডাক্টের টোটাল কত কোয়ান্টিটি কার্টে আছে তা বের করা
            const carts = await cartModel.find({ product_id }).select("qty");
            const totalQty = carts.reduce((sum, item) => sum + item.qty, 0);

            // যদি কার্টের টোটাল কোয়ান্টিটি এবং নতুন রিকোয়েস্টের কোয়ান্টিটি স্টকের চেয়ে বেশি হয়
            if (product?.stock < (totalQty + qty)) {
                return res.status(200).json({
                    success: false,
                    message: "You have added all the products in stock."
                });
            }

            // স্টক ঠিক থাকলে কার্টের ডাটা আপডেট করা
            const updateData = await cartModel.updateOne(
                {
                    _id: existingCart._id,
                    user_id: existingCart.user_id
                },
                { $set: newReqBody }
            );

            return res.status(200).json({
                success: true,
                message: "Cart update.",
                updateData
            });

        } 
        //  কন্ডিশন ২: প্রোডাক্টটি যদি কার্টে একদম নতুন হয় (New Product)
        else {
            // ডাটাবেজের এই প্রোডাক্টের টোটাল কত কোয়ান্টিটি কার্টে আছে তা বের করা
            const carts = await cartModel.find({ product_id }).select("qty");
            const totalQty = carts.reduce((sum, item) => sum + item.qty, 0);

            // স্টক চেক করা
            if (product?.stock < (totalQty + qty)) {
                return res.status(200).json({
                    success: false,
                    message: "You have added all the products in stock."
                });
            }

            // নতুন কার্ট আইটেম তৈরি করা
            const data = await cartModel.create({
                user_id,
                product_id,
                product_name,
                color,
                qty,
                size
            });

            return res.status(200).json({
                success: true,
                message: "Product add to cart successfully",
                data
            });
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.toString(),
            message: "Something went wrong."
        });
    }
};**/