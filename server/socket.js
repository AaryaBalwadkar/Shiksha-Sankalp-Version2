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
        socket.join(`classroom:${classroomId}`);
        console.log('Classroom joined:', classroomId);
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
                io.to(`classroom:${newChannel.classroomId}`).emit('newChannel', newChannel);
                console.log('New channel emitted:', newChannel._id);
            } 
            else if (change.operationType === 'delete') {
                const deletedChannelId = change.documentKey._id;
                io.emit('channelDeleted', deletedChannelId);
                console.log('Channel deleted:', deletedChannelId);
            }
            else if (change.operationType === 'update') {
                const updatedChannel = await Channel.findById(change.documentKey._id);
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