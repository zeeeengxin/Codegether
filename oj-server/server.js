const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const io = require('socket.io')();
const editorSocketService = require('./services/editorSocketService')(io);

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/codegether');

const problemsRouter = require('./routes/problems');
const indexRouter = require('./routes/index');

app.use(express.static(path.join(__dirname, '../public/')));
app.use('/', indexRouter);
app.use('/api/v1/problems', problemsRouter);

app.use((req, res) => {
    res.sendFile('index.html', {root: path.join(__dirname, '../public/')});
});

// app.listen(3000, () => console.log('Server started ...'));

const server = http.createServer(app);
io.attach(server);
server.listen(6000, () => {
    console.log('Server started...');
});


