const productHelpers = require('../helpers/product-helpers');
const userHelpers = require("../helpers/user-helpers")
const adminHelpers = require("../helpers/admin-helpers")

const getOrderDetails= async(req,res)=>{
  const orderId = req.query.OrderId
  const order = await adminHelpers.getOrderDetails(orderId)
  // console.log(req.query,"in ac getorderdetails");
  console.log(order,"in ac getorderdetails");
  res.render('./admin/admin-orderdetails',{order})

}

const updateDeliveryStatus=async(req,res)=>{
  try {
    console.log(req.body,"in a-c updatedeliverystat");
    // const status = req.query.status
    // const orderId =req.query.orderId
  
   await  adminHelpers.updateDeliveryStatus(req.body).then((response)=>{
    
    res.json(response)
  })
  } catch (error) {
    console.log(error);

  }
}

const getAllOrders=async (req,res)=>{
  try {
    
    console.log("here in a-c getallorders");
  const orders=  await adminHelpers.allOrders()
    res.render('./admin/adminPanel-orders',{orders})
  } catch (error) {
    console.log(error);
  }
}

const editCategory=async (req,res)=>{
  try {
    let prevName=req.body.cName
    let newName=req.body.newcName
    await productHelpers.changeCategoryName(prevName,newName)
    await productHelpers.changeProductCategoryName(prevName,newName)
    res.redirect('/admin/getAllCategory');
  } catch (error) {
    
  }
}

const editCategoryPage=async (req,res)=>{
  try {
    let categoryId=req.query.categoryId
    let category=req.query.categoryName
    // console.log(category,"catt");
    res.render('./admin/admin-editcategory',{category})
  } catch (error) {
    
  }

}


const categoryRelist=async (req,res)=>{
  try {
    
console.log("a_c cat relist");

    try {
      const categoryId = req.query.categoryId;
      const categoryName= req.query.categoryName
      const category = await productHelpers.getcategoryById({ _id: categoryId });
      await productHelpers.UndeleteCategoryProducts({Category:categoryName})
      
      if (!category) {
        console.log(category,"no category");
        // Handle the case when the product is not found
        return res.redirect('/admin/getAllCategory');
      }
  
      // Assuming you have a deleteProductById function in your productHelpers
     let reListed= await productHelpers.categoryRelist(categoryId);
     
     console.log(reListed,"relisted logged");
  
      // Handle the success case, e.g., redirect to the admin panel with a success message
      res.redirect('/admin/getAllCategory');
    } catch (err) {
      console.log(err);
      // Handle the error, e.g., redirect to the admin panel with an error message
      res.redirect('/admin');
    }



  } catch (error) {
    console.log(error);
  }
}


const categoryUnlist=async (req,res)=>{
  try {
    
console.log("a_c cat unlist");

    try {
      const categoryId = req.query.categoryId;
      const categoryName= req.query.categoryName
     const category= await productHelpers.getcategoryById({ _id: categoryId });
      await productHelpers.deleteCategoryProducts({Category:categoryName})
      if (!category) {
        console.log(category,"no category");
        // Handle the case when the product is not found
        return res.redirect('/admin/getAllCategory');
      }
  
      // Assuming you have a deleteProductById function in your productHelpers
      await productHelpers.categoryUnlist(categoryId);

     
  
      // Handle the success case, e.g., redirect to the admin panel with a success message
      res.redirect('/admin/getAllCategory');
    } catch (err) {
      console.log(err);
      // Handle the error, e.g., redirect to the admin panel with an error message
      res.redirect('/admin');
    }



  } catch (error) {
    console.log(error);
  }
}



const addCategory = async (req, res) => {
  try {
    res.render('./admin/adminaddCategory')
  }catch (error) {
    console.log(error.message);
  }
}

const InsertCategory= async (req, res) => {
  try {
    console.log(req.body.cName,"// here insertcategory");
      try {
        let category={ Category: req.body.cName }
           await productHelpers.addCategory(category).then(()=>{
            // res.render('./admin/add-product');
            res.redirect('/admin/add-product')
          })
          // console.log(eproducts,"here");
         
        } catch (error) {
          console.log('Failed to add Category:', error);
          res.status(500).send('Internal Server Error');
        }
  }
  catch (error) {
      console.log(error.message);
    }
}




const getAllCategory = async (req, res) => {
  try {
   const category=await productHelpers.getAllCategory()
    res.render('./admin/adminPanel-category',{category})
  }catch (error) {
    console.log(error.message);
  }
}

