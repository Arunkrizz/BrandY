const userHelper = require("../helpers/userHelpers")
const orderHelper = require("../helpers/orderHelpers")
const walletHelper = require("../helpers/walletHelper")
const productHelper=require("../helpers/productHelpers")

const returnOrder =async (req,res)=>{
  try {
    await orderHelper.returnOrder(req.query.id)
    res.redirect('/orders')
  } catch (error) {
    console.log(error)
  }
 
}

const checkStock =async (req,res)=>{
productHelper.checkStock(req.session.user._id).then((response)=>{
  console.log(response,"check stock");
  res.json(response)
})
}

const verifyPayment =async (req,res)=>{
  console.log(req.body,"o-c vPaymnt");
 await  orderHelper.verifyPayment(req.body).then(async ()=>{
  await orderHelper.changePaymentStatus(req.body['order[receipt]']).then(()=>{
   console.log("payment successfull");
    res.json({status:true})
  })
 }).catch((error)=>{
  console.log(error);
  res.json({status:false,errMsg:'payment failed'})
 })
}

const cancelOrder =async(req,res)=>{
    try {
     
      // console.log(req.query.id,"here in o-c cancelorder");
     await orderHelper.cancelOrder(req.query.id)
      orderHelper.updateStockQuantity(req.query.id)
      const order =await orderHelper.getOrder(req.query.id)
      console.log(order,"cancel orderrr")
      if(order.paymentMethod==="ONLINE"){
        if(order.status!=='pending'){
          const total =order.totalAmount
          await walletHelper.updateWalletAmount(total,req.session.user._id)
    
          console.log(total,"cancel order o-c");
        }
     
      }

      res.redirect('/orders')
    } catch (error) {
      console.log(error);
    }
  }
  
  const orderPage= async(req,res)=>{
   let page
    if(!req.query.page){
     page = parseInt(req.query.page) || 1;
    }else{
      page =parseInt(req.query.page)+1
    }
    
    console.log(page,"pageno.")
    try {
     const totalItems = await orderHelper.countDocuments();

      let orders =await orderHelper.getOrders(req.session.user._id,page)
      
      console.log("-------------",orders[0].products,"in u-c orderpage");

     
    
     
  
        res.render('ordersPage',{orders,totalItems,page})
    } catch (error) {
      console.log(error);
    }
  }
  
  const orderSuccess= async(req,res)=>{
    try {
      res.render('orderConfirmed')
    } catch (error) {
      console.log(error);
    }
  
  }
  
  const checkOut =async (req,res)=>{
  try { 
    console.log(req.body,"in checkout u-c");
   const couponCode=req.body?.couponCode
   const userId =req.session.user._id
   console.log(couponCode,"coupon code");
   const ifCouponUsed= await userHelper.addCouponToUser(couponCode, userId);
    const user=req.session.user
    const totalAmt= req.body.total
    let products=await orderHelper.getCartProductList(user._id)
    // console.log(products,"in checkout u-c");
    let totalPrice= await userHelper.getTotal(user._id)
    let deliveryAddress= await userHelper.fetchPrimaryAddress(req.session.user._id,req.body.addressId)
    // console.log(req.body,"deliverydetails /checkoutt");
    // await userHelper.addAddress(req.body,user._id)
    await orderHelper.placeOrder(deliveryAddress,req.body,products,totalPrice,user._id,user.Name).then (async  (orderId)=>{
      console.log(orderId,"ord Id o-c chkout"); 
      if(req.body['paymentMethod']=='COD'){
        
        res.json({checkoutcomplete:true})
      }else {
       await orderHelper.generateRazorpay(orderId,totalAmt).then( (response)=>{
          console.log(totalAmt,"!==",totalPrice);
          if(totalAmt!==totalPrice){
            walletHelper.reduceWalletBalance(req.session.user._id,totalPrice)
          }
          res.json(response) 
        }).catch((error)=>{
          console.log(error,"ERr");
        })
      }
  
    }).catch((error)=>{
      console.log(error);
    })
    console.log("here");
  } catch (error) {
    console.log(error);
  }
  }
  
  // const place_order= async(req,res)=>{
  // try {
  //   console.log("here");
  //   console.log("place_order",req.body);
  // } catch (error) {
  //   console.log(error);
  // }
  // }
  
  const placeOrder = async (req, res) => {
    try {
  
    // if(req.session.user){
      const promises = [
        userHelper.getTotal(req.session.user._id),
        userHelper.getSubTotal(req.session.user._id),
        userHelper.getAddress(req.session.user._id),
        walletHelper.getWallet(req.session.user._id)
      ];
      
      Promise.all(promises)
      .then(([total,subTotal,address,wallet]) => {
        console.log(address,"address o-c placeorder");
        res.render('checkoutPage',{total,subTotal,address,wallet})
        // res.render('s1',{total,subTotal,address})
      })
      .catch((error) => {
        console.log('Failed to get checkout page:', error);
        // Handle error
      })
    } catch (error) {
      
    }
  }
  
  module.exports={
    cancelOrder,
    orderPage,
    orderSuccess,
    checkOut,
    placeOrder,
    verifyPayment,
    checkStock,
    returnOrder
    
  }