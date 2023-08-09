const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admincontroller');
const productHelpers = require('../helpers/product-helpers');
// const multer = require('multer');
/////////////////////////////////////////////////////////////////////////////////////////
router.get('/',adminController.getAdminLogin)
router.post('/admin-login',adminController.verifyAdmin)
router.get('/logout',adminController.logOut)
router.get('/admineditproduct',adminController.adminGetProduct)
router.get('/adminedituser',adminController.adminGetUser)
router.post('/edit-user/:id',adminController.adminEditUser)
router.get('/adminblock_user',adminController.adminBlockUser) 
router.get('/adminUn_block_user',adminController.adminUnBlockUser)
router.get('/admindeleteuser',adminController.adminDeleteUser)
router.get('/admindeleteproduct',adminController.adminDeleteProduct)
router.post('/edit-product/:id',adminController.adminEditProduct)
router.get('/add-product',adminController.adminAddProductPage)
router.post('/add-product',adminController.adminAddProduct)
router.get('/add-user',adminController.adminAddUserPage)
router.post('/add-user',adminController.adminAddUser)
router.get('/allUsers',adminController.getAllUsers )
router.get('/allOrders',adminController.getAllOrders )
router.get('/adminViewOrderDetails',adminController.getOrderDetails )

router.post('/updateDeliveryStatus',adminController.updateDeliveryStatus)

router.get('/categoryUnlist',adminController.categoryUnlist)
router.get('/categoryRelist',adminController.categoryRelist)
router.get('/editCategoryPage',adminController.editCategoryPage)
router.post('/editCategory',adminController.editCategory)
 
router.get('/getCategoryProduct',adminController.getCategory)
router.get('/getAllCategory',adminController.getAllCategory)
router.post('/addCategory',adminController.InsertCategory)
router.get('/addCategory',adminController.addCategory)
// //////////////////////////////////////////////////////////////////////////////////////


module.exports = router;






