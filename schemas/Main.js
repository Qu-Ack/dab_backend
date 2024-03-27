const mongoose = require('mongoose')

const Schema = mongoose.Schema;


const mainSchema = new Schema({
    DAB: {type:Number},
    DABP: {type:Number},
    expense:{type:Number},
    data:{type:Date, default: new Date()}
})


module.exports = mongoose.model('Main', mainSchema)