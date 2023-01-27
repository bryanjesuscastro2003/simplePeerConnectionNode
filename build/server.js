"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var http_1 = require("http");
var uuid_1 = require("uuid");
var socket_io_1 = require("socket.io");
var peer_1 = require("peer");
var app = (0, express_1.default)();
var httpServer = (0, http_1.createServer)(app);
var io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
    },
});
var peerServer = (0, peer_1.ExpressPeerServer)(httpServer, {});
app.set('view engine', 'ejs');
app.use(express_1.default.static('public'));
app.get('/', function (req, res) {
    res.redirect("/".concat((0, uuid_1.v4)()));
});
app.use("/peerjs", peerServer);
app.get('/:room', function (req, res) {
    res.render('room', { roomId: req.params.room });
});
io.on("connection", function (socket) {
    socket.on("join-room", function (data) {
        socket.join(data.ROOM_ID);
        socket.to(data.ROOM_ID).emit('user-connected', data.userId);
        socket.on("message", function (message) {
            io.to(data.ROOM_ID).emit("createMessage", message);
        });
    });
});
httpServer.listen(3000, function () { return console.log("Server running on port 3000"); });
