




function get_p_in_world(x,y,camera=camera){
	let fx=((x-parseFloat(canvas.style.left))*ww/canvas.width-camera.middle.x)/camera.scale.x+camera.position.x
	let fy=((y-parseFloat(canvas.style.top))*ww/canvas.width-camera.middle.y)/camera.scale.y+camera.position.y
	return new vec2(fx,fy)
}
function mysize(){
	

	if(window.innerHeight/window.innerWidth>=wh/ww){
		canvas.style.width=window.innerWidth+'px'
		canvas.style.height=wh*window.innerWidth/ww+'px'
		canvas.width=window.innerWidth
		canvas.height=wh*window.innerWidth/ww
		canvas.position='absolute'
		canvas.left=window.innerWidth-canvas.width/2
		canvas.top=0
		canvas.style.position='absolute'
		canvas.style.left=0+'px'
		canvas.style.top=0+'px'
	}else{
		canvas.style.width=ww*window.innerHeight/wh+'px'
		canvas.style.height=window.innerHeight+'px'
		canvas.width=ww*window.innerHeight/wh
		canvas.height=window.innerHeight
		canvas.style.position='absolute'
		canvas.style.left=(window.innerWidth-canvas.width)/2+'px'
		canvas.style.top=0+'px'
		
	}
	//適用條件:只有一個camera
	ctx.restore()
	ctx.restore()
	ctx.save()

	if(window.innerHeight/window.innerWidth>=wh/ww){
		ctx.scale(window.innerWidth/ww,window.innerWidth/ww)
	}else{
		ctx.scale(window.innerHeight/wh,window.innerHeight/wh)
	}
	ctx.save()
	
}
function is_computer(){
	let iscom=true
	let phone_char= ['Android', 'webOS', 'iPhone', 'iPad', 'iPod', 'BlackBerry', 'Windows Phone']
	for(let i of phone_char){
		if(navigator.userAgent.match(i)){
			iscom=false
			break
		}
	}
	return iscom
}


