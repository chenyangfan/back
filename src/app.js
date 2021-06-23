const path = require('path')
const express = require('express')
const hbs = require('hbs')
const multer = require('multer')

const Contact = require('./models/contact')
const Image = require('./models/contactimg')
const auth = require('../src/middleware/auth')
require('./db/mongoose')
const app = express()
console.log(__dirname);

const upload = multer({
    dest: 'images'
})


//use the public directory to access the html, css and javascript.
const publicDirectory = path.join(__dirname,'../public')
console.log(__dirname);
const viewsPath = path.join(__dirname,'/views')
const partialsPath = path.join(__dirname, '../templates/partials')

app.use(express.json())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.set('view engine', 'ejs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.use(express.static(publicDirectory))

app.get('/',(req,res) => {
    res.render('index')
})


app.post('/contacts/:id/profileImage',upload.single('images'),async (req,res) => {
    console.log(req);
   // res.send(req.file.path);
    ///res.send(req.params);
    const image = new Image({
        'contactId':req.params.id,
        'avatar':req.file.filename
    });

    image.save().then( () => {
        res.send(image)
    }).catch ((e) => {
        res.status(400)
        res.send(e)
    })
})


app.get('/contacts/:id/avatar', async (req, res) => {
    try {
        const image = await Image.findOne({contactId: req.params.id});

        if (!image || !image.avatar) {
            throw new Error()
        }
        res.set('Content-Type', 'image/jpg')
        res.sendFile("images/"+image.avatar, options, function (err) {
            if (err) {
                throw new Error()
            } else {
            }
        })
    } catch (e) {
        res.status(404).send()
    }
})








app.delete('/contacts/:id',async (req, res) => {
    const _id = req.params.id

    try {
        const contact = await Contact.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if(!contact) {
            res.status(400).send()
        }
        res.send({success:'deletion operation successfully.'})
    }catch (e) {
        res.status(400).send(e)
    }
})




app.patch('/contact/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['firstName','lastName','email','phoneNumber']
    const isValid = updates.every((update) => allowedUpdates.includes(update))

    if(!isValid){
        return res.status(400).send({error:'Invalid update opeartion'})
    }

    try {
        //const ad = await Ad.findByIdAndUpdate(req.params.id,req.body, {new: true, runValidators: true})
        const contact = await Contact.findOne({_id:req.params.id, owner:req.user._id})
        if(!contact) {
            return res.status(404).send()
        }
        updates.forEach((update) => contact[update]=req.body[update])
        await contact.save()
        res.send(contact)
    } catch (e) {
        res.status(400).send(e);
    }
})

app.post('/contact',async (req, res) => {
    console.log(...req.body)
    const contact = new Contact({
        ...req.body,
    })
    contact.save().then( () => {
        res.send(contact)
    }).catch ((e) => {
        res.status(400)
        res.send(e)
    })
})

app.get('/contacts', (req,res) => {
    Contact.find({}).then( (contacts) => {
        res.send(contacts)
    }).catch( (e) => {
        res.status(500).send(e)
    })
})

app.get('/contacts/:id', (req,res) => {
    const _id = req.params.id
    Contact.find({_id}).then( (contact) => {
        if(!contact) {
            res.status(404).send()
        }
        res.send(contact)
    }).catch( (e) => {
        res.status(500).send(e)
    })
})










 





app.get('*', (req, res) => {
    res.render('404', {
        title:'404',
        name:'ABC def',
        errorMessage:'Page not found'
        
    })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log('Server is running up on port 3000')
})