const PORT = 8080
const express=require("express")
const {Server:HttpServer} = require('http')
const {Server:IOServer}=require('socket.io')

const app= express()
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);



const path= require("path")
app.use(express.static(path.join(__dirname,"public")))
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// parse application/json
app.use(express.json());



const server= httpServer.listen(PORT,()=>{
    console.log("escuchando en puerto " + server.address().port);
})

server.on("error", err=>console.log(err))

let productos =[]
let mensajes =[]
io.on('connection',async (socket)=>{

    console.log('Se conecto un cliente');
    console.log(socket.id);
   
    socket.emit('productos',productos);//mensaje para el cliente que inicio la conexion

    socket.on('nuevo-producto',(d)=>{
        console.log("recibo un nuevo producto");       
        productos.push(d)     
        io.sockets.emit('productos',productos)//mensaje para todos los clientes
    })

    socket.emit('messages',mensajes);//mensaje para el cliente que inicio la conexion

    socket.on('new-message',(d)=>{
        console.log(d);
        mensajes.push(d);
        io.sockets.emit('messages',mensajes)//mensaje para todos los clientes
    })
})


