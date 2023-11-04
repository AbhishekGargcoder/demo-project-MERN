const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
})
async function main(){
   await mongoose.connect(MONGO_URL);
}

const initDB = async()=>{
    await Listing.deleteMany({});  // clear the db first
    initData.data = initData.data.map((obj)=>({...obj,owner:"6537599e14b80df9846579e3"}));
    await Listing.insertMany(initData.data);
    console.log("Database initialized");
}
initDB();