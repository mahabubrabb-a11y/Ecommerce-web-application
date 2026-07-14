const createCategory = require('../models/categoryModel')
const productModel = require('../models/productModel');

//create-category
exports.CreateCategory = async(req, res) =>{
   try {
      
      const {category_name, category_img} = req.body

      let categoryModel = await createCategory.create({category_name, category_img})
       
      res.status(200).json({
          success: true,
          message: "Category create successfully",
          categoryModel,
      })

   } catch (error) {
        res.status(500).json({ 
            success : false,
            error : error.toString(),
            Message : "some wrong",
        }); 
   } 
}


//all-category
exports.allCategory = async (req, res) => {
    try {
     
        let per_page = Number(req.params.per_page) || 10; 
        let page_no = Number(req.params.page_no) || 1;    

       
        let skipRow = (page_no - 1) * per_page;
        let sortStage = { createdAt: -1 }; 

      
        let joinWithProduct = {
            $lookup: {
                from: "products",       
                localField: "_id",        
                foreignField: "category_id", 
                as: "products"          
            }
        };


        const addProductCount = {
            $addFields: {
                totalProduct: { $size: "$products" } 
            }
        };


        let facetStage = {
            $facet: {
                totalCount: [{ $count: "count" }], 
                categories: [
                    { $sort: sortStage },
                    { $skip: skipRow },  
                    { $limit: per_page }, 
                    joinWithProduct,      
                    addProductCount,      
                    

                    {
                        $project: {
                            __v: 0,
                         
                            products: 0 
                        }
                    }
                ]
            }
        };

        let categories = await createCategory.aggregate([facetStage]);

   
        res.status(200).json({
            success: true,
            message: "Categories fetched successfully",
            data: categories[0] 
        });

    } catch (error) {
  
        res.status(500).json({
            success: false,
            error: error.toString(),
            message: "Something went wrong."
        });
    }
};


//single category
exports.singleCategory = async (req, res) => {
    try {
     
        const { id } = req.params;

       
        let data = await createCategory.findById(id); 

       
        res.status(200).json({
            success: true,
            message: "Category fetched successfully",
            data,
        });

    } catch (error) {
       
        res.status(500).json({
            success: false,
            error: error.toString(),
            message: "Something went wrong."
        });
    }
};


//Category update single 
exports.updateCategory = async (req, res) => {
    try {
      
        const { id } = req.params;
        const { category_name, category_img } = req.body;

       
       
        let data = await createCategory.findByIdAndUpdate(
            id,
            { category_name, category_img },
            { new: true }
        );

        
        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data,
        });

    } catch (error) {
       
        res.status(500).json({
            success: false,
            error: error.toString(),
            message: "Something went wrong."
        });
    }
};


//delete category

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // ১. ডাটাবেজে এই ক্যাটাগরির কোনো প্রোডাক্ট আছে কিনা চেক করা
        let products = await productModel.find({ category_id: id });
        if (products.length > 0) {
            return res.status(200).json({
                success: false,
                message: "Please delete all products with this category first."
            });
        }

        // ২. কোনো প্রোডাক্ট না থাকলেই কেবল ক্যাটাগরি ডিলিট হবে
        await createCategory.findByIdAndDelete(id); 

        res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.toString(),
            message: "Something went wrong."
        });
    }
};