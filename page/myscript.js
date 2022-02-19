

var socket = io('ws://localhost:3000')
let canvas=document.getElementById('canvas')
let ctx=canvas.getContext('2d')
let ww=1600
let wh=1000
mysize()
let fps=10
let camera=new Camera(800,500)
let controler=new Controler(camera)
let id=0
let objs=[]









function init(){
    socket_init()

    controler.on()
    console.log(controler.btn_position)

    window.addEventListener('resize',mysize)
}
function update(){
    if(id!==0&&controler.btn_position.long()!==0){
        let mes={
            velocity:controler.btn_position.scale(0.001)
        }
        socket.emit('update',JSON.stringify(mes))
    }
    

}

function draw(){
    camera.start(ctx)
    ctx.fillStyl='black'
    ctx.fillRect(-800,-500,1600,1000)
    for(let i of objs){
        draw_helper(i)
    }

    controler.draw()
    camera.end(ctx)
    requestAnimationFrame(draw)
}

function socket_init(){
    socket.on('connect',(e)=>{
    })
    socket.on('init',(data)=>{
        id=data.id
    })
    socket.on('update',(data)=>{
        objs=JSON.parse(data)
    })
    socket.emit('start',{})
}
function draw_helper(obj,color='red',fill=true,through=1,ctx_=ctx){
    if(obj.type==='rect'){
        ctx_.globalAlpha=through
        ctx_.fillStyle=color
        ctx_.strokeStyle=color 
        if(fill){
            ctx_.fillRect(obj.position.x-obj.scale.x/2,obj.position.y-obj.scale.y/2,obj.scale.x,obj.scale.y)
        }else{
            ctx_.strokeRect(obj.position.x-obj.scale.x/2,obj.position.y-obj.scale.y/2,obj.scale.x,obj.scale.y)
        }
        ctx_.globalAlpha=1
    }else if(obj.type==='ball'){
        ctx_.globalAlpha=through
		ctx_.fillStyle=color
		ctx_.strokeStyle=color
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
draw()
setInterval(update,1000/fps);