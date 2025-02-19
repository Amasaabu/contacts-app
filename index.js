const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;
const {initializeJSONFile} = require('./services/file');
app.use(express.json());
app.use(cors())

app.use("/api", require('./routes/contacts.routes'));


const startApp=async()=>{
    await initializeJSONFile();
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}


startApp();
