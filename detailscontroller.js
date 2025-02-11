const db = require('./db')
const env = require('dotenv')
const path = require('path')
const { MongoClient, ObjectId } = require("mongodb");

env.config({path:path.join(__dirname,'config','conf.env')})


exports.add_products = async (req,res) => {
    console.log('header is',req.header)
    console.log('body is',req.body)

    const {Uniq_id,Product_name,Category,Old_price,New_price,Vendor_uniq_id,Scheduled_date,Expiry_date} = req.body;
    console.log(Vendor_uniq_id)
    const image = req.file;


    const [user] = await db.query(`SELECT name,shop_name FROM vendor_records WHERE uniq_id = ?`, [Vendor_uniq_id]);
    console.log(user)
     
    if (!user.length === 1) return res.status(404).json({ success: false, message: "Something went wrong ! Try again" }); 

    const client = new MongoClient(process.env.MONGO_URI);
    let mongo_db;
    try {
        await client.connect();
         mongo_db = client.db("backend");
         const collection = mongo_db.collection("products"); 


        const newDocument = {
            uniq_id:Uniq_id,
            Product_name:Product_name,
            Category:Category,
            Old_price:Old_price,
            New_price:New_price,
            Vendor_name:user[0].name,
            Vendor_shop_name:user[0].shop_name,
            Vendor_uniq_id:Vendor_uniq_id,
            Scheduled_date: Scheduled_date,
            Expiry_date: Expiry_date,
            Image: {
                data: image.buffer, // Store the file buffer (binary data)
                contentType: image.mimetype // Store the file type (e.g., image/jpeg)
            },
        };

        const result = await collection.insertOne(newDocument);
        console.log(`Document inserted with _id: ${result.insertedId}`);
        res.json({message:'product added successfully'});
    } catch (error) {
        console.error("Error inserting document:", error);
        return res.status(404).json({ success: false, message: "Something went wrong ! Try again" }); 
    }
}


exports.get_user_vendor_staff_details = async (req,res) => {

    const {type,uniq_id} = req.body
    
    const [user] = await db.query(`SELECT ${type === true ? 'name,mobile_number': type ===false ? 'name,shop_name,location,mobile_number' :'name,role'} FROM ${type === true ? 'user_records': type=== false ?'vendor_records' : 'system_users'} WHERE uniq_id = ?`, [uniq_id]);
    if (user.length === 0) {
        return res.status(404).json({ success: false, message: "user not found" }); 
    }
    res.json(
        {
            success:true,
            message:'Got the products',
            info:user[0]
        }
    )
}

exports.getproducts = async (req,res) => {
    const {type,uniq_id} = req.body;

    const client = new MongoClient(process.env.MONGO_URI);

    let mongo_db;
    const connect_mongodb = async ()=> {
        await client.connect();
        mongo_db = client.db("backend"); 
        mongo_db ? console.log("Connected to MongoDB"):console.log('Failed to connect')

        let products ;
        try {
            if (type === false){
                products = await mongo_db.collection("products").find({Vendor_uniq_id:uniq_id}).toArray();
                console.log('vendor product is',products)
            }
            else{
                products = await mongo_db.collection("products").find().toArray();
            }
            await client.close();
            res.json({products:products});
        } catch (err) {
            await client.close();
            console.log(err)
            res.status(500).json({ success: false, message: "Server error", error: err.message });
        }
    }
    connect_mongodb();  
}

exports.getsearchedproducts = async (req,res) => {
    const {type,uniq_id} = req.body;

    const client = new MongoClient(process.env.MONGO_URI);

    let mongo_db;
    const connect_mongodb = async ()=> {
        await client.connect();
        mongo_db = client.db("backend"); 
        mongo_db ? console.log("Connected to MongoDB"):console.log('Failed to connect')

        let products ;
        try {
              products = await mongo_db.collection("products").find({uniq_id:'ee25a696-78f0-458b-9c01-bc47b3403e38_Remote_car'}).toArray();
            await client.close();
            res.json({products:products});
        } catch (err) {
            await client.close();
            console.log(err)
            res.status(500).json({ success: false, message: "Server error", error: err.message });
        }
    }
    connect_mongodb();  
}


exports.get_all_user_vendor_staff_details = async (req,res) => {
    
    const [user] = await db.query('SELECT * FROM user_records ')
    const [vendor] = await db.query('SELECT * FROM vendor_records ')
    if (user.length === 0) {
        return res.status(404).json({ success: false, message: "user not found" }); 
    }
    res.json(
        {
            success:true,
            message:'Got the products',
            user_list:user[0],
            vendor_list:vendor[0]
        }
    )
}

