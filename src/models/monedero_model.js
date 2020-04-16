const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
mongoose.set('useCreateIndex', true);

const monederoSchema = mongoose.Schema({
    Historial: {type:Array},
    cantidad:{type:Number},
    userId:{type:String},
    delateAt: {type:Date}
},{
    timestamps: true
});

monederoSchema.plugin(validator);

module.exports = mongoose.model("monedero", monederoSchema);
