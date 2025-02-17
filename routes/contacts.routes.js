const router = require('express').Router();
const fs = require('fs');
const {Contact, ContactBuilder} = require('../models/contact');


//save new contact
router.post('/contacts', (req, res) => {
    //verify input

    let contact = new ContactBuilder()
    contact
    .generateId()
    .setEmail(req.body.email)
    .setFirstName(req.body.firstName)
    .setLastName(req.body.lastName)
    .setPhone(req.body.phone).build();


    //ensure the file exists
    if (!fs.existsSync('contacts.json')) {
        fs.writeFileSync('contacts.json', "")
        console.log('file created')
    } else {
        console.log('file exists')
    }


    //read file first
    fs.readFile('contacts.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        }
        let parsedData = JSON.parse(data||'[]')
        console.log(parsedData)
        parsedData.push(contact)

        //write the file
        //now save the contact in json file
        fs.writeFile('contacts.json',JSON.stringify(parsedData, null, 2),  (err) => {
        if (err) {
            console.log(err);
        }
    })

    })
    res.send(contact);
})


//get all contacts
router.get('/contacts', (req, res) => {


})




//delete a contact
router.delete('/contacts/:id', (req, res) => {

})

//update a contact
router.put('/contacts/:id', (req, res) => {

})



module.exports = router;