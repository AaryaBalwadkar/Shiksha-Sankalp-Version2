import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import Message from './model/Message.js';
import channel from './model/Channel.js';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "https://shiksha-sankalp.onrender.com"],
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle joining a channel for messages
    socket.on('join_channel', ({ channelId }) => {
        socket.join(channelId);
        console.log('Channel joined:', channelId);
    });

    // Handle joining a classroom for channel updates
    socket.on('joinClassroom', (classroomId) => {
        const roomName = `classroom:${classroomId}`;
        socket.join(roomName);
        // Debug room membership
        const roomMembers = io.sockets.adapter.rooms.get(roomName);
        console.log('Room', roomName, 'has', roomMembers ? roomMembers.size : 0, 'members');
        console.log('Socket', socket.id, 'is in rooms:', Array.from(socket.rooms));
    });

    // Handle leaving a classroom
    socket.on('leaveClassroom', (classroomId) => {
        socket.leave(`classroom:${classroomId}`);
        console.log('Classroom left:', classroomId);
    });

    // Watch for message changes
    const messageStream = Message.watch();
    messageStream.on('change', (change) => {
        if (change.operationType === 'insert') {
            const newMessage = change.fullDocument;
            io.to(newMessage.channelId).emit('newMessage', newMessage);
            console.log('New message emitted:', newMessage._id);
        }
    });

    // Watch for channel changes
    const channelStream = channel.watch();
    channelStream.on('change', async (change) => {
        try {
            if (change.operationType === 'insert') {
                const newChannel = change.fullDocument;
                // Normalize the data to use consistent naming
                // const normalizedChannel = {
                //     ...newChannel,
                //     classroomId: newChannel.classroomName // Map classroomName to classroomId
                // };
                // io.emit('newChannel', normalizedChannel);
                io.to(`classroom:${newChannel.classroomName}`).emit('newChannel', newChannel);
            } 
            else if (change.operationType === 'delete') {
                const deletedChannelId = change.documentKey._id;
                io.emit('channelDeleted', deletedChannelId);
                console.log('Channel deleted:', deletedChannelId);
            }
            else if (change.operationType === 'update') {
                const updatedChannel = await channel.findById(change.documentKey._id);
                if (updatedChannel) {
                    io.to(`classroom:${updatedChannel.classroomId}`).emit('channelUpdated', updatedChannel);
                    console.log('Channel updated:', updatedChannel._id);
                }
            }
        } catch (error) {
            console.error('Error handling channel change:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

export { app, server, io };