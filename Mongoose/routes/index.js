var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('localhost:27017/test');
var jwt = require('jsonwebtoken');
var Schema = mongoose.Schema;


// schema defines how mongoose will write the data to the database.
var userDataSchema = new Schema({
    name: {type:String,required:true},
    emailID:{type:String,unique:true,required:true},
    address:{type:String,required:true},
    phoneNo:{type:String, required:true},
    password:{type:String, required:true}
}, {collection:'users'});

var UserData = mongoose.model('UserData', userDataSchema);

// last part of the URL is the db name to connect to


router.get('/get-data', function(req, resp, next){
   UserData.find()
   .then(function(doc){
        console.log(doc);
    });
});

router.post('/signup',function(req, resp, next){
    console.log('came to insert');

    var item = {
        name : req.body.name,
        emailID:req.body.emailID,
        address:req.body.address,
        phoneNo:req.body.phoneNo,
        password:req.body.password
    };
    // item needs to have the same structure as defined in the schema of the UserData
    var data = new UserData(item);
    data.save(function(err, product, numAffected){
        if(err){
            if(err.code == 11000){
                console.log(err.code);
                resp.json({"status":"failure", "message":"user already exists"})
            }else{
                resp.json({"status":"500", "message":"internal server error"});
            }
            // console.log("error : " + err.description);
        }else{
            // console.log(product);
            resp.json({"status":"200","message":"sign-up success", "userDetails":product});
        }
    });
});


router.post('/login', function(req, resp, next){
    var emailID = req.body.emailID;// hard code the item to update the ID.
    var password = req.body.password;
    UserData.find({emailID:emailID}, function(err, doc){
        if(err){
            console.error('error, no entry found.');
        }
        console.log(doc);
        var user = doc[0];

        if(password == user.password){
            var token = jwt.sign(user,user.emailID, { expiresIn: 1440 });
            resp.json({"status":"200", "message":"login success","token":token,"userDetails":user});
        }else{
            resp.json({"status":"500", "message":"couldn't login in."});
        }

        // doc.username = 'pravit';
        // doc.description = 'this is pravit now';
        // doc.password = 'pavipassword';
        // doc.save();
        // resp.redirect('/');
    });
    // UserData.findById(emailID, );
});

router.post('/logout', function(req, resp, next){
    var id = '59a61f419b43d7523e6f324e';// hard code the item to update the ID.
    UserData.findById(id, function(err, doc){
        if(err){
            console.error('error, no entry found.');
        }
        doc.username = 'pravit';
        doc.description = 'this is pravit now';
        doc.password = 'pavipassword';
        doc.save();
        resp.redirect('/');
    });
});

router.post('/delete', function(req, resp, next){
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

module.exports = router;
