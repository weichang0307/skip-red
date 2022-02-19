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