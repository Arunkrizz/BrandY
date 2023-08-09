const productHelpers=require("../helpers/product-helpers")



  const landingPage = async (req, res) => {
    try {
        if(req.session.user){
            res.redirect('/home')
          }
          // Create an array of promises

          const promises = [
            productHelpers.getAllProducts()
            
          ];
        
          // Wait for all promises to resolve
          Promise.all(promises)
            .then(([products]) => {
              // console.log(EarRingsProduct);
              
              res.render('landingPage', {products });
            })
            .catch((error) => {
              console.log('Failed to retrieve products:', error);
              // Handle error
            });
            
    } catch (error) {
      console.log(error.message);
    }
  };
  

  const home=async (req,res)=>{
    try {
        try{
            // if(req.session.user){
            
            const promises = [
              productHelpers.getAllProducts(),
              productHelpers.getAllListedCategory()
            ];
          
            // Wait for all promises to resolve
            Promise.all(promises)
              .then(([products,category]) => {
                // console.log(EarRingsProduct);
                res.render('home', {products,category });
              })
              .catch((error) => {
                console.log('Failed to retrieve products:', error);
                // Handle error
              });
        
          // }
          // else {
          //   res.redirect('/')
          // }
        }
          catch (err) {
            console.log(err);
            console.log("error occured !!!! !here @get home");
            // res.redirect('/login'); // Handle the error, e.g., redirect to the admin panel
          }
    }
    catch (error) {
        console.log(error.message);
      }
}



const getProductDetails=async (req,res)=>{
  
    try {
      // console.log("here /admineditproduct");
      let id=req.params.id
      const product = await productHelpers.getProductById({ _id: id });
      console.log("here /productdetails",product);
      if (!product) {
        // Handle the case when the product is not found
        return res.redirect('/login');
      }
  
      // res.render('productDetailsPage',  { product: product });
      res.render('productDetailsPage',  { product: product });
      // res.render('s1',  { product: product });
    } catch (err) {
      console.log(err);
      res.redirect('/home'); // Handle the error, e.g., redirect to the admin panel
    }
  }

  const getCategoryProduct = async (req, res) => {
    try {
      if(req.session.user){
              
        cName=req.query.category
      const promises = [
        productHelpers.getCategory(cName),
        productHelpers.getAllCategory()
      ];
      
        // Wait for all promises to resolve
        Promise.all(promises)
          .then(([products,category]) => {
            // console.log(EarRingsProduct);
            res.render('home', {products,category });
          })
          .catch((error) => {
            console.log('Failed to retrieve products:', error);
            // Handle error
          });
    
      }
      else {
        res.redirect('/')
      }
    }
    catch (error) {
      console.log(error.message);
    }
  }
  


  module.exports={
    getProductDetails,
    getCategoryProduct, 
  }