class Arrow{
	constructor(start,vec2,width=10,scale=1,color='white'){
		this.start=start
		this.vec2=vec2
		this.width=width
		this.color=color
		this.scale=scale

	}draw(){

		ctx.beginPath()
		ctx.moveTo(this.start.x,this.start.y)
		ctx.lineTo(this.start.x+this.vec2.x*this.scale,this.start.y+this.vec2.y*this.scale)
		ctx.lineWidth=this.width
		ctx.strokeStyle=this.color
		ctx.stroke()
		ctx.save()
		ctx.translate(this.start.x+this.vec2.x*this.scale,this.start.y+this.vec2.y*this.scale)

		ctx.rotate(this.vec2.deg())
		ctx.moveTo(0,0)
		ctx.lineTo(-2*this.width,2*this.width)
		ctx.lineTo(-2*this.width,-2*this.width)
		ctx.closePath()
		ctx.fillStyle=this.color
		ctx.fill()
		ctx.restore()

	}
	get_end(){
		return new vec2(this.start.x+this.vec2.x*this.scale,this.start.y+this.vec2.y*this.scale)
	}
}
class Button{
	constructor(camera,x,y,width,height,text,color='white',text_color='rgb(100,100,100)',font=height*0.8){
		this.position=new vec2(x,y)
		this.scale=new vec2(width,height)
		this.color=color
		this.text_color=text_color
		this.text=text
		this.font=font
		this.is_on=false
		this.ispress=false
		this.down=(e)=>{this.color='rgb(150,0,0)'}
		this.up=(e)=>{this.color=color}
		this.click=(e)=>{}
		this.camera=camera
		
		if(is_computer()){
			this.mousedown=(e)=>{
				this.ispress=true
				
				let pp=get_p_in_world(e.pageX,e.pageY,this.camera)
				if(this.ispointinpath(pp)){
					this.ispress=true
					this.down(e)
				}
			}
			this.mouseup=(e)=>{
				let pp=get_p_in_world(e.pageX,e.pageY,this.camera)
				if(this.ispress){
					this.up(e)
					this.ispress=false
					if(this.ispointinpath(pp)){
						this.click(e)
					}
					
					
				}
			}
		}else{
			this.touchstart=(e)=>{
				let pp=get_p_in_world(e.touches[0].pageX,e.touches[0].pageY,this.camera)
				if(this.ispointinpath(pp)){
					this.ispress=true
					this.down(e)
				}
			}
			this.touchend=(e)=>{
				
				if(this.ispress){
					this.up(e)
					let pp=get_p_in_world(e.changedTouches[0].pageX,e.changedTouches[0].pageY,this.camera)
					
					this.ispress=false
					if(this.ispointinpath(pp)){
						this.click(e)
					}

					
					
				}
			}
		}
		

	}draw(){
		ctx.beginPath()
		ctx.fillStyle=this.color
		ctx.fillRect(this.position.x-this.scale.x/2,this.position.y-this.scale.y/2,this.scale.x,this.scale.y)
		ctx.fillStyle=this.text_color
		ctx.font=this.font+'px Arial'
		let ax=(this.scale.x-ctx.measureText(this.text).width)/2
		ctx.fillText(this.text,this.position.x-this.scale.x/2+ax,this.position.y-this.scale.y/2+this.font)
	}
	on(){
		this.is_on=true
		if(is_computer()){
			window.addEventListener('mousedown',this.mousedown)
			window.addEventListener('mouseup',this.mouseup)
		}else{
			window.addEventListener('touchstart',this.touchstart)
			window.addEventListener('touchend',this.touchend)
		}
		
		
	}
	off(){
		this.is_on=false
		if(is_computer()){
			window.removeEventListener('mousedown',this.mousedown)
			window.removeEventListener('mouseup',this.mouseup)
		}else{
			window.removeEventListener('touchstart',this.touchstart)
			window.removeEventListener('touchend',this.touchend)
		}
	}
	ispointinpath(pp){
		if(pp.x>this.position.x-this.scale.x/2&&pp.x<this.position.x+this.scale.x/2&&pp.y>this.position.y-this.scale.y/2&&pp.y<this.position.y+this.scale.y/2){
			return true
		}else{
			return false
		}

	}

}