const getAdminLogin = async (req, res) => {
    try {
        if(req.session.admin){
          const promises = [
            productHelpers.getAllProducts(),
            productHelpers.getAllListedCategory()
          ];
          Promise.all(promises)
          .then(([products,category]) => {
            // console.log(EarRingsProduct);
            res.render('./admin/adminPanel', { products,category });
          })
          .catch((error) => {
            console.log('Failed to retrieve products:', error);
            // Handle error
          });


            // productHelpers.getAllProducts((products) => {
            //   if (products) {
            //     res.render('./admin/adminPanel', { products });
            //     console.log(products);
            //   } else {
            //     // Handle error
            //     console.log('Failed to retrieve products');
            //   }
            //   // res.render('./admin/adminPanel')
            // });
          }
          else{
            res.render('admin/admin-login');
          }
    }
    catch (error) {
        console.log(error.message);
      }
}
/////////////////////////////////////////////////////////////////////////////////////

const verifyAdmin = async (req, res) => {
    try {
        try {
            const email = req.body.email;
            const password=req.body.password
            const admin = await userHelpers.getAdminByMail({ email,password});
            console.log("here /getadminbymail", admin);
            if (admin.Admin) {
              // Handle the case when the admin is not found
              req.session.admin=true
              return res.redirect('/admin');
            }
          else{
            // Render the admin profile page with the retrieved admin data
            res.render('admin/admin-login');
          }
          } catch (err) {
            console.log(err);
            res.redirect('/'); // Handle the error, e.g., redirect to the admin panel
          }
    }
    catch (error) {
        console.log(error.message);
      }
}
/////////////////////////////////////////////////////////////////////////////////////

const logOut = async (req, res) => {
    try {
        req.session.admin=false
        res.redirect('/admin')
    }
    catch (error) {
        console.log(error.message);
      }
}
/////////////////////////////////////////////////////////////////////////////////////

const adminGetProduct = async (req, res) => {
    try {
        try {
            // console.log("here /admineditproduct");
            const productId = req.query.productId;
            const product = await productHelpers.getProductById({ _id: productId });
            console.log("here /admineditproduct",product);
            if (!product) {
              // Handle the case when the product is not found
              return res.redirect('/admin');
            }
        
            res.render('admin/admineditproduct',  { product: product });
          } catch (err) {
            console.log(err);
            res.redirect('/admin'); // Handle the error, e.g., redirect to the admin panel
          }  
    }
    catch (error) {
        console.log(error.message);
      }
}
/////////////////////////////////////////////////////////////////////////////////////

const adminGetUser = async (req, res) => {
    try {
        try {
            const userId = req.query.userId; 
            const user = await userHelpers.getUserById({ _id: userId }); 
            console.log("here /adminedituser", user);
            if (!user) {
              // Handle the case when the user is not found
              return res.redirect('/admin');
            }
        
            res.render('admin/adminedituser', { user: user }); 
          } catch (err) {
            console.log(err);
            res.redirect('/admin'); // Handle the error, e.g., redirect to the admin panel
          }
    }
    catch (error) {
        console.log(error.message);
      }
}
/////////////////////////////////////////////////////////////////////////////////////

const adminEditUser = async (req, res) => {
    try {
        userHelpers.updateUser(req.params.id, req.body).then(() => {
            res.redirect('/admin/allUsers');
          }); 
    }
    catch (error) {
        console.log(error.message);
      }
}
/////////////////////////////////////////////////////////////////////////////////////

const adminBlockUser = async (req, res) => {
    try {
        console.log(req.query.userId,"blockkkk");
        userHelpers.updateUserBlockedStatus(req.query.userId).then(()=>{
          res.redirect('/admin/allUsers');
        })
    }
    catch (error) {
        console.log(error.message);
      }
}
/////////////////////////////////////////////////////////////////////////////////////

const adminUnBlockUser = async (req, res) => {
    try {
        console.log(req.query.userId,"Unnn_blockkkk");
        userHelpers.updateUserUnBlockedStatus(req.query.userId).then(()=>{
          res.redirect('/admin/allUsers');
        })
    }
    catch (error) {
        console.log(error.message);
      }
}
/////////////////////////////////////////////////////////////////////////////////////

