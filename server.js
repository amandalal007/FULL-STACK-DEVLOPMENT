const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const EventEmitter = require('events');

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'demon',
    database: 'music_streaming'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// ----------------- Music Event Emitter -----------------
class MusicEmitter extends EventEmitter {}
const musicEmitter = new MusicEmitter();

// Log when new event listeners are added (domain-specific)
musicEmitter.on('newListener', (event, listener) => {
    console.log(`New music event listener added for event: ${event}`);
});

// One-time listener for when the first song is added
musicEmitter.once('songAdded', (songTitle) => {
    console.log(`First song added to the library: ${songTitle}`);
});

// Regular listener for any song added event
musicEmitter.on('songAdded', (songTitle) => {
    console.log(`Song added to library: ${songTitle}`);
});

// Listener for when a song is played
musicEmitter.on('songPlayed', (songTitle) => {
    console.log(`Song played: ${songTitle}`);
});
// -------------------------------------------------------

// API Endpoints

app.post('/addSong', (req, res) => {
    const song = req.body;
    const sql = 'INSERT INTO Songs SET ?';
    db.query(sql, song, (err, result) => {
        if (err) {
            console.error('Error adding song:', err);
            return res.status(500).send('Error adding song');
        }
        res.send('Song added successfully');

        // Emit a custom event when a song is added.
        // This will fire the one-time listener (if it’s the first song) and the regular listener.
        musicEmitter.emit('songAdded', song.title);
    });
});

app.put('/editSong/:id', (req, res) => {
    const newSong = req.body;
    const songId = req.params.id;
    const sql = 'UPDATE Songs SET ? WHERE song_id = ?';
    db.query(sql, [newSong, songId], (err, result) => {
        if (err) {
            console.error('Error updating song:', err);
            return res.status(500).send('Error updating song');
        }
        res.send('Song updated successfully');
    });
});

app.delete('/deleteSong/:id', (req, res) => {
    const songId = req.params.id;
    const sql = 'DELETE FROM Songs WHERE song_id = ?';
    db.query(sql, [songId], (err, result) => {
        if (err) {
            console.error('Error deleting song:', err);
            return res.status(500).send('Error deleting song');
        }
        res.send('Song deleted successfully');
    });
});

app.get('/searchSongs', (req, res) => {
    const keyword = req.query.keyword;
    const sql = 'SELECT * FROM Songs WHERE title LIKE ?';
    db.query(sql, [`%${keyword}%`], (err, results) => {
        if (err) {
            console.error('Error searching songs:', err);
            return res.status(500).send('Error searching songs');
        }
        res.json(results);
    });
});

app.get('/songs', (req, res) => {
    const sql = 'SELECT * FROM Songs';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error retrieving songs:', err);
            return res.status(500).send('Error retrieving songs');
        }
        res.json(results);
    });
});

// For demonstration, add an endpoint to simulate playing a song.
app.get('/playSong/:title', (req, res) => {
    const songTitle = req.params.title;
    // In a real app, you might do more logic here.
    musicEmitter.emit('songPlayed', songTitle);
    res.send(`Playing song: ${songTitle}`);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