class Slider{
	constructor(x,y,long,width,word,mini,max,float=0,font=width*5){
		this.max=max
		this.mini=mini
		this.word=word
		this.position={x:x,y:y}
		this.float=float 
		this.value=mini
		this.long=long
		this.width=width
		this.font=font
		this.ispress=false
		this.is_on=false

		this.mousedown=(e)=>{
			this.ispress=true
			let pp=get_p_in_world(e.pageX,e.pageY)
			this.update(pp.x,pp.y)
		}
		this.mouseup=(e)=>{
			this.ispress=false
		}
		this.mousemove=(e)=>{
			if(this.ispress){
				let pp=get_p_in_world(e.pageX,e.pageY)
				this.update(pp.x,pp.y)
			}
			
		}
		if(is_computer){
			this.mousedown=(e)=>{
				this.ispress=true
				let pp=get_p_in_world(e.pageX,e.pageY)
				this.update(pp.x,pp.y)
			}
			this.mouseup=(e)=>{
				this.ispress=false
			}
			this.mousemove=(e)=>{
				if(this.ispress){
					let pp=get_p_in_world(e.pageX,e.pageY)
					this.update(pp.x,pp.y)
				}
				
			}
		}else{
			
			this.touchstart=(e)=>{
				this.ispress=true
				let pp=get_p_in_world(e.touches[0].pageX,e.touches[0].pageY)
				this.update(pp.x,pp.y)
			}
			this.touchend=(e)=>{
				this.ispress=false
			}
			this.touchmove=(e)=>{
				if(this.ispress){
					let pp=get_p_in_world(e.touches[0].pageX,e.touches[0].pageY)
					this.update(pp.x,pp.y)
				}
				
			}
		}
		
		
		

	}
	draw(){
		ctx.fillStyle='white'
		ctx.fillRect(this.position.x,this.position.y-this.width/2,this.long,this.width)
		ctx.fillRect(this.position.x+this.long*((this.value-this.mini)/(this.max-this.mini)),this.position.y-this.width*2,this.width,this.width*4)
		ctx.font = this.font+'px Arial'
		let text=this.word+' '+Math.floor(this.value*10**this.float)/10**this.float+' '
		ctx.fillText(text,this.position.x-ctx.measureText(text).width,this.position.y+this.width)
	}
	on(){
		this.is_on=true
		if(is_computer()){
			window.addEventListener('mousedown',this.mousedown)
			window.addEventListener('mouseup',this.mouseup)
			window.addEventListener('mousemove',this.mousemove)
		}else{
			window.addEventListener('touchstart',this.touchstart)
			window.addEventListener('touchmove',this.touchmove)
			window.addEventListener('touchend',this.touchend)
		}
		
	}
	off(){
		this.is_on=false
		if(is_computer()){
			window.removeEventListener('mousedown',this.mousedown)
			window.removeEventListener('mouseup',this.mouseup)
			window.removeEventListener('mousemove',this.mousemove)
		}else{
			window.removeEventListener('touchstart',this.touchstart)
			window.removeEventListener('touchmove',this.touchmove)
			window.removeEventListener('touchend',this.touchend)
		}

	}
	update(x,y,addx=10,addy=this.width*2){
		if(this.position.x-addx<x&&x<this.position.x+this.long+addx&&this.position.y-addy<y&&y<this.position.y+this.width+addy){
			this.value=(x-this.position.x)*(this.max-this.mini)/this.long+this.mini
			if(this.value<this.mini){
				this.value=this.mini
			}else if(this.value>this.max){
				this.value=this.max
			}
		}

	}
}
class Camera{
	constructor(mx=0,my=0,x=0,y=0,deg,sx=1,sy=1){
		this.middle=new vec2(mx,my)
		this.position=new vec2(x,y)
		this.rotation=deg
		this.scale=new vec2(sx,sy)
	}
	init(ctx_){
		ctx_.save()
	}
	start(ctx_){
		ctx_.save()
		ctx_.translate(this.middle.x,this.middle.y)
		ctx_.rotate(this.rotation)
		ctx_.scale(this.scale.x,this.scale.y)
		ctx_.translate(-this.position.x,-this.position.y)
	}
	end(ctx_){
		ctx_.restore()
	}
	
}





class imgobj{
	constructor(px,py){
		this.position={x:px,y:py}
		this.rotation=0
		this.scale={x:1,y:1}
		this.through=1
		this.visible=true
		this.style=0
		this.styles=[]
		this.group=[]
	}
	draw(ctx_=ctx){
		if(this.visible){
			ctx_.save()
			ctx_.translate(this.position.x,this.position.y)
			ctx_.rotate(this.rotation)
			ctx_.scale(this.scale.x,this.scale.y)
			ctx_.globalAlpha=this.through
			ctx_.drawImage(this.styles[this.style].img,-this.styles[this.style].middle.x,-this.styles[this.style].middle.y)
			ctx_.globalAlpha=1.0
			ctx_.restore()
			
		}
	}
	ispointinpath(x,y,ctx_=ctx){
		ctx_.save()
		ctx_.translate(this.position.x,this.position.y)
		ctx_.rotate(this.rotation)
		ctx_.scale(this.scale.x,this.scale.y)
		ctx_.beginPath()
		for(let i=0;i<this.styles[this.style].path.length;i++){
			if(i===0){
				ctx_.moveTo(this.styles[this.style].path[i].x,this.styles[this.style].path[i].y)
			}else{
				ctx_.lineTo(this.styles[this.style].path[i].x,this.styles[this.style].path[i].y)
			}
		}
		ctx_.closePath()
		ctx_.restore()
		return ctx_.isPointInPath(x,y)
		
	}
	addstyle(src,middle,path){
		let img=new Image()
		img.src=src 
		this.styles.push({method:'img',img:img,middle:middle,path:path})
	}
}












