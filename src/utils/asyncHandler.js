const asyncHandler = (requestHandler)=>{
    return (req,res,next)=>{
    Promise.resolve( requestHandler(req,res,next))
        .catch((error)=>{
            console.log("Error in async handler fn !!",error);
            next(error);
        })
    }
}


export {asyncHandler};







/*
all version
const asyncHandler = ()=>{}
const asyncHandler = (fn)=>{async()=>{}}
const asyncHandler = (fn)=> async () => {}

const asyncHandler = (fn) => async (req,res,next) =>{
    try {
         await fn(req,res,next)
    } catch (error) {
        res.status(error.code || 400).json({
            success:false,
            message:error.message
        })
        
    }
}




*/