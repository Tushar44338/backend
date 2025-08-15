//Promise method
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).reject((err) => next(err))
    }
}



// try catch method
// const asyncHandler = (func) => async (req, res, next) => {
//     try{
//         await func(req, res, next)
//     } catch(error){
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message 
//         })
//     }
// }



export {asyncHandler}