//背景
function background(color,camera,width=ww,height=wh){
	width/=camera.scale.x
	height/=camera.scale.y
	let left=camera.position.x-width/2
    let top=camera.position.y-height/2
	ctx.fillStyle=color
	ctx.fillRect(left,top,width,height)
}
//格線
function grid(blank,color,camera,linewidth=1,width=ww,height=wh){
	width/=camera.scale.x
	height/=camera.scale.y
	let left=camera.position.x-width/2
    let top=camera.position.y-height/2
    left_=left-left%blank
    top_=top-top%blank
    ctx.beginPath()
    for(let i=left_;i<left+width;i+=blank){
        ctx.moveTo(i,top)
        ctx.lineTo(i,top+height)
    }
    for(let i=top_;i<top+height;i+=blank){
        ctx.moveTo(left,i)
        ctx.lineTo(left+width,i)
    }
    ctx.strokeStyle=color
    ctx.lineWidth=linewidth
    ctx.stroke()
}

//群組
class Group{
	constructor(aa){
		let all_members=[]
		let element={
			position:{x:0,y:0},
			scale:{x:1,y:1},
			deg:0,
			visible:true,
			members_count:0,
			members:all_members
			
		}
		Object.assign(element,aa)
		Object.assign(this,element)
	}
	add(object_){
		this.members.push(object_)
		object_.group.push(this)
		this.members_count+=1
	}
	draw(){
		if(this.visible===false){
			return
		}
		for(let i=0;i<this.members_count;i++){
			ctx.save()
			ctx.translate(this.position.x,this.position.y)
			ctx.rotate(this.deg)
			ctx.scale(this.scale.x,this.scale.y)
			this.members[i].draw()
			ctx.restore()
			
	
		}
	}
	ispointinpath(x,y){
		if(this.visible===false){
			return false
		}
		for(let i=0;i<this.members_count;i++){
			
			if(this.members[i].ispointinpath(x,y)){
				return true
			}
			
		}
		return false

	}
}






























