
const connectDB = require("../config/connection");
const Product = require('../models/product');
const Category = require('../models/category');
// const collection=require('../config/collections');

module.exports = {

  changeProductCategoryName:(prevName,newName)=>{
    return new Promise((resolve,reject)=>{
      connectDB()
      .then(()=>{
        Product.updateMany({Category:prevName},{$set:{Category:newName}})
        .then(()=>{
          console.log("product category updated");
          resolve()
        })
        .catch((error)=>{
          console.log("error in product category updation :",error);
          reject(error)
        })
      })
    })
  },




  changeCategoryName:(prevName,newName)=>{
    return new Promise((resolve,reject)=>{
      connectDB().
      then(()=>{
        Category.updateOne({Category:prevName},{$set:{Category:newName}})
        .then(()=>{
          console.log("category edit succeeded");
          resolve()
        })
        .catch((error)=>{
          console.log("category edit failed:",error);
          reject(error)
        })
      })
    })
  },
  
  UndeleteCategoryProducts: (catName) => {
    return new Promise((resolve, reject) => {
      connectDB()
        .then(() => {
          Product.updateMany( catName, { $set: { Deleted:false } }
          )
            .then((updatedList) => {
              if (updatedList) {
                // If product updated successfully, resolve the promise with the updated product
                resolve(updatedList);
              } else {
                // If no product found with the given ID, resolve the promise with null
                resolve(null);
              }
            })
            .catch((error) => {
              // Handle the error
              console.log('Failed to update product:', error);
              reject(error);
            });
        })
        .catch((error) => {
          // Handle the error
          console.log('Failed to connect to the database:', error);
          reject(error);
        });
    });
  },



  deleteCategoryProducts: (catName) => {
    return new Promise((resolve, reject) => {
      connectDB()
        .then(() => {
          Product.updateMany( catName, { $set: { Deleted:true } }
          )
            .then((updatedList) => {
              if (updatedList) {
                // If product updated successfully, resolve the promise with the updated product
                resolve(updatedList);
              } else {
                // If no product found with the given ID, resolve the promise with null
                resolve(null);
              }
            })
            .catch((error) => {
              // Handle the error
              console.log('Failed to update product:', error);
              reject(error);
            });
        })
        .catch((error) => {
          // Handle the error
          console.log('Failed to connect to the database:', error);
          reject(error);
        });
    });
  },



  categoryRelist: (catId) => {
    return new Promise((resolve, reject) => {
      connectDB()
        .then(() => {
          Category.findByIdAndUpdate(catId, { Listed:true }, { new: true })
            .then((updatedList) => {
              if (updatedList) {
                // If product updated successfully, resolve the promise with the updated product
                resolve(updatedList);
              } else {
                // If no product found with the given ID, resolve the promise with null
                resolve(null);
              }
            })
            .catch((error) => {
              // Handle the error
              console.log('Failed to update product:', error);
              reject(error);
            });
        })
        .catch((error) => {
          // Handle the error
          console.log('Failed to connect to the database:', error);
          reject(error);
        });
    });
  },


  categoryUnlist: (catId) => {
    return new Promise((resolve, reject) => {
      connectDB()
        .then(() => {
          Category.findByIdAndUpdate(catId, { Listed:false }, { new: true })
            .then((updatedList) => {
              if (updatedList) {
                // If product updated successfully, resolve the promise with the updated product
                resolve(updatedList);
              } else {
                // If no product found with the given ID, resolve the promise with null
                resolve(null);
              }
            })
            .catch((error) => {
              // Handle the error
              console.log('Failed to update product:', error);
              reject(error);
            });
        })
        .catch((error) => {
          // Handle the error
          console.log('Failed to connect to the database:', error);
          reject(error);
        });
    });
  },



  getcategoryById:(_id)=> {
    return new Promise((resolve, reject) => {
      connectDB().then(() => {
      Category.findById(_id)
        .then((category) => {
          if (category) {
            // If product found, resolve the promise with the product
            resolve(category);
          } else {
            // If no product found with the given ID, resolve the promise with null
            resolve(null);
          }
        })
        .catch((error) => {
          // Handle the error
          console.log('Failed to retrieve category:', error);
          reject(error);
        });
      });
    });
  },

  addCategory: (cName) => {
    console.log(cName,"//here p-c addcategory");
    return new Promise((resolve, reject) => {
      
      connectDB().then(() => {
        Category.create(cName)
          .then(() => {
            resolve();
          })
          .catch((error) => {
            console.log('Failed to get products:', error);
            reject(error);
          });
      });
    });
  },

  getAllListedCategory: () => {
    return new Promise((resolve, reject) => {
      console.log("// p-c get all category ");
      connectDB().then(() => {
        Category.find({ Listed: true })
          .then((category) => {
            resolve(category);
          })
          .catch((error) => {
            console.log('Failed to get products:', error);
            reject(error);
          });
      });
    });
  },

  getAllCategory: () => {
    return new Promise((resolve, reject) => {
      console.log("// p-c get all category ");
      connectDB().then(() => {
        Category.find()
          .then((category) => {
            resolve(category);
          })
          .catch((error) => {
            console.log('Failed to get products:', error);
            reject(error);
          });
      });
    });
  },

  addProduct: (product, callback) => {
    console.log(product);
    connectDB().then(() => {
      Product.create(product)
        .then((data) => {
          console.log(data);
          callback(data._id);
        })
        .catch((error) => {
          console.log('Failed to add product:', error);
          callback(false);
        });
    });
  },

  // getAllProducts: (callback) => {
  //   connectDB().then(() => {
  //     Product.find({ Deleted: false })
  //       .then((products) => {
  //         callback(products);
  //       })
  //       .catch((error) => {
  //         console.log('Failed to get products:', error);
  //         callback(null);
  //       });
  //   });
  // },
 getAllProducts :() => {
    return new Promise((resolve, reject) => {
      connectDB()
        .then(() => {
          Product.find({ Deleted: false })
            .then((products) => {
              resolve(products);
            })
            .catch((error) => {
              console.log('Failed to get products:', error);
              reject(error);
            });
        })
        .catch((error) => {
          console.log('Failed to connect to the database:', error);
          reject(error);
        });
    });
  },
  
  


  // Query products with category "Electronics"
getNecklace_Products: () => {
  return new Promise((resolve, reject) => {
    connectDB().then(() => {
      Product.find({ Category: 'Necklace',Deleted: false })
        .then((eproducts) => {
          resolve(eproducts);
        })
        .catch((error) => {
          console.log('Failed to get products:', error);
          reject(error);
        });
    });
  });
},

// Query products with category "Clothes"
getBangles_Products: () => {
  return new Promise((resolve, reject) => {
    connectDB().then(() => {
      Product.find({ Category: 'Bangles',Deleted: false })
        .then((clothproducts) => {
          resolve(clothproducts);
        })
        .catch((error) => {
          console.log('Failed to get products:', error);
          reject(error);
        });
    });
  });
},

// Query products with category "Jewellery"
getEarRings_Products: () => {
  return new Promise((resolve, reject) => {
    connectDB().then(() => {
      Product.find({ Category: 'EarRings',Deleted: false })
        .then((EarRingsproducts) => {
          resolve(EarRingsproducts);
        })
        .catch((error) => {
          console.log('Failed to get products:', error);
          reject(error);
        });
    });
  });
},

getCategory: (cName) => {
  return new Promise((resolve, reject) => {
    connectDB().then(() => {
      Product.find({ Category: cName })
        .then((cProducts) => {
          resolve(cProducts);
        })
        .catch((error) => {
          console.log('Failed to get products:', error);
          reject(error);
        });
    });
  });
},

// Function to find a single product by ID
getProductById:(_id)=> {
  return new Promise((resolve, reject) => {
    connectDB().then(() => {
    Product.findById(_id)
      .then((product) => {
        if (product) {
          // If product found, resolve the promise with the product
          resolve(product);
        } else {
          // If no product found with the given ID, resolve the promise with null
          resolve(null);
        }
      })
      .catch((error) => {
        // Handle the error
        console.log('Failed to retrieve product:', error);
        reject(error);
      });
    });
  });
},

updateProduct: (proId, proDetails) => { 
  return new Promise((resolve, reject) => {
    connectDB()
      .then(() => {
        // console.log(proDetails,"p-h upd pro");
        Product.findByIdAndUpdate(proId, proDetails, { new: true })
          .then((updatedProduct) => {
            if (updatedProduct) {
              // If product updated successfully, resolve the promise with the updated product
              resolve(updatedProduct);
            } else {
              // If no product found with the given ID, resolve the promise with null
              resolve(null);
            }
          })
          .catch((error) => {
            // Handle the error
            console.log('Failed to update product:', error);
            reject(error);
          });
      })
      .catch((error) => {
        // Handle the error
        console.log('Failed to connect to the database:', error);
        reject(error);
      });
  });
},

softDeleteProduct: (proId) => {
  return new Promise((resolve, reject) => {
    connectDB()
      .then(() => {
        Product.findByIdAndUpdate(proId, { Deleted:true }, { new: true })
          .then((updatedProduct) => {
            if (updatedProduct) {
              // If product updated successfully, resolve the promise with the updated product
              resolve(updatedProduct);
            } else {
              // If no product found with the given ID, resolve the promise with null
              resolve(null);
            }
          })
          .catch((error) => {
            // Handle the error
            console.log('Failed to update product:', error);
            reject(error);
          });
      })
      .catch((error) => {
        // Handle the error
        console.log('Failed to connect to the database:', error);
        reject(error);
      });
  });
},






// deleteProductById: (_id) => {
//   return new Promise((resolve, reject) => {
//     connectDB().then(() => {
//       Product.findByIdAndDelete(_id)
//         .then((deletedProduct) => {
//           if (deletedProduct) {
//             // If product deleted successfully, resolve the promise with the deleted product
//             resolve(deletedProduct);
//           } else {
//             // If no product found with the given ID, resolve the promise with null
//             resolve(null);
//           }
//         })
//         .catch((error) => {
//           // Handle the error
//           console.log('Failed to delete product:', error);
//           reject(error);
//         });
//     });
//   });
// },





};

