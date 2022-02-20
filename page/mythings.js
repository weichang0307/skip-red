class Controler{
	constructor(camera){
        this.camera=camera
		this.position=new vec2(0,0)
		this.btn_position=new vec2(0,0)
		this.visible=false
        this.ispress=false
	}
    on(){
        window.addEventListener('mousedown',(e)=>{
            this.ispress=true
            controler.visible=true
            let p=get_p_in_world(e.pageX,e.pageY,this.camera)
            controler.position.x=p.x
            controler.position.y=p.y
        })
        window.addEventListener('mousemove',(e)=>{
            if(this.ispress){
                let btnp=get_p_in_world(e.pageX,e.pageY,this.camera)
                let dis=btnp.minus(controler.position)
                if(dis.long()>100){
                    dis.scale_in(100/dis.long())
                }
                controler.btn_position=dis
            }
        })
        window.addEventListener('mouseup',(e)=>{
            
            this.ispress=false
            controler.visible=false
            controler.btn_position.scale_in(0)
        })
    }
	draw(){
		if(this.visible){
			ctx.globalAlpha=0.5
			ctx.beginPath()
			ctx.arc(this.position.x,this.position.y,100,0,Math.PI*2)
			ctx.closePath()
			ctx.fillStyle='white'
			ctx.fill()
			ctx.beginPath()
			ctx.arc(this.position.x+this.btn_position.x,this.position.y+this.btn_position.y,30,0,Math.PI*2)
			ctx.closePath()
			ctx.fillStyle='white'
			ctx.fill()
			ctx.globalAlpha=1
		}
		
	}
}



class Inputer{
    constructor(x,y,width,height,camera=camera){
        this.position={x:x,y:y}
        this.scale={x:width,y:height}
        this.value=''
        this.visible=true
        this.choose=false
        this.camera=camera
        this.error=''
        this.click=(e)=>{
            let pp=get_p_in_world(e.pageX,e.pageY,this.camera)
            let left=this.position.x-this.scale.x/2
            let top=this.position.y-this.scale.y/2
            if(left<pp.x&&pp.x<left+this.scale.x&&top<pp.y&&pp.y<top+this.scale.y){
                this.choose=true
            }else{
                this.choose=false
            }
        }
    }
    draw(){
        if(this.visible){
            ctx.fillStyle='rgb(200,200,200)'
            if(this.choose){
                ctx.fillStyle='white'
            }
            ctx.fillRect(this.position.x-this.scale.x/2,this.position.y-this.scale.y/2,this.scale.x,this.scale.y)
            
            ctx.fillStyle='black'
            ctx.font=this.scale.y*0.8+'px Arial'
            let tw=ctx.measureText(this.value).width
            ctx.fillText(this.value,this.position.x-tw/2,this.position.y+this.scale.y/4)
        }
        
    }
    on(){
        window.addEventListener('click',this.click)
        window.addEventListener('keydown',(e)=>{
            
            if(this.choose&&e.key.length===1){
                this.value+=e.key
            }
            if(this.choose&&e.key==='Backspace'&&this.value.length>0){
                console.log(1)
                this.value=this.value.slice(0,this.value.length-1)
            }
            
        })
    }
    off(){
        this.choose=false
        window.removeEventListener('click',this.click)
    }
    
}