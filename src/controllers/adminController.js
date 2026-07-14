const adminModel = require('../models/adminModels')
const {EncodeToken} = require('../utility/tokeHelper')
const bcrypt = require('bcrypt'); 

let options = {
  maxAge: process.env.Cookie_Expire_Time,
  httpOnly: false,
  sameSite: "lax",
  secure: false,
};



//admin register
exports.register= async (req, res) =>{
    try {
         const {email, password} = req.body
         await adminModel.create({email, password})
           res.status(200).json({
      success: true,
      message: 'Register API working ',
    });
    } catch (error) {
        res.status(500).json({ 
            success : false,
            error : error.toString(),
            Message : "some wrong",
        }); 
    }
} 


//admin login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await adminModel.findOne({ email });
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
      res.cookie("a_token", token, options);

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
    return res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Something went wrong.",
    });
  }
};



//admin
exports.admin = async(req, res) => {
  try {
    let email = req.headers.email

 
        let matchStage = {
  $match: { email },
};

let project = {
  $project: {
    password: 0,
  },
};

let data = await adminModel.aggregate([matchStage, project]);

res.status(200).json({
  success: true,
  data: data[0],
});
    console.log(data)
  } catch (error) {
     res.status(500).json({ 
            success : false,
            error : error.toString(),
            Message : "some wrong",
        }); 
  }
}


//admin verify 
exports.adminVerify = async(req, res) =>{
  try {
     res.status(200).json({success: true})
  } catch (error) {
     res.status(500).json({ 
            success : false,
            error : error.toString(),
            Message : "some wrong",
        }); 
  }
}


//admin logout
exports.adminLogout = async(req, res) =>{
  try {
    res.clearCookie('a_token')

    res.status(200).json({success:true, massage: "logout success"})
  } catch (error) {
     res.status(500).json({ 
            success : false,
            error : error.toString(),
            Message : "some wrong",
        }); 
  }
}


//admin update

exports.adminUpdate = async(req, res) =>{
  try {
    const { email, password } = req.body;
    const _id = req.headers._id;

    let updatedData = { email };
    const user = await adminModel.findOne({  _id });

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

  } catch (error) {
      res.status(500).json({ 
            success : false,
            error : error.toString(),
            Message : "some wrong",
        }); 
  }
}