const adminDeleteUser = async (req, res) => {
    try {
        try {
            const userId = req.query.userId; 
            const user = await userHelpers.getUserById(userId); 
            
            if (!user) {
              // Handle the case when the user is not found
              return res.redirect('/admin');
            }
        
            
            await userHelpers.deleteUserById(userId);
        
            // Handle the success case, e.g., redirect to the admin panel with a success message
            res.redirect('/admin/allUsers');
          } catch (err) {
            console.log(err);
            // Handle the error, e.g., redirect to the admin panel with an error message
            res.redirect('/admin');
          }
    }
    catch (error) {
        console.log(error.message);
      }
}
/////////////////////////////////////////////////////////////////////////////////////

const adminDeleteProduct = async (req, res) => {
    try {
        try {
            const productId = req.query.productId;
            const product = await productHelpers.getProductById({ _id: productId });
            
            if (!product) {
              // Handle the case when the product is not found
              return res.redirect('/admin');
            }
        
            // Assuming you have a deleteProductById function in your productHelpers
            await productHelpers.softDeleteProduct(productId);
        
            // Handle the success case, e.g., redirect to the admin panel with a success message
            res.redirect('/admin');
          } catch (err) {
            console.log(err);
            // Handle the error, e.g., redirect to the admin panel with an error message
            res.redirect('/admin');
          }
    }
    catch (error) {
        console.log(error.message);
      }
}
/////////////////////////////////////////////////////////////////////////////////////

const adminEditProduct= async (req, res) => {
    // try {
    //     productHelpers.updateProduct(req.params.id,req.body).then(()=>{
    //         res.redirect('/admin')
    //         if(req.files){
    //           let image =req.files.Image
    //           console.log(image,"//image");
    //           image.mv('./public/product-images/'+req.params.id+'.jpg')
    //         }
    //       }) 
    // }
    // catch (error) {
    //     console.log(error.message);
    //   }
    try {
        
      productHelpers.updateProduct(req.params.id,req.body).then((data)=>{
          console.log(req.files, "in here multer");
          if (req.files && req.files['images[]']) {
            
            const images = req.files['images[]'];
            console.log(images,"entered");
            // const destinationPath = './public/product-images/';
            const movePromises = [];
            let id=data.id
            console.log(id,"id");
        
            for (let i = 0; i < images.length; i++) {
              const image = images[i];
              const movePromise = new Promise((resolve, reject) => {
                image.mv('./public/product-images/'+id+i+'.jpg', (err) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve();
                  }
                });
              });
              movePromises.push(movePromise);
            }
        
            // Wait for all file moves to complete
            Promise.all(movePromises)
              .then(() => {
                // All files moved successfully
                // Perform any other actions you need to do after file upload
        
                // Send response or redirect
                res.redirect('/admin')
              })
              .catch((error) => {
                console.log('Failed to move images:', error);
                // Handle the error
                res.status(500).send('Failed to add product');
              });
          } else {
            // Handle case where no images were uploaded
            productHelpers.updateProduct(req.params.id,req.body) .then(() => {
              // All files moved successfully
              // Perform any other actions you need to do after file upload
      
              // Send response or redirect
              res.redirect('/admin')
            })
            .catch((error) => {
              console.log('Failed to update product:', error);
              // Handle the error
              res.status(500).send('Failed to add product');
            });

            
          }
        });
        
          }
          catch (error) {
              console.log(error.message);
            }
}
/////////////////////////////////////////////////////////////////////////////////////

const adminAddProductPage= async (req, res) => {
    try {
      const category= await productHelpers.getAllListedCategory()
        res.render('admin/add-product',{category})
    }
    catch (error) {
        console.log(error.message);
      }
}
/////////////////////////////////////////////////////////////////////////////////////

