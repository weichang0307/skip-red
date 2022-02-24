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
/*
const socketio=require('socket.io')
var io= socketio(server, {
	cors: {
	  origin: "https://example.com",
	  methods: ["GET", "POST"]
	}
})*/

const SocketServer = require('ws').Server
let wss=new SocketServer({server})
let id=0
wss.on('connection',(ws)=>{
	id+=1
	ws.id=id
	ws.on('message',(buf)=>{
		let data=JSON.parse(buf.toString())
        for(let i of ws.listeners){
			if(i.type===data.type){
				i.func(data.data)
			}
		}
    })
	ws.on('close',()=>{
		console.log(3)
		gameover(ws)
    })
	ws.emit_=(type,data)=>{
		ws.send(JSON.stringify({type:type,data:data}))

	}
	ws.listeners=[]
	ws.on_=(type,func)=>{
		ws.listeners.push({type:type,func,func})
	}


	let message=create__message(objs)
	ws.emit_('create',message)
	let arr=[]
	for(let i=0;i<players.length;i++){
		arr.push(players[i].name)
	}
	ws.emit_('rank',arr)
	
	ws.on_('start',(data)=>{
		//ws.join('room')

		
		let np=new Physic.ball(0,0,50,100,new vec2(0.5,0.5))
		np.id=ws.id
		np.socket=ws
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
		ws.emit_('init',{id:ws.id})
		let arr=[]
		for(let i=0;i<players.length;i++){
			arr.push(players[i].name)
		}
		ws.emit_('rank',arr)
		let message=create__message(objs)
		ws.emit_('create',message)

	})
	ws.on_('update',(data)=>{
		let obj=find_obj_by_id(ws.id)
		if(obj){
			if(data.position){
				obj.position.add_in(data.position)
			}
			if(data.velocity){
				obj.velocity.add_in(data.velocity)
			}
		}
		
	})
})

//Game
let fps=50
let objs=[]
let players=[]
let walls=[]
let vec2=require('./vec2_module')
let Physic=require('./physic_module')
const res = require('express/lib/response')
const { on } = require('ws')
let world=new Physic.world(0,0,1)
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
	let message=update_message(objs)
	wss.clients.forEach((ws)=>{
		ws.emit_('update',message)
	})
	
		
    
}





function create__message(objs){
    let arr=[]
    for(let i of objs){
		let obj
		if(i.type==='rect'){
			obj={id:i.id,name:i.name,type:i.type,position:{x:i.position.x,y:i.position.y},scale:{x:i.scale.x,y:i.scale.y},color:i.color}
		}else if(i.type==='ball'){
			obj={id:i.id,name:i.name,type:i.type,position:{x:i.position.x,y:i.position.y},radius:i.radius}
		}
        
        arr.push(obj)
    }
    return arr

}
function update_message(objs){
    let arr=[]
    for(let i of objs){
		let obj
		obj={id:i.id,position:{x:i.position.x,y:i.position.y}}
        arr.push(obj)
    }
    return arr

}
function gameover(ws){
	ws.emit_('end',{})
	for(let i=0;i<objs.length;i++){
		if(objs[i].id===ws.id){
			world.delete(objs[i])
			objs.splice(i,1)
			
		}
	}
	for(let i=0;i<players.length;i++){
		if(players[i].id===ws.id){
			players.splice(i,1)
		}
	}
	let arr=[]
	for(let i=0;i<players.length;i++){
		arr.push(players[i].name)
	}
	ws.emit_('rank',arr)
	let message=create__message(objs)
	ws.emit_('create',message)
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
