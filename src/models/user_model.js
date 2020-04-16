const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
mongoose.set('useCreateIndex', true);

const usuarioSchema = mongoose.Schema({
    user:{type:String, required: true, unique: true},
    name:{type:String},
    lastname:{type:String},
    email:{type:String, require: true, unique: true},
    password:{type:String, required: true},
    celnumber:{type:String, unique: true, require:false},
    lastSession: {type:Date, default:new Date()},
    delateAt: {type:Date}
},{
    timestamps: true
});

usuarioSchema.plugin(validator);

module.exports = mongoose.model("users", usuarioSchema);