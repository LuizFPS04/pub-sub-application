import app from './app'
import http from 'http';
import { initSocket } from './events/eventEmitter';

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

initSocket(server);

app.get('/', (req, res) => {
    res.send(`Football API is running...`);
});

server.listen(PORT, () => {
    console.log(`🚀 Server is running on PORT ${PORT}`);
});
