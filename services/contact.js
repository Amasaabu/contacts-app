const fs = require('fs');
const {VALUES} = require("../values")


const saveContact = async (contact) => {
    //read file first
    fs.readFile(VALUES.SAVE_FILE, 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        }
        let parsedData = JSON.parse(data||'[]')
        parsedData.push(contact)

        //write the file
        //now save the contact in json file
        fs.writeFile(VALUES.SAVE_FILE,JSON.stringify(parsedData, null, 2),  (err) => {
        if (err) {
            console.log(err);
        }
    })

    })
}

const getAllContact = async () => {
    //read file and return all contacts
    const data = fs.readFileSync(VALUES.SAVE_FILE, 'utf8');
    return JSON.parse(data || '[]');
}


module.exports = {saveContact, getAllContact}