const connectDB = require("../config/connection");
const Product = require('../models/product');
const Order = require('../models/order')
const Cart = require('../models/cart');
const Razorpay = require('razorpay');

let instance = new Razorpay({
  key_id: 'rzp_test_dnjs6k85WVuHl7',
  key_secret: 'Bip621vIunBiWadw3Us3pwE1',
});

module.exports = {

    getOrder:async (orderId)=>{
        return new Promise ((resolve ,reject)=>{
            connectDB()
            .then(()=>{
                Order.findById(orderId)
                .then((order)=>{
                    resolve (order)
                }).catch((err)=>{
                    reject(err)
                })
            })
        })
    },

    changePaymentStatus:async(orderId)=>{
        console.log(orderId,"chngPyStat");
        return new Promise ((resolve,reject)=>{
           connectDB()
           .then (()=>{
            Order.findByIdAndUpdate(orderId,
                {
                    $set:{
                        status:'placed'
                    }
                }
                ).then((data)=>{
                    console.log(data);
                    resolve()
                }).catch((err)=>{
                    console.log(err);
                    reject(err)
                })
           }) 
        })
    },

    verifyPayment:async(details)=>{
        console.log("veri pay o-h ");
        return new Promise (async (resolve,reject)=>{
            const secret ='Bip621vIunBiWadw3Us3pwE1'
            const crypto =require('crypto')
            let hmac = await crypto.createHmac('sha256', secret)
            hmac.update(details['payment[razorpay_order_id]']+'|'+details['payment[razorpay_payment_id]'])
           hmac= hmac.digest('hex')
            if(hmac==details['payment[razorpay_signature]']){
                console.log("veri pay o-h resolved");
                resolve()
            }else{
                console.log("veri pay o-h rejected");
                reject()
            }
        })                    
    },

    generateRazorpay:async (orderId,total)=>{
        return new Promise ((resolve,reject)=>{
            instance.orders.create({
                amount: total*100 ,
                currency: "INR",
                receipt: ""+orderId,
                notes: {
                  key1: "value3",
                  key2: "value2"
                }
              }).then((order)=>{
                console.log(order,"order in razorpay");
                resolve(order)
              }).catch ((error)=>{
                console.log(error);
                reject(error)
              })
        })
    },

    cancelOrder: async (orderId) => {
        return new Promise((resolve, reject) => {
            connectDB()
                .then(() => {
                    Order.findByIdAndUpdate(orderId, { $set: { status: 'cancelled' } }).then(() => {
                        resolve()
                    }).catch((error) => {
                        console.log(error);
                        reject(error)
                    })
                })
        })
    },

    getOrders: async (userId) => {
        return new Promise((resolve, reject) => {
            console.log("in u-h getOrders");
            connectDB()
                .then(async () => {
                    const orders = await Order.find({ userId: userId })
                        // Order.findById(orderId)
                        .populate('products.product') // Populate the 'product' field within the 'products' array
                        .exec()
                        .then((data) => {
                            console.log(data, "in u-h getorders");
                            resolve(data)
                        }).catch((error) => {
                            console.log(error);
                            reject(error)
                        })
                })
        })
    },

    getCartProductList: async (userId) => {
        return new Promise(async (resolve, reject) => {
            connectDB()
                .then(async () => {
                    let cart = await Cart.findOne({ user: userId }).then((data) => {
                        console.log(data, "u-h getcartprolist");
                        resolve(data?.products)
                    })




                })


        })
    },

    placeOrder: async (details,data, products, total, user_Id, userName) => {
        return new Promise(async (resolve, reject) => {
            console.log(details, products, total);
            let status = data['paymentMethod'] === 'COD' ? 'placed' : 'pending'

            const productsWithQuantity = products.map(product => {
                return {
                    product: product.item,
                    quantity: product.quantity,
                };
            });

            let orderObj = {
                deliveryDetails: {
                    firstname: details.firstname,
                    lastname: details.lastname,
                    state: details.state,
                    address1: details.address1,
                    address2: details.address2,
                    city: details.city,
                    pincode: details.pincode,
                    mobile: details.mobile,
                    email: details.email,
                },
                userName: userName,
                userId: user_Id,
                paymentMethod:data['paymentMethod'],
                products: productsWithQuantity,
                totalAmount: total,
                status: status,
                date: new Date()
            }

            connectDB()
                .then(async () => {
                    let cartId
                    await Order.create(orderObj)
                        .then(async (response) => {
                            cartId = response._id
                            const deleteResult = await Cart.deleteOne({ user: user_Id })

                            resolve(cartId)
                        }).then(async (response) => {
                            console.log("+++++++++", cartId, "u-hhhhh");

                            const Products = await Order
                                .findOne({ _id: cartId })
                                .populate("products.product");

                            console.log("+++++++++", Products, "u-hhhhh");

                            Products.products.map(async (item) => {
                                console.log(item, "item");
                                let stock = item.product.Stock - item.quantity;
                                console.log(item.product.Stock, "prostock", item.quantity, "quantity", stock, "stock");

                                await Product.findByIdAndUpdate(
                                    item.product._id,
                                    {
                                        Stock: stock,
                                    },
                                    { new: true }
                                );
                            });

                        }).catch((error) => {
                            console.log(error);
                            reject(error)
                        })
                })
        })
    },







}