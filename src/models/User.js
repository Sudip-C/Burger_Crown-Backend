const { default: mongoose } = require("mongoose");
const bcrypt = require("bcryptjs")
const userSchema = new mongoose.Schema({
    name:String,
    email:{type:String,unique:true},
    password:String,
    role:{type:String,enum:['customer','admin','delivery'],default:'customer'},
    phone:String,
    address:String,
},{timestamps:true})



//Hash password

userSchema.pre('save', async function (next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

// Password matching
userSchema.methods.matchPassword = function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
  };

module.exports = mongoose.model("BUser",userSchema)