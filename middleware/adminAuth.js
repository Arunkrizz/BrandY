const isLogin=(req,res,next)=>{
    try {
        if(req.session.admin){
            // res.redirect('/admin')
            next()
        }
        // next()
    } catch (error) {
        console.log(error);
    }
} 

const isLogout=(req,res,next)=>{
    try {
        if(!req.session.admin){
            res.redirect('/admin')   
        }
        next()
    } catch (error) {
        console.log(error);
    }
}

module.exports={
    isLogin,
    isLogout,

}