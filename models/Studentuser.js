const mongoose= require('mongoose')
const bcrypt = require('bcrypt')
const {Schema}= require('mongoose') 

const StudentuserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'is required']
    },
    email:{
        type: String,
        required: [true, 'is required'],
        unique: true,
        index: true,
        validate: {
            validator: function(str){
              return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(str);
            },
            message: props => `${props.value} is not a valid email`
          }
    },
    
    password:{
        type: String,
        required: [ true, 'is required']
    },
    isAdmin: {
        type: Boolean,
        default: false
    } ,
    cart:{
        type: Object,
        default: {
            total: 0,
            count: 0
        }
    },
    notifications: {
        type: Array,
        default:[]
    },

    orders: [{ type: Schema.Types.ObjectId, ref: 'Orders'}]

}, {minimize: false});

StudentuserSchema.statics.findByCredentials = async function(email, password){
    const user =  await Studentuser.findOne({email});
    if(!user) throw new Error('invalid password');
    const isSamePassword = bcrypt.compareSync(password, user.password);
    if(isSamePassword) return user;
    throw new Error('invalid credentiasl')
}   

StudentuserSchema.methods.toJSON = function(){
    const user = this;
    const userObject= user.toObject();
    delete userObject.password;
    return userObject;
}




//hash pass before saving

StudentuserSchema.pre('save', function(next){
    const user = this;
    if(!user.isModified('password')) return next();

        bcrypt.genSalt(10, function(err, salt){
            if(err) return next(err);

            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err);

                user.password= hash;
                next();
            })

        })

})

StudentuserSchema.pre('remove', function(next){
    this.model('Order').remove({owner: this._id}, next);

})




const Studentuser = mongoose.model('Studentuser', StudentuserSchema) ;

module.exports = Studentuser;