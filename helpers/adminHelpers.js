const connectDB = require("../config/connection");
const Order = require('../models/order')

module.exports = {
    allOrders: async () => {
        return new Promise((resolve, reject) => {
            connectDB()
                .then(() => {
                    Order.find({}).then((data) => {
                        resolve(data)
                    }).catch((error) => {
                        console.log(error);
                        reject(error)
                    })
                })
        })
    },

    updateDeliveryStatus: async (details) => {
        const status =details.status;
        const orderId=details.orderId.trim()
        return new Promise((resolve, reject) => {
            connectDB()
                .then(() => {
                    Order.findByIdAndUpdate(orderId, { status: status }).then(() => {
                        resolve({updated:true})
                    }).catch((error) => {
                        reject(error)
                    })
                })
        })

    },


    getOrderDetails: async (orderId) => {

        return new Promise((resolve, reject) => {
            connectDB()
                .then(() => {
                    Order.findById(orderId)
                        .populate('products.product') // Populate the 'product' field within the 'products' array
                        .populate('userId')
                        .exec()
                        .then((data) => {
                            resolve(data)
                        }).catch((error) => {
                            console.log(error);
                            reject(error)
                        })
                })
        })
    },

}