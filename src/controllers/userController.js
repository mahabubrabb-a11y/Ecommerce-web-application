const userModel = require('../models/userModel')
const {EncodeToken} = require('../utility/tokeHelper')
const bcrypt = require('bcrypt'); 


let options = {
  maxAge: process.env.Cookie_Expire_Time,
  httpOnly: false,
  sameSite: "lax",
  secure: false,
};




// Create user
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ১. ডাটাবেজে এই ইমেইল আগে থেকেই আছে কিনা চেক করা
    let ifUser = await userModel.find({ email });
    if (ifUser.length > 0) {
      return res.status(200).json({
        success: false,
        message: "Email already registered.",
      });
    }

    // ২. ইমেইলটি নতুন হলে ডাটাবেজে অ্যাকাউন্ট তৈরি করা
    let user = await userModel.create({ email, password });
    
    res.status(200).json({
      success: true,
      message: "Registration successfully.",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Something went wrong.",
    });
  }
};






//user login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(200)
        .json({ success: false, message: "Invalid email or password" });
    }

    // isMatch password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(200)
        .json({ success: false, message: "Invalid email or password" });
    }

    if (isMatch) {
      let token = EncodeToken(user.email, user._id.toString());

      // Set cookie
      res.cookie("u_token", token, options);

      return res.status(200).json({
        success: true,
        message: "Login successful",
        user: {
          id: user._id,
          email: user.email,
        },
        token: token,
      });
    }
  } catch (error) {
    return res.status(200).json({
      success: false,
      error: error.toString(),
      message: "Something went wrong.",
    });
  }
};





//user
exports.user = async (req, res) => {
  try {
    // ১. মিডলওয়্যার থেকে পাঠানো ইমেইল হেডার থেকে রিসিভ করা
    let email = req.headers.email;

    // ২. মঙ্গোডিবি অ্যাগ্রিগেশন পাইপলাইনের স্টেজগুলো তৈরি করা
    let matchStage = {
      $match: { email: email },
    };

    let project = {
      $project: {
        password: 0, // প্রোফাইল ডেটায় যাতে পাসওয়ার্ড না যায়, তাই ০ দেওয়া
      },
    };

    // ৩. ডাটাবেজে কুয়েরি চালানো
    let data = await userModel.aggregate([matchStage, project]);

    // ৪. ক্লায়েন্টকে রেসপন্স পাঠানো
    res.status(200).json({ 
      success: true, 
      data: data[0] 
    });

  } catch (error) {
    // 💡 এখানে e.toString() এর বদলে error.toString() হবে
    res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Something went wrong.",
    });
  }
};




//user verify 
exports.userVerify = async (req, res) =>{
  try {
    res.status(200).json({success:true})
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Something went wrong.",
    });
  }
}




//user-logout

exports.userLogout = async (req, res) =>{
  try {
      res.clearCookie('u_token')
      res.status(200).json({success:true, massage : 'logout successful'})
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Something went wrong.",
    });
  }
}




// user-update
exports.userUpdate = async (req, res) => {
  try {
    const _id = req.headers._id;
    const email = req.headers.email;

    
    const { 
      password,
      cus_name,
      cus_add,
      cus_city,
      cus_country,
      cus_fax,
      cus_phone,
      cus_postcode,
      cus_state,

      // Shipping Details
      ship_name,
      ship_add,
      ship_city,
      ship_country,
      ship_phone,
      ship_postcode,
      ship_state
    } = req.body;

    
    let updatedData = {
      email,
      cus_name,
      cus_add,
      cus_city,
      cus_country,
      cus_fax,
      cus_phone,
      cus_postcode,
      cus_state,

      // Shipping Details
      ship_name,
      ship_add,
      ship_city,
      ship_country,
      ship_phone,
      ship_postcode,
      ship_state
    };

   
    const user = await userModel.findById(_id);
   
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }
   
    // যদি password ফিল্ড থাকে, তবে সেটি bcrypt দিয়ে হ্যাশ করে আপডেট করবো
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedData.password = hashedPassword;
    }
   
    // Update user
    
    const updatedUser = await userModel.findByIdAndUpdate(_id, updatedData, {
      new: true, // এটি দিলে ডাটাবেজে আপডেটেড ডেটা রিটার্ন করবে
    });
   
    let token = EncodeToken(updatedUser?.email, updatedUser?._id.toString());
       
    // Set cookie
    res.cookie("u_token", token, options);
   
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: {
        email: updatedUser.email,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Something went wrong.",
    }); 
  }
};

/**exports.userUpdate = async(req, res) =>{
  try {
     const _id = req.headers._id;
     const email = req.headers.email;
    const { 
      cus_name,
    cus_add,
    cus_city,
    cus_country,
    cus_fax,
    cus_phone,
    cus_postcode,
    cus_state,

    // Shipping Details
    ship_name,
    ship_add,
    ship_city,
    ship_country,
    ship_phone,
    ship_postcode,
    ship_state
    } = req.body


   let updateData = {
    email,
    password,
      cus_name,
    cus_add,
    cus_city,
    cus_country,
    cus_fax,
    cus_phone,
    cus_postcode,
    cus_state,

    // Shipping Details
    ship_name,
    ship_add,
    ship_city,
    ship_country,
    ship_phone,
    ship_postcode,
    ship_state

   }


    const user = await adminModel.findOne({ email, _id });
   
       if (!user) {
         return res
           .status(200)
           .json({ success: false, message: "Invalid email." });
       }
   
       // যদি password ফিল্ড থাকে, তবে সেটি bcrypt দিয়ে হ্যাশ করে আপডেট করবো
       if (password) {
         const hashedPassword = await bcrypt.hash(password, 10);
         updatedData.password = hashedPassword;
       }
   
       // Update user
       const updatedUser = await adminModel.findByIdAndUpdate(_id, updatedData, {
         //new: true;
         returnDocument: 'after',
       });
   
       let token = EncodeToken(updatedUser?.email, updatedUser?._id.toString());
       
       // Set cookie
       res.cookie("a_token", token, options);
   
       res.status(200).json({
         success: true,
         message: "Admin updated successfully",
         user: {
           email: updatedUser.email,
         },
       });
   


  }catch (error) {
      res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Something went wrong.",
    });
  }
}**/