const adminAddProduct= async (req, res) => {
    try {
        
productHelpers.addProduct(req.body, (id) => {
    console.log(req.files, "in here multer");
    if (req.files && req.files['images[]']) {
      
      const images = req.files['images[]'];
      console.log(images,"entered");
      // const destinationPath = './public/product-images/';
      const movePromises = [];
  
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const movePromise = new Promise((resolve, reject) => {
          image.mv('./public/product-images/'+id+i+'.jpg', (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });
        movePromises.push(movePromise);
      }
  
      // Wait for all file moves to complete
      Promise.all(movePromises)
        .then(() => {
          // All files moved successfully
          // Perform any other actions you need to do after file upload
  
          // Send response or redirect
          res.render("admin/add-product")
        })
        .catch((error) => {
          console.log('Failed to move images:', error);
          // Handle the error
          res.status(500).send('Failed to add product');
        });
    } else {
      // Handle case where no images were uploaded
      // ...
    }
  });
  
    }
    catch (error) {
        console.log(error.message);
      }
}
/////////////////////////////////////////////////////////////////////////////////////

const adminAddUserPage= async (req, res) => {
    try {
        res.render('admin/add-user')
    }
    catch (error) {
        console.log(error.message);
      }
}
/////////////////////////////////////////////////////////////////////////////////////

const adminAddUser= async (req, res) => {
    try {
        console.log(req.body,"herein ad adduser");
  
        userHelpers.addUser(req.body,(id)=>{
          
          // let id=req.body._id
          res.redirect("/admin/add-User")
          
            })
    }
    catch (error) {
        console.log(error.message);
      }
}
/////////////////////////////////////////////////////////////////////////////////////

const getAllUsers= async (req, res) => {
    try {
        userHelpers.getAllUsers()
        .then((users) => {
          // console.log("in/getusersadminp");
          if (users) {
            console.log(users[0].Email,"usercheck");
            res.render('./admin/adminPanel-users', { users });
            console.log(users);
          } else {
            // Handle error
            console.log('Failed to retrieve users');
          }
        })
        .catch((error) => {
          console.log('Error retrieving users:', error);
          // Handle error
        });
    }
    catch (error) {
        console.log(error.message);
      }

}

/////////////////////////////////////////////////////////////////////////////////////

const getNecklaces= async (req, res) => {
    try {
        try {
            const nproducts = await productHelpers.getNecklace_Products();
            // console.log(eproducts,"here");
            res.render('./admin/adminPanel', { products: nproducts });
          } catch (error) {
            console.log('Failed to get products:', error);
            res.status(500).send('Internal Server Error');
          }
    }
    catch (error) {
        console.log(error.message);
      }
}
/////////////////////////////////////////////////////////////////////////////////////

const getBangles= async (req, res) => {
    try {
        try {
            const Bangleproducts = await productHelpers.getBangles_Products();
            // console.log(clothproducts,"here");
            res.render('./admin/adminPanel', { products: Bangleproducts });
          } catch (error) {
            console.log('Failed to get products:', error);
            res.status(500).send('Internal Server Error');
          }  
    }
    catch (error) {
        console.log(error.message);
      }
}

/////////////////////////////////////////////////////////////////////////////////////

const getEarRings= async (req, res) => {
    try {
        try {
            const EarRingproducts = await productHelpers.getEarRings_Products();
            // console.log(clothproducts,"here");
            res.render('./admin/adminPanel', { products: EarRingproducts });
          } catch (error) {
            console.log('Failed to get products:', error);
            res.status(500).send('Internal Server Error');
          }  
    }
    catch (error) {
        console.log(error.message);
      }
}

/////////////////////////////////////////////////////////////////////////////////////

const getCategory= async (req, res) => {
  try {
    cName=req.query.category
    const promises = [
      productHelpers.getCategory(cName),
      productHelpers.getAllCategory()
    ];
    
    Promise.all(promises)
    .then(([products,category]) => {
      // console.log(EarRingsProduct);
      res.render('./admin/adminPanel', { products,category });
    })
    .catch((error) => {
      console.log('Failed to retrieve products:', error);
      // Handle error
    });


    
  //   cName=req.query.category
  //   const categoryProducts = await productHelpers.getCategory(cName);
  //  let  products= categoryProducts
  //   res.render('./admin/adminPanel', { products });
  }
  catch (error) {
    console.log('Failed to get products:', error);
            res.status(500).send('Internal Server Error');
  }
}
  

    
/////////////////////////////////////////////////////////////////////////////////////

module.exports={
    getAdminLogin,
    verifyAdmin,
    logOut,
    adminGetProduct,
    adminGetUser,
    adminEditUser,
    adminBlockUser,
    adminUnBlockUser,
    adminDeleteUser,
    adminDeleteProduct,
    adminEditProduct,
    adminAddProductPage,
    adminAddProduct,
    adminAddUserPage,
    adminAddUser,
    getAllUsers,
    getNecklaces,
    getBangles,
    getEarRings,
    getCategory,
    getAllCategory,
    InsertCategory,
    addCategory,
    categoryUnlist,
    categoryRelist,
    editCategoryPage,
    editCategory,
    getAllOrders,
    updateDeliveryStatus,
    getOrderDetails,
    

}