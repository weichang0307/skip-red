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
		console.log(data)
		socket.join('room')
		let np=new Physic.ball(0,0,50,100,new vec2(0.5,0.5))
		np.id=socket.id
		np.socket=socket
		np.collision=(e)=>{
			if(e.obj.type==='rect'){
				if(e.obj.color[0]&&e.side==='bottom'){gameover(e.self.socket)}
				else if(e.obj.color[1]&&e.side==='top'){gameover(e.self.socket)}
				else if(e.obj.color[2]&&e.side==='right'){gameover(e.self.socket)}
				else if(e.obj.color[3]&&e.side==='left'){gameover(e.self.socket)}
				else if(e.obj.color[0]&&e.obj.color[2]&&e.side==='bottomright'){gameover(e.self.socket)}
				else if(e.obj.color[0]&&e.obj.color[3]&&e.side==='bottomleft'){gameover(e.self.socket)}
				else if(e.obj.color[1]&&e.obj.color[2]&&e.side==='topright'){gameover(e.self.socket)}
				else if(e.obj.color[1]&&e.obj.color[3]&&e.side==='topleft'){gameover(e.self.socket)}
			}
			

		}
		np.name=data
		players.push(np)
		objs.push(np)
		world.add(np)
		socket.emit('init',{id:socket.id})

	})
	socket.on('update',(data)=>{
		data=JSON.parse(data)
		let obj=find_obj_by_id(socket.id)
		if(obj){
			if(data.position){
				obj.position.add_in(data.position)
			}
			if(data.velocity){
				obj.velocity.add_in(data.velocity)
			}
		}
		
	})
	socket.on('disconnect',(reason)=>{
		console.log(reason)
		gameover(socket)
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
let space={x:10000,y:10000}
function init(){
	
	
	for(let i=0;i<50;i++){
		let sx=Math.random()*300+100
		let sy=Math.random()*300+100
		let px=(Math.random()-0.5)*(space.x-400)
		let py=(Math.random()-0.5)*(space.y-400)
		while(-250<px&&px<250&&-250<py&&py<250){
			px=(Math.random()-0.5)*(space.x-400)
			py=(Math.random()-0.5)*(space.y-400)
		}
		let mass=sx*sy/1000
		let rr=new Physic.rect(px,py,sx,sy,mass)
		rr.velocity.x=(Math.random()-0.5)
		rr.velocity.y=(Math.random()-0.5)
		rr.color=[Math.floor(Math.random()*2),Math.floor(Math.random()*2),Math.floor(Math.random()*2),Math.floor(Math.random()*2)]
		objs.push(rr)
		world.add(rr)
	}



	walls.push(new Physic.rect(0,-space.y/2,space.x,20,Infinity))
	walls.push(new Physic.rect(0,space.y/2,space.x,20,Infinity))
	walls.push(new Physic.rect(-space.x/2,0,20,space.y,Infinity))
	walls.push(new Physic.rect(space.x/2,0,20,space.y,Infinity))
	walls.push(new Physic.rect(200,0,200,200,100))
	for(let i of walls){
		i.color=[1,1,1,1]
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
			obj={id:i.id,name:i.name,type:i.type,position:i.position,scale:i.scale,color:i.color}
		}else if(i.type==='ball'){
			obj={id:i.id,name:i.name,type:i.type,position:i.position,radius:i.radius}
		}
        
        arr.push(obj)
    }
    return JSON.stringify(arr)

}
function gameover(socket){
	socket.emit('end',{})
	for(let i=0;i<objs.length;i++){
		if(objs[i].id===socket.id){
			world.delete(objs[i])
			objs.splice(i,1)
		}
	}
}
function find_obj_by_id(id){
    for(let i of objs){
        if(i.id===id){
            return i
        }
    }
	return null
}




init()
setInterval(update,1000/fps)
