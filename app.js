//init
const express = require('express')
const app=express()
let PORT = process.env.PORT || 3000
const server = app.listen(PORT,function () {
    let port = PORT
    let host = server.address().address
    console.log("Example app listening at http://%s:%s", host, port)

})

//route
app.use('/',express.static('page'))
//websocket
const socketio=require('socket.io')
var io= socketio(server);
io.on('connection',(socket)=>{
	socket.on('start',(data)=>{
		//let np=new Physic.rect(socket.id,0,0,50,50,100,new vec2(0.5,0.5))
		let np=new Physic.ball(socket.id,0,0,50,100,new vec2(0.5,0.5))
		players.push(np)
		objs.push(np)
		world.add(np)
		socket.emit('init',{id:socket.id})

	})
	socket.on('update',(data)=>{
		data=JSON.parse(data)
		let obj=find_obj_by_id(socket.id)
		if(data.position){
			obj.position.add_in(data.position)
		}
		if(data.velocity){
			obj.velocity.add_in(data.velocity)
		}
	})
	socket.on('disconnect',(reason)=>{
		console.log(reason)
		for(let i=0;i<objs.length;i++){
            if(objs[i].id===socket.id){
				world.delete(objs[i])
                objs.splice(i,1)
            }
        }
	})
})
//Game
let fps=50
let objs=[]
let things=[]
let players=[]
let walls=[]
let vec2=require('./vec2_module')
let Physic=require('./physic_module')
const res = require('express/lib/response')
let world=new Physic.world(0,0,7)
function init(){
	
	
	walls.push(new Physic.rect(null,0,-500,1600,20,Infinity))
	walls.push(new Physic.rect(null,0,500,1600,20,Infinity))
	walls.push(new Physic.rect(null,-800,0,20,1000,Infinity))
	walls.push(new Physic.rect(null,800,0,20,1000,Infinity))
	for(let i of walls){
		objs.push(i)
		world.add(i)
	}
}
function update(){

	world.update(1000/fps)
    io.emit('update',create_client_message(objs))
}





function create_client_message(objs){
    let arr=[]
    for(let i of objs){
		let obj
		if(i.type==='rect'){
			obj={id:i.id,type:i.type,position:i.position,scale:i.scale}
		}else if(i.type==='ball'){
			obj={id:i.id,type:i.type,position:i.position,radius:i.radius}
		}
        
        arr.push(obj)
    }
    return JSON.stringify(arr)

}
function find_obj_by_id(id){
    for(let i of objs){
        if(i.id===id){
            return i
        }
    }
}




init()
setInterval(update,1000/fps)
