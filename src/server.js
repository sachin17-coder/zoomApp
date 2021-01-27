const express = require('express');
const app = express();
const server = require('http').Server(app)
const port = process.env.PORT || 3000
const { v4: uuidv4 } = require('uuid')
const io = require('socket.io')(server)
const { ExpressPeerServer } = require('peer')
const peerServer = ExpressPeerServer(server, {
    debug: true
})


const path = require('path')
const public_path = path.join(__dirname, '../public')
app.set('view engine', 'hbs')
app.use('/peerjs', peerServer)
app.use(express.static(public_path))

app.get('/', (req,res) => {

    res.redirect(`/${uuidv4()}`)
})
app.get('/:room', (req, res)=>{
    res.render('room', {roomId : req.params.room})
})

io.on('connection', socket => {
    socket.on('join-user', (roomId, userId) =>{
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', userId)
        console.log(roomId, userId)
        socket.on('message', message =>{
            socket.to(roomId).broadcast.emit('create-message', message)
        })
    })
})
server.listen(port)
