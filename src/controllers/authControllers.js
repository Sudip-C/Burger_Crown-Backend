const User= require('../models/User');
const generateToken = require('../utils/generateToken');
exports.signup = async (req,res) =>{
    try{
        const {name,email,password,role} = req.body;
        const userExist = await User.findOne({email});
        if(userExist)return res.status(400).json({message:"User already exists"});

        const user = await User.create({name,email,password,role});
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            role:user.role,
            token:generateToken(user)
        })
    }catch(err){
        res.status(500).json({message:err.message})
}
}

exports.login = async (req,res) =>{
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if(!user || !(await user.matchPassword(password)))
            return res.status(401).json({message:"Invalid Credential"})
        res.json({
            _id:user._id,
            name:user.name,
            email:user.email,
            role:user.role,
            token:generateToken(user)
        })
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

exports.getProfile = async (req,res) =>{
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
}

exports.updateProfile = async (req,res) =>{
    const user = await User.findById(req.user.id)
    if (user) {
        user.name = req.body.name || user.name;
        user.phone = req.body.phone || user.phone;
        user.address = req.body.address || user.address;
        if (req.body.password) {
          user.password = req.body.password;
        }
        await user.save();
        res.json({ message: 'Profile updated' });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
}