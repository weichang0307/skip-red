

//let socket = io('ws://localhost:3000')
let socket = io('wss://'+location.hostname) 
let canvas=document.getElementById('canvas')
let ctx=canvas.getContext('2d')
let ww=innerWidth
let wh=innerHeight
let camera=new Camera(ww/2,wh/2)
camera.scale.x=wh/1600
camera.scale.y=wh/1600
mysize()
let fps=10

let controler=new Controler(camera)
let inputer=new Inputer(0,0,700,100,camera)
inputer.on()
let btn_start=new Button(camera,0,200,200,100,'start','rgb(200,0,0)','white')
btn_start.click=start_game
btn_start.on()
let id=0
let start=false
let objs=[]
let players=[]
console.log(typeof players)








function init(){
    socket_init()

    controler.on()

    window.addEventListener('resize',(e)=>{
        ww=innerWidth
        wh=innerHeight
        camera.middle.x=ww/2
        camera.middle.y=wh/2
        camera.scale.x=wh/1600
        camera.scale.y=wh/1600
        mysize()
    })
    window.addEventListener('keydown',(e)=>{
        if(e.key==='p'){
            end_game()
            socket.emit('end',{})
        }
    })
    
}
function update(){
    if(id!==0&&controler.btn_position.long()!==0&&start){
        let mes={
            velocity:{x:controler.btn_position.x/1000,y:controler.btn_position.y/1000}
        }
        socket.emit('update',mes)
        
    }
    
    

}

function draw(){
    
    for(let i of objs){
        if(i.id===id){
            controler.position.x+=i.position.x-camera.position.x
            controler.position.y+=i.position.y-camera.position.y
            camera.position.x=i.position.x
            camera.position.y=i.position.y

        }
    }
    camera.start(ctx)
    ctx.fillStyle='black'
    background('black',camera)
    grid(50,'rgb(100,100,100)',camera)
    grid(250,'rgb(100,100,100)',camera,2)
    
    
    for(let i of objs){
        draw_helper(i)
        if(i.id){
            ctx.fillStyle='white'
            ctx.font=50+'px Arial'
            ctx.fillText(i.name,i.position.x-ctx.measureText(i.name).width/2,i.position.y-70) 
        }
        
    }
    if(start){
        controler.draw()
    }
    if(start===false){
        ctx.globalAlpha=0.5
        background('white',camera)
        ctx.globalAlpha=1
        inputer.draw()
        btn_start.draw()
        ctx.fillStyle='white'
        ctx.font=100+'px Arial'
        ctx.fillText('YOUR NAME',inputer.position.x-300,inputer.position.y-100)
    }
    
    camera.end(ctx)
    ctx.globalAlpha=0.5
    ctx.fillStyle='yellow'
    ctx.fillRect(ww-200,0,200,30)
    ctx.fillStyle='white'
    ctx.fillRect(ww-200,30,200,60)
    ctx.fillStyle='rgb(150,150,150)'
    ctx.fillRect(ww-200,90,200,210)
    ctx.globalAlpha=1
    ctx.fillStyle='white'
    ctx.font=20+'px Arial'
    for(let i=0;i<players.length;i++){
        if(i<10){
            ctx.fillText(i+1+'. '+players[i],ww-200,i*30+20)
        }
    }
    
    requestAnimationFrame(draw)
}

function socket_init(){
    socket.emit('req_up',1)
    socket.on('connect',(e)=>{
    })
    socket.on('init',(data)=>{
        id=data.id
    })
    socket.on('update',(data)=>{
        for(let i=0;i<objs.length;i++){
            objs[i].position=data[i].position
        }
	socket.emit('req_up',1)
        
    })
    socket.on('create',(data)=>{
        objs=data
    })
    socket.on('end',(data)=>{
        end_game()
    })
    socket.on('rank',(data)=>{
        players=data
    })
}
function start_game(){
    if(start===false&&inputer.value!==''){
        inputer.off()
        btn_start.off()
        start=true
        socket.emit('start',inputer.value) 
    }
    
}
function end_game(){
    inputer.position.x=camera.position.x
    inputer.position.y=camera.position.y
    inputer.on()
    btn_start.position.x=camera.position.x
    btn_start.position.y=camera.position.y+200
    btn_start.on()
    start=false
}
function draw_helper(obj,fill=true,through=1,ctx_=ctx){
    if(obj.type==='rect'){
        ctx_.globalAlpha=through
        ctx_.fillStyle='white'
        ctx_.strokeStyle='white' 
        let left=obj.position.x-obj.scale.x/2
        let top=obj.position.y-obj.scale.y/2
        if(fill){
            ctx_.fillRect(left,top,obj.scale.x,obj.scale.y)
        }else{
            ctx_.strokeRect(left,top,obj.scale.x,obj.scale.y)
        }
        ctx_.fillStyle='red'
        if(obj.color[0]){
            ctx.beginPath()
            ctx.moveTo(left,top)
            ctx.lineTo(left+obj.scale.x,top)
            ctx.lineTo(left+obj.scale.x/2,top+obj.scale.y/2)
            ctx.closePath()
            ctx.fill()
        }
        if(obj.color[1]){
            ctx.beginPath()
            ctx.moveTo(left,top+obj.scale.y)
            ctx.lineTo(left+obj.scale.x,top+obj.scale.y)
            ctx.lineTo(left+obj.scale.x/2,top+obj.scale.y/2)
            ctx.closePath()
            ctx.fill()
        }
        if(obj.color[2]){
            ctx.beginPath()
            ctx.moveTo(left,top)
            ctx.lineTo(left,top+obj.scale.y)
            ctx.lineTo(left+obj.scale.x/2,top+obj.scale.y/2)
            ctx.closePath()
            ctx.fill()
        }
        if(obj.color[3]){
            ctx.beginPath()
            ctx.moveTo(left+obj.scale.x,top)
            ctx.lineTo(left+obj.scale.x,top+obj.scale.y)
            ctx.lineTo(left+obj.scale.x/2,top+obj.scale.y/2)
            ctx.closePath()
            ctx.fill()
        }





        ctx_.globalAlpha=1
    }else if(obj.type==='ball'){
        ctx_.globalAlpha=through
		ctx_.fillStyle='yellow'
		ctx_.strokeStyle='yellow'
		ctx_.beginPath()
		ctx_.arc(obj.position.x,obj.position.y,obj.radius,0,Math.PI*2)
		ctx_.closePath() 
		if(fill){
			ctx_.fill()	
		}else{
			ctx_.stroke()
		}
		ctx_.globalAlpha=1
    }
    
}



init()
setInterval(update,1000/fps);
draw()
