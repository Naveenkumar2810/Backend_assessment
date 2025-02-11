const db =require('./db')
const jwt = require('jsonwebtoken');
const path = require('path')
const env = require('dotenv')
const bcrypt = require("bcryptjs");

env.config({path:path.join(__dirname,'config','conf.env')})

exports.admin_authentication = async(req,res) => { //function handling staff login authentication

  const {uniq_id,password} = req.body;

  try {
    const [user] = await db.query("SELECT * FROM system_users WHERE uniq_id =? ", [uniq_id]);

    if (user.length === 0) {
        return res.status(404).json({ success: false, message: "user not found" }); 
    }
    else if (user.length > 0){
      
      const isMatch = await bcrypt.compare(password, user[0].password);

      if (!isMatch) return res.status(404).json({ success: false, message: "Wrong password" })

      const token = jwt.sign(
        { uniq_id: user[0].uniq_id, type:'staff',role:user[0].role},
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" }
      ); 
      res.json({ success: true, token});
    }
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ success: false, message: "Database error", error: err.message });
  }
}

exports.authentication = async(req,res) => { //function handling user and vendor login authentication

  const {type,mobile_number,password} =req.body;

  try {
    const [user] = await db.query(`SELECT * FROM ${type? 'user_records':'vendor_records'} WHERE mobile_number = ?`, [mobile_number]);
    
    if (user.length === 0) {
        return res.status(404).json({ success: false, message: "user not found" });
        
    }
    else if (user.length > 0){
      
      const isMatch = await bcrypt.compare(password, user[0].password);

      if (!isMatch) return res.status(404).json({ success: false, message: "Wrong password" })

      const token = jwt.sign(
        { uniq_id: user[0].uniq_id, type:type},
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" }
      );

      res.json({ success: true,message:'login success', token});
    }
    
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ success: false, message: "Database error", error: err.message });
  }
}

exports.check_auth = async (req,res) =>{  // function handle every refresh
  
  const {type,uniq_id} = req.body;

  try {
    const [user] = await db.query(`SELECT * FROM ${type === true? 'user_records' : type === false ?'vendor_records': 'system_users'} WHERE uniq_id = ?`, [uniq_id]);
    
    if (user.length === 0) {
        return res.status(404).json({ success: false, message: "user not found" });
        
    }
    else if (user.length > 0){
      res.json({ success: true});
    }
    
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ success: false, message: "Database error", error: err.message });
  }

}