import express, { Express, Request, Response } from 'express';
import * as http from 'http';
import next, { NextApiHandler } from 'next';
import * as socketio from 'socket.io';
import adminSocket from './admin';

const port: number = parseInt(process.env.PORT || '3000', 10);
const dev: boolean = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler: NextApiHandler = nextApp.getRequestHandler();

interface User {
    id: string;
    userName: string;
    connectionTime: string;
}
nextApp.prepare().then(async() => {
    const app: Express = express();
    const server: http.Server = http.createServer(app);
    const io: socketio.Server = new socketio.Server();
    io.attach(server);

    app.get('/hello', async (_: Request, res: Response) => {
        res.send('Hello World')
    });

    let users : User[] = [];

    io.on("connection", (socket) => {
    
        socket.on("login", (userName) => {
            const minutes = new Date().getMinutes();
            users.push({ id: socket.id, userName: userName, connectionTime: new Date().getHours() + ":" + (minutes < 10 ? "0" + minutes : minutes) });
            socket.emit("connecteduser", JSON.stringify(users[users.length - 1]));
            io.emit("users", JSON.stringify(users));
            io.emit("getMsg",
                JSON.stringify({
                    id: socket.id,
                    userName: "SYSTEM",
                    msg: userName + " was joined!",
                    time: new Date().getHours() + ":" + (minutes < 10 ? "0" + minutes : minutes)
                }));
        });
    
        socket.on("sendMsg", (msgTo) => {
            msgTo = JSON.parse(msgTo);
            const minutes = new Date().getMinutes();
            io.emit("getMsg",
                JSON.stringify({
                    id: socket.id,
                    userName: users.find(e => e.id == msgTo.id)?.userName,
                    msg: msgTo.msg,
                    time: new Date().getHours() + ":" + (minutes < 10 ? "0" + minutes : minutes)
                }));
        });
    
        socket.once("disconnect", () => {
            let index = -1;
            if (users.length >= 0) {
                index = users.findIndex(e => e.id == socket.id);
            }
            if (index >= 0)
                users.splice(index, 1);
            io.emit("users", JSON.stringify(users));
        });

        adminSocket(io, socket);
    });
    
    app.all('*', (req: any, res: any) => nextHandler(req, res));

    server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
    });
});