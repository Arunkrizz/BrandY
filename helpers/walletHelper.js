const mongoose = require('mongoose');
const connectDB = require("../config/connection");
const Wallet = require('../models/wallet');

module.exports ={

    updateWalletAmount:async (total,userId)=>{
      try {
        return new Promise (async (resolve, reject)=>{
            connectDB()
            .then (async ()=>{
             let wallet= await  Wallet.findOne({ userId: userId })
              if (!wallet) {
                wallet = new Wallet({
                    userId: userId,
                    balance: total
                });
                await wallet.save();
            }else{
                let  updatedAmount=wallet.balance+total
                console.log(wallet.balance,total,updatedAmount,"walleet")
               await Wallet.findOneAndUpdate({ userId: userId },
                    {
                        $set:{
                            balance:updatedAmount
                        }
                    })
            }
            console.log("Wallet amount updated successfully.");
               resolve()    
               
                
            }).catch((err)=>{
                console.log(err);
                reject(err)
            })
        })
      } catch (error) {
        console.log(error);
      }
    },
}