//drawer
function drawer(array,globel_through){
	for (var i=0;i<array.length;i++) {
		if(array[i].type==='rect'){
			ctx.globalAlpha=(100-array[i].through)/100*globel_through
			ctx.save()
			ctx.translate(array[i].translate.x,array[i].translate.y)
			ctx.rotate(array[i].deg)
			ctx.scale(array[i].scale.x,array[i].scale.y)
			if(array[i].stroke.is===true){
				ctx.lineWidth=array[i].stroke.width
				ctx.strokeStyle=array[i].stroke.color
				ctx.strokeRect(array[i].topleft.x,array[i].topleft.y,array[i].rightbottom.x-array[i].topleft.x,array[i].rightbottom.y-array[i].topleft.y)
			}
			if(array[i].fill.is===true){
				ctx.fillStyle=array[i].fill.color
				ctx.fillRect(array[i].topleft.x,array[i].topleft.y,array[i].rightbottom.x-array[i].topleft.x,array[i].rightbottom.y-array[i].topleft.y)
			}
			
			ctx.restore()
			ctx.globalAlpha=1.0
		}else if(array[i].type==='circle'){
			ctx.globalAlpha=(100-array[i].through)/100*globel_through
			ctx.save()
			ctx.translate(array[i].translate.x,array[i].translate.y)
			ctx.rotate(array[i].deg)
			ctx.scale(array[i].scale.x,array[i].scale.y)
			ctx.beginPath()
			ctx.arc(array[i].position.x,array[i].position.y,array[i].rr,array[i].startdeg,array[i].enddeg)
			if(array[i].isclose){
				ctx.closePath()
			}
			if(array[i].isrr){
				ctx.lineTo(array[i].position.x,array[i].position.y)
				ctx.closePath()
			}
			if(array[i].stroke.is===true){
				ctx.lineWidth=array[i].stroke.width
				ctx.strokeStyle=array[i].stroke.color
				ctx.stroke()
			}
			if(array[i].fill.is===true){
				ctx.fillStyle=array[i].fill.color
				ctx.fill()
			}
			
			ctx.restore()
			ctx.globalAlpha=1.0
		}else if(array[i].type==='line'){
			ctx.globalAlpha=(100-array[i].through)/100*globel_through
			ctx.save()
			ctx.translate(array[i].translate.x,array[i].translate.y)
			ctx.rotate(array[i].deg)
			ctx.scale(array[i].scale.x,array[i].scale.y)
			for(let y=0;y<array[i].pointarray.length;y++){
				let px=array[i].pointarray[y][0]
				let py=array[i].pointarray[y][1]
				if(y===0){
					ctx.beginPath()
					ctx.moveTo(px,py)
				}else{
					ctx.lineTo(px,py)
				}
			}
			if(array[i].isclose){
				ctx.closePath()
			}
			if(array[i].stroke.is===true){
				ctx.lineWidth=array[i].stroke.width
				ctx.strokeStyle=array[i].stroke.color
				ctx.stroke()
			}
			if(array[i].fill.is===true){
				ctx.fillStyle=array[i].fill.color
				ctx.fill()
			}
			
			ctx.restore()
			ctx.globalAlpha=1.0
		

		}
	}
}
//get path
function ispointinarraypath(x,y,array){
	let is=false
	for (var i=0;i<array.length;i++) {
		if(array[i].type==='rect'){
			ctx.save()
				ctx.translate(array[i].translate.x,array[i].translate.y)
				ctx.rotate(array[i].deg)
				ctx.scale(array[i].scale.x,array[i].scale.y)
				ctx.beginPath()
				ctx.rect(array[i].topleft.x,array[i].topleft.y,array[i].rightbottom.x-array[i].topleft.x,array[i].rightbottom.y-array[i].topleft.y)			
			ctx.restore()
			if(ctx.isPointInPath(x,y)){
				is=true
			}
			

		}else if(array[i].type==='circle'){
			ctx.save()
				ctx.translate(array[i].translate.x,array[i].translate.y)
				ctx.rotate(array[i].deg)
				ctx.scale(array[i].scale.x,array[i].scale.y)
				ctx.beginPath()
				ctx.arc(array[i].position.x,array[i].position.y,array[i].rr,array[i].startdeg,array[i].enddeg)
				if(array[i].isclose){
					ctx.closePath()
				}
				if(array[i].isrr){
					ctx.lineTo(array[i].position.x,array[i].position.y)
					ctx.closePath()
				}
			ctx.restore()
			if(ctx.isPointInPath(x,y)){
				is=true
			}
		}else if(array[i].type==='line'){
			ctx.save()
				ctx.translate(array[i].translate.x,array[i].translate.y)
				ctx.rotate(array[i].deg)
				ctx.scale(array[i].scale.x,array[i].scale.y)
				for(let y=0;y<array[i].pointarray.length;y++){
					let px=array[i].pointarray[y][0]
					let py=array[i].pointarray[y][1]
					if(y===0){
						ctx.beginPath()
						ctx.moveTo(px,py)
					}else{
						ctx.lineTo(px,py)
					}
				}
				if(array[i].isclose){
					ctx.closePath()
				}
			ctx.restore()
			if(ctx.isPointInPath(x,y)){
				is=true
			}
		}
	}
	ctx.restore()
	return is
}