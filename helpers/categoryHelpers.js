const Category = require('../models/category');
const connectDB = require("../config/connection");
// const mongoose = require('mongoose');

module.exports={
    categoryCount: async ()=>{
        return new Promise ((resolve ,reject)=>{
            connectDB()
            .then(()=>{
                Category.find({Listed:true}).count().then((data)=>{
                    resolve(data)
                })
            })
        })
    }
}