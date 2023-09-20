// routers are used to direct the app fucntion to where they are called hence needed with express routers
const express = require('express');
const router = express.Router();
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator'); // to validate the entries express js package
const getuser = require('../middleware/getuser') // middle ware for fetching user details


const checkForError = (req, res) => {
    const result = validationResult(req);
    return !result.isEmpty();
}


// route 1 : to get the data of notes of the user from the databse Get : / login is required
// http://localhost:5000/api/notes/getallnotes
router.get('/getallnotes', getuser, async (req, res) => {
    let success = false;
    try {
        const userId = req.user.id;
        const notes = await Notes.find({ user: userId });
        obj = {
            notes
        }
        res.json(obj);
    } catch (error) {
        // console.error(error.message);
        res.status(500).send({success, message :"Some error occured"});
    }
});


// route 2 : to set or put the noted of the user into the data base login is required using POST request
// http://localhost:5000/api/notes/addnote

router.post('/addnote', getuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Enter a valid description').isLength({ min: 5 })
], async (req, res) => {
    let success = false;
    // if errors are there then send bad request and do nothing
    if (checkForError(req)) {
        return res.status(400).json({success, error: "please enter the correct entries" });
    }

    try {
        const { title, description, tag } = req.body;
        // if no error then make the note
        const note = await new Notes({
            title, description, tag, user: req.user.id
        });
        const savedNote = note.save();
        res.json(note);
    }
    catch (error) {
        // console.error(error.message);
        res.status(500).send({success , message :"Some error occured"});
    }
});


// route 3 : to update the data of note of the user from the databse post : / login is required
// http://localhost:5000/api/notes//updatenote/:id

router.put('/updatenote/:id', getuser, async (req, res) => {
    let success = false;
    // destructure the req body
    const { title, description, tag } = req.body;
    try {
        // create a new note to be updated
        const newnote = {};
        if (title) { newnote.title = title };
        if (description) { newnote.description = description };
        if (tag) { newnote.tag = tag };
        console.log(newnote);

        // find the note to be updated and update it
        // seq reasons
        let note = await Notes.findById(req.params.id);

        if (!note) {
            return res.status(404).send({success,message : "Not Found"}); // the note didnot found
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send({success , message :"Not Allowed"}); // the person with different user id tried to change the content
        }
        // if all things are fine the update the file or the notes
        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newnote }, { new: true });
        res.json(note);
    }

    catch (error) {
        // console.error(error.message);
        res.status(500).send({success , message :"Some error occured"});
    }
})

// route 4 : to delete the note of the user from the databse post : / login is required
// http://localhost:5000/api/notes//deletenote/:id

router.delete('/deletenote/:id', getuser, async (req, res) => {
    try {
        // get the node from the user
        let note = await Notes.findById(req.params.id);

        if (!note) {
            return res.status(404).send("Not Found"); // the note didnot found
        }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed"); // the person with different user id tried to delete the content
        }

        // if all things are fine the delete the note from the notes
        note = await Notes.findByIdAndDelete(req.params.id);
        res.json(note);
    }
    catch (error) {
        // console.error(error.message);
        res.status(500).send("Some error occured");
    }
})

module.exports = router;