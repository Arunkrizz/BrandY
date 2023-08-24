const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const cartController = require('../controllers/cartController');
const categoryController = require('../controllers/categoryController');
const orderController = require('../controllers/orderController');
const otpController = require('../controllers/otpController');
const productController = require('../controllers/productController');
const couponController = require('../controllers/couponController');
const walletController = require('../controllers/walletController');
const auth=require ('../middleware/auth')


////////////////////////////////////////////////////////////////////////////////////////////////////
router.get('/',userController.landingPage)
// router.get('/',(req,res)=>{res.render('productDetailsPage')})
router.post('/verify',userController.verify)
router.post('/verifys',userController.verifys)
router.post("/signup",userController.signup)
router.get('/login',auth.isLogin,userController.login)
router.post('/login',userController.getuserlogin)
router.get('/logout',userController.logout)
router.get('/home',auth.isLogout,userController.home)
router.get('/profile',userController.getProfile)
router.post('/changeAddress',userController.changeAddress)
router.get('/changePassword',userController.changePasswordPage) 
router.post('/changePassword',userController.changePassword)
router.post('/filter',userController.filter)
router.get('/wallet',userController.walletPage)

router.get('/productdetails/:id',auth.isLogout,productController.getProductDetails)
router.get('/getCategoryProduct',auth.isLogout,productController.getCategoryProduct) 

router.post('/addTocart/:id',auth.isLogout,cartController.addToCart)
router.get('/cart',auth.isLogout,cartController.getCart)
router.post('/changeProductQuantity',auth.isLogout,cartController.changeQuantity)
router.post('/removeCartProduct',auth.isLogout,cartController.removeCartProduct)
router.get('/applyCoupon',couponController.applyCoupon)
router.get('/verifyCoupon/:id',couponController.verifyCoupon)

router.get('/placeorder',auth.isLogout,orderController.placeOrder)
router.get('/orderSuccess',orderController.orderSuccess)
router.get('/orders',auth.isLogout,orderController.orderPage)
router.get('/cancelOrder',auth.isLogout,orderController.cancelOrder)
router.post('/checkout',auth.isLogout,orderController.checkOut)
router.get('/checkoutaddAddress',auth.isLogout,userController.checkoutaddAddressPage)
router.post('/checkoutAddAddress',auth.isLogout,userController.checkoutaddAddress)
router.post('/verify-payment',orderController.verifyPayment)
router.get('/checkStock',orderController.checkStock)
router.get('/returnOrder',orderController.returnOrder)
  
  
router.post('/forgotPassword', otpController.sendOtp)
router.post('/verifyForgotPass',otpController.verifyOtp)
router.get('/forgotPassword',otpController.forgotPassword)
router.post('/resetPassword',otpController.resetPassword)  

router.get('/manageAddress',userController.manageAddress)
router.get('/editAddress',userController.editAddress)
router.post('/editAddress',userController.updateAddress) 
router.get('/addAddress',userController.addAddress)
router.post('/addNewAddress',userController.addNewAddress)  
router.get('/deleteAddress',userController.deleteAddress)
router.post('/changePrimaryAddress',userController.changePrimaryAddress)
router.get('/checkoutPageDeleteAddress',userController.checkoutPageDeleteAddress)
router.get('/checkoutPageEditAddress',userController.checkoutPageEditAddress)
router.post('/checkoutPageEditAddress',userController.updateCheckoutAddress) 

router.post('/changeWalletBalance',walletController.updateWallet)

// ///////////////////////////////////////////////////////////////////////////////////////////////////


// ///////////////////////////////////////////////////////////////////////////////////////////////////



module.exports = router;
