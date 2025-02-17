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


//get a contact by firstName
router.get('/contacts/firstname/:firstName', async(req, res) => {
    const firstName = req.params.firstName;
    try {
        let contacts = await getAllContact();
        let contact = contacts.filter(c => c.firstName === firstName);
        if (contact.length === 0) {
            res.status(404).send({message: 'Contact not found'});
        } else {
            res.send(contact);
        }
    } catch (error) {
        res.status(500).send('Error getting contact')
    }
})

//get contact by lastname
router.get('/contacts/lastname/:lastName', async(req, res) => {
    const lastName = req.params.lastName;
    try {
        let contacts = await getAllContact();
        let contact = contacts.filter(c => c.lastName === lastName);
        if (contact.length === 0) {
            res.status(404).send({message: 'Contact not found'});
        } else {
            res.send(contact);
        }
    } catch (error) {
        res.status(500).send('Error getting contact')
    }
})

//get contact by id
router.get('/contacts/id/:id', async(req, res) => {
    const id = req.params.id;
    try {
        let contacts = await getAllContact();
        let contact = contacts.filter(c => c.id === id);
        if (contact.length === 0) {
            res.status(404).send('Contact not found');
        } else {
            res.send(contact);
        }
    } catch (error) {
        res.status(500).send('Error getting contact')
    }
})

//delete a contact
router.delete('/contacts/:id', (req, res) => {

})

//update a contact
router.put('/contacts/:id', (req, res) => {

})



module.exports = router;