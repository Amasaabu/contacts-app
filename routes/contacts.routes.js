const router = require('express').Router();
const {ContactBuilder} = require('../models/contact');
const {saveContact, getAllContact} = require('../services/contact');

//save new contact
router.post('/contacts', async(req, res) => {
    //verify input
    let contact = new ContactBuilder()
    contact
    .generateId()
    .setEmail(req.body.email)
    .setFirstName(req.body.firstName)
    .setLastName(req.body.lastName)
    .setPhone(req.body.phone).build();
    
    await saveContact(contact);
    res.send(contact);
})


//get all contacts
router.get('/contacts', async(req, res) => {
    try {
       let contacts =  await getAllContact()
       res.send(contacts)
    } catch (error) {
        console.log(error)
        res.status(500).send('Error getting contacts')
    }

})




//delete a contact
router.delete('/contacts/:id', (req, res) => {

})

//update a contact
router.put('/contacts/:id', (req, res) => {

})



module.exports = router;