import express, {Request, Response} from "express"
import { createServer } from "http";
import {v4 as uuidV4} from "uuid"
import {Server, Socket} from "socket.io"
import { ExpressPeerServer } from "peer";


const app = express()
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});
const peerServer = ExpressPeerServer(httpServer, {})

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req : Request, res : Response) => {
    res.redirect(`/${uuidV4()}`)
  })
  
app.use("/peerjs", peerServer)

  app.get('/:room', (req : Request, res : Response) => {
    res.render('room', { roomId: req.params.room })
  })
  

io.on("connection", (socket : Socket) => {
    socket.on("join-room", (data : {ROOM_ID : string | string[], userId : string | string[]}) => {
          socket.join(data.ROOM_ID)
          socket.to(data.ROOM_ID).emit('user-connected', data.userId);
          socket.on("message", message => {
                io.to(data.ROOM_ID).emit("createMessage", message)
          })
    })
})


httpServer.listen(3000, () => console.log("Server running on port 3000"))