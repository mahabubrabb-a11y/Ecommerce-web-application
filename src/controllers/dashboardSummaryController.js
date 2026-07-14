const userModel = require("../models/userModel");
const productModel = require("../models/productModel");
const invoiceModel = require("../models/invoiceModel");
const reviewModel = require("../models/reviewModel");
const categoryModel = require("../models/categoryModel");
const brandModel = require("../models/brandModel");

exports.dashboardSummary = async (req, res) => {
  try {
    // Count documents
    const totalUsers = await userModel.countDocuments();
    const totalProducts = await productModel.countDocuments();
    const totalOrders = await invoiceModel.countDocuments();
    const totalReviews = await reviewModel.countDocuments();
    const totalCategories = await categoryModel.countDocuments();
    const totalBrands = await brandModel.countDocuments();

    // Filtered counts
    const pendingDeliver = await invoiceModel.countDocuments({
      deliver_status: "pending",
    });
    const deliveredOrders = await invoiceModel.countDocuments({
      deliver_status: "delivered",
    });
    const canceledOrders = await invoiceModel.countDocuments({
      deliver_status: "cancel",
    });

    // Total income from successful payments
    const totalIncomeAgg = await invoiceModel.aggregate([
      { $match: { payment_status: "success" } },
      { $group: { _id: null, total: { $sum: "$payable" } } },
    ]);
    const totalIncome = totalIncomeAgg.length > 0 ? totalIncomeAgg[0].total : 0;

    res.status(200).json({
      success: true,
      message: "Dashboard summary fetched successfully",
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalIncome,
        pendingDeliver,
        deliveredOrders,
        canceledOrders,
        totalReviews,
        totalCategories,
        totalBrands,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong.",
      error: error.message,
    });
  }
}; 