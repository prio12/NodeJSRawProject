//module scaffolding
const handler = {};

handler.sampleHandler = (requestProperties, callback) =>{
    callback(200,{
        message:"This is a sample Json"
    })
}

module.exports = handler;