const redisClient = require('../modules/redisClient');
const TIMEOUT_IN_SECONDS = 3600;

module.exports = function(io) {
    // collaboration sessions
    const collaborations = {};
    // map from socketId to sessionid
    const sessionPath = '/temp_sessions/';
    const socketIdToSessionId = {};
    
    io.on('connection', (socket) => {
        const sessionId = socket.handshake.query['sessionId'];

        socketIdToSessionId[socket.id] = sessionId;
        console.log("new connect, socket.id is "+ socket.id);
        
        if (sessionId in collaborations) {
            collaborations[sessionId]['participants'].push(socket.id);
        } else {
            redisClient.get(sessionPath + sessionId, data => {
                if (data) {
                    console.log('session terminated previously, pulling back from redis');
                    collaborations[sessionId] = {
                        'cachaedInstructions': JSON.parse(data),
                        'participants': []
                    }
                } else {
                    console.log('no previous redis session');
                    collaborations[sessionId] = {
                        'cachaedInstructions': [],
                        'participants': []
                    }
                }
                collaborations[sessionId]['participants'].push(socket.id);
            });
        }

        socket.on('change', delta => {
            const sessionId = socketIdToSessionId[socket.id];
            if (sessionId in collaborations) {
                collaborations[sessionId]['cachaedInstructions'].push(['change', delta, Date.now()]);
                const participants = collaborations[sessionId]['participants'];
                for (let participant of participants) {
                    if (socket.id !== participant) {
                        io.to(participant).emit('change', delta);
                    }
                }
            } else {
                console.error('editorSocketService error');
            }
        });
        
        socket.on('restoreBuffer', () => {
            const sessionId = socketIdToSessionId[socket.id];
            if (sessionId in collaborations) {
                const instructions = collaborations[sessionId]['cachaedInstructions'];
                for (let instruction of instructions) {
                    socket.emit(instruction[0], instruction[1]);
                }
            }
        });

        socket.on('disconnect', () => {
            const sessionId = socketIdToSessionId[socket.id];
            let foundAndRemove = false;
            console.log("try to disconnect");
            if (sessionId in collaborations) {
                const participants = collaborations[sessionId]['participants'];
                const index = participants.indexOf(socket.id);
                if (index >= 0) {
                    participants.splice(index, 1);
                    foundAndRemove = true;
                    if (participants.length === 0) {
                        console.log('remove the last participant, save content in redis');
                        const key = sessionPath + sessionId;
                        const value = JSON.stringify(collaborations[sessionId]['cachaedInstructions']);
                        redisClient.set(key, value, redisClient.redisPrint);
                        redisClient.expire(key, TIMEOUT_IN_SECONDS);
                        delete collaborations[sessionId];
                    }
                }
            }
            if (!foundAndRemove) {
                console.error('warning: not disconnect user properly');
            }
        });
    });
    
}
