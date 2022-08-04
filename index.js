const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const contacts = require('./data/contacts')
const meetings = require('./data/meetings')
const contactsArray = contacts.contacts
const meetingsArray = meetings.meetings

const app = express()

app.use(morgan("dev"))
app.use(cors())
app.use(express.json())

const port = 3030
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/`)
})

app.get('/contacts', (req,res) => {

    let mappedContacts = contactsArray.map(contact => {
        return {
            ...contact,
            meetings: meetingsArray.filter(m => m.contactId === contact.id)
        }
    })

    res.json(mappedContacts)
})

app.post('/contacts', (req,res) => {

    const newId = contactsArray.length + 1

    const contact = {...req.body, "id": newId, 
        meetings: meetingsArray.filter(m => m.contactId === newId)
    }

    console.log(contact)

    contactsArray.push(contact)

    res.status(201).json({"contact": contact})
})

app.get('/contacts/:id', (req,res) => {

    const {id} = req.params

    const idAsNumber = Number(id)

    const contact = contactsArray.find(contact => contact.id === idAsNumber);

    const specificContact = {...contact,  
        meetings: meetingsArray.filter(m => m.contactId === contact.id)
    }

    res.json({"contact": specificContact})
})

app.delete('/contacts/:id', (req,res) => {

    const {id} = req.params

    const idAsNumber = Number(id)

    const contactIndex =  contactsArray.findIndex(function (contact) {
        return contact.id === idAsNumber;
    });

    contactsArray.splice(contactIndex, 1)
})

app.put('/contacts/:id', (req,res) => {

    const {id} = req.params

    const idAsNumber = Number(id)

    const contactIndex =  contactsArray.findIndex(function (contact) {
        return contact.id === idAsNumber;
    });

    const oldContact = contactsArray.find(contact => contact.id === idAsNumber);

    const updatedContact = {...req.body,  
        id: oldContact.id
    }

    contactsArray.splice(contactIndex, 1, updatedContact)

    res.status(201).json({"contact": {...updatedContact, 
        meetings: meetingsArray.filter(m => m.contactId === updatedContact.id)
    }})
})

app.get('/contacts/:id/meetings', (req, res) => {

    const {id} = req.params

    const idAsNumber = Number(id)

    const contactMeetings = meetingsArray.filter(m => m.contactId === idAsNumber)

    res.json({"meetings": contactMeetings})
})

app.post('/contacts/:id/meetings', (req, res) => {

    const {id} = req.params

    const idAsNumber = Number(id)

    const newId = meetingsArray.length + 2

    const meeting = {...req.body, "id": newId, 
        "contactId": idAsNumber
    }

    console.log(meeting)

    meetingsArray.push(meeting)

    res.status(201).json({"meeting": meeting})
})

// app.put('/contacts/:id/meetings/:meetingId', (req,res) => {

//     // const {id} = req.params.id

//     // const idAsNumber = Number(id)

//     const {meetingId} = req.params

//     const meetingIdAsNumber = Number(meetingId)

//     const meetingIndex =  meetingsArray.findIndex(function (meeting) {
//         return meeting.contactId === meetingIdAsNumber;
//     });

//     const oldMeeting = meetingsArray.find(meeting => meeting.contactId === meetingIdAsNumber);

//     const updatedMeeting = {...req.body,  
//         "id": oldMeeting.id, "contactId": oldMeeting.contactId
//     }

//     meetingsArray.splice(meetingIndex, 1, updatedMeeting)

//     res.status(201).json({"meeting": updatedMeeting})
// })

app.put('/contacts/:id/meetings/:meetingId', (req,res) => {

    const {id} = req.params

    const idAsNumber = Number(id)

    const {meetingId} = req.params

    const meetingIdAsNumber = Number(meetingId)

    const contactMeetings = []

    for(let i = 0; i < meetingsArray.length; i++) {
        if(meetingsArray[i].contactId === idAsNumber){
            contactMeetings.push(meetingsArray[i])
        }
    }

    const contactMeetingIndex =  contactMeetings.findIndex(function (meeting) {
        return meeting.id === meetingIdAsNumber;
    });

    const meetingIndex =  meetingsArray.findIndex(function (meeting) {
        return meeting.id === meetingIdAsNumber;
    });

    const meetingFromMeetingArray = meetingsArray[meetingIndex]

    console.log(meetingIndex)

    const meetingFromContactMeetings = contactMeetings[contactMeetingIndex]

    if(meetingFromMeetingArray === meetingFromContactMeetings) {

        const updatedMeeting = {...req.body,  
            "id": meetingFromMeetingArray.id, "contactId": meetingFromMeetingArray.contactId
        }
    
        meetingsArray.splice(meetingIndex, 1, updatedMeeting)
    
        res.status(201).json({"meeting": updatedMeeting})
    }
})
