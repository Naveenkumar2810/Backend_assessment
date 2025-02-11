const db = require('./db')
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

exports.staff_signup =async (req,res)=> {

    console.log(req.body)
    const {username,password} = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const staff_uuid = uuidv4() + '_' + username;
        console.log(staff_uuid)

        const [rows] = await db.query("SELECT * FROM system_users WHERE uniq_id = ?", [staff_uuid]);
    
        if (!rows.length === 0) {
            return res.status(404).json({ success: false, message: "Something went wrong please try again" });   
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const [result] =await db.query(`INSERT INTO system_users (uniq_id,name,password) VALUES (?,?,?)`,[staff_uuid,username,hashedPassword])
        }
        res.json({ success: true,message:`Created : ${staff_uuid}`});
    }
      catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: "Something went wrong please try againr", error: err.message });
    }

}

exports.user_vendor_signup =async (req,res)=> {

    const {type} = req.body;
    let username,shopname,location,mobile_number,password
    if (type){
         ({username,mobile_number,password} = req.body)
    }
    else{
        ({username,shopname,location,mobile_number,password} = req.body)
    }

    console.log(req.body)
    console.log(mobile_number)

    try {
        const [rows] = await db.query(`SELECT * FROM ${type ? 'user_records':'vendor_records'} WHERE mobile_number = ?`, [mobile_number]);
    
        if (rows.length > 0) {
            return res.status(404).json({ success: false, message: "mobile number regsitered with a account" });   
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user_uuid = uuidv4();  
        console.log(username,mobile_number)

        const [result] = type? 
            await db.query(
            `INSERT INTO user_records (uniq_id,name,mobile_number,password) VALUES (?, ?, ?,?)`,
            [user_uuid,username,mobile_number,hashedPassword]):
            await db.query(
            `INSERT INTO vendor_records (uniq_id,name,shop_name,location,mobile_number,password) VALUES (?,?,?,?,?,?)`,
            [user_uuid,username,shopname,location,mobile_number,hashedPassword])


        res.json({ success: true, Message:"Account created successfully"});
    }
      catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: "Something went wrong please try again", error: err.message });
    }

}