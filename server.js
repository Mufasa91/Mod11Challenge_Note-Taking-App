const PORT = process.env.PORT || 3000;
const fs = require('fs');
const path = require('path');

const express = require('express');
const app = express();

const allNotes = require('./db/db.json');


// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// API endpoint to retrieve all notes except the first one
app.get('/api/notes', (req, res) => {
    res.json(allNotes.slice(1));
});

// Default route, serves the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// Route to serve the notes.html file
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// Catch-all route, serves the index.html file for any other route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// Function to create a new note
function createNewNote(body, notesArray) {
    const newNote = body;
    if (!Array.isArray(notesArray))
        notesArray = [];
    
    // If notesArray is empty, add a default element at index 0
    if (notesArray.length === 0)
        notesArray.push(0);

    body.id = notesArray[0];
    notesArray[0]++;

    notesArray.push(newNote);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notesArray, null, 2)
    );
    return newNote;
}

// API endpoint to handle the creation of a new note
app.post('/api/notes', (req, res) => {
    const newNote = createNewNote(req.body, allNotes);
    res.json(newNote);
});

// Function to delete a note by its id
function deleteNote(id, notesArray) {
    for (let i = 0; i < notesArray.length; i++) {
        let note = notesArray[i];

        if (note.id == id) {
            notesArray.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(notesArray, null, 2)
            );

            break;
        }
    }
}

// API endpoint to handle the deletion of a note by its id
app.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id, allNotes);
    res.json(true);
});

// Start the server
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});
