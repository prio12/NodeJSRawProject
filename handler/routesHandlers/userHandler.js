//module scaffolding
const handler = {};

handler.userHandler = (requestProperties, callback) =>{
    callback(200,{
        message:"This is a sample Json"
    })
}

module.exports = handler;