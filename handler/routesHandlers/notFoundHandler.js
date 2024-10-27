const handler = {};

handler.notFoundHandler = (requestProperties, callback) =>{
    callback(404,{
        message:"sorry your requested route is not available!!"
    })
}

module.exports = handler;