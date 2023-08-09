const express = require('express');
const router = express.Router();
const userController = require('../controllers/usercontroller');
const cartController = require('../controllers/cart-controller');
const categoryController = require('../controllers/category-controller');
const orderController = require('../controllers/order-controller');
const otpController = require('../controllers/otp-controller');
const productController = require('../controllers/product-controller');
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

router.get('/productdetails/:id',auth.isLogout,productController.getProductDetails)
router.get('/getCategoryProduct',auth.isLogout,productController.getCategoryProduct) 

router.get('/addTocart/:id',auth.isLogout,cartController.addToCart)
router.get('/cart',auth.isLogout,cartController.getCart)
router.post('/changeProductQuantity',auth.isLogout,cartController.changeQuantity)
router.post('/removeCartProduct',auth.isLogout,cartController.removeCartProduct)

router.get('/placeorder',orderController.placeOrder)
router.get('/orderSuccess',orderController.orderSuccess)
router.get('/orders',orderController.orderPage)
router.get('/cancelOrder',orderController.cancelOrder)
router.post('/checkout',orderController.checkOut)
router.get('/checkoutaddAddress',userController.checkoutaddAddressPage)
router.post('/checkoutAddAddress',userController.checkoutaddAddress)
router.post('/verify-payment',orderController.verifyPayment)
 
 
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

// ///////////////////////////////////////////////////////////////////////////////////////////////////


// ///////////////////////////////////////////////////////////////////////////////////////////////////



module.exports = router;
