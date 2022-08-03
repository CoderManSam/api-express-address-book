const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const contacts = require('./data/contacts')
const contactsArray = contacts.contacts

const app = express()

app.use(morgan("dev"))
app.use(cors())
app.use(express.json())

const port = 3030
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/`)
})

app.get('/contacts', (req,res) => {

    res.status(200).send(contacts)
})

app.post('/contacts', (req,res) => {

    const newId = contactsArray.length + 1

    const contact = {...req.body, "id": newId}

    console.log(contact)

    contactsArray.push(contact)

    res.status(201).send(contacts)
})

app.get('/contacts/:id', (req,res) => {

    const {id} = req.params

    const idAsNumber = Number(id)

    const specificContact = contactsArray.find(contact => contact.id === idAsNumber);

    res.status(200).send(specificContact)
})
