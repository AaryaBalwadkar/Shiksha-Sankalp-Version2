import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import exp from 'constants';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "https://shiksha-sankalp.onrender.com"],
        credentials: true
    }
});

export function getReceiverSocketId(userId) {
    return userSocketMap(userId);
}

// used to store online users
const userSocketMap = {};  // {userId: socketId}

io.on('connection', (socket) => {
    console.log(`a user connected: ${socket.id}`);

    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;

    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    // Join a classroom room
    socket.on("joinClassroom", (classroomId) => {
        if (classroomId) {
            socket.join(classroomId);
            io.in(classroomId)
                .fetchSockets()
                .then((sockets) => {
                    console.log(
                        `Sockets in classroom ${classroomId}:`,
                        sockets.map((s) => s.id)
                    );
                })
                .catch((err) => {
                    console.error(`Error fetching sockets for classroom ${classroomId}:`, err);
                });
        }
    });

    // Leave a classroom room
    socket.on("leaveClassroom", (classroomId) => {
        if (classroomId) {
            socket.leave(classroomId);
            console.log(`Socket ${socket.id} left classroom ${classroomId}`);
        }
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        delete userSocketMap[userId];
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
});

export { io, app, server };

