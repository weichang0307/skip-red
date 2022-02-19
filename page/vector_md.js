class vec2{
	constructor(x=0,y=0){
		this.x=x
		this.y=y
	}
	//return this + vec2_
	add(vec2_){
		return new vec2(this.x+vec2_.x,this.y+vec2_.y)
	}
	//this += vec2_
	add_in(vec2_){
		this.x+=vec2_.x
		this.y+=vec2_.y
	}
	//return vec1-vec2_
	minus(vec2_){
		return new vec2(this.x-vec2_.x,this.y-vec2_.y)
	}
	//vec1 -=vec2_
	minus_in(vec2_){
		this.x-=vec2_.x
		this.y-=vec2_.y
	}
	//return number*this
	scale(number){
		return new vec2(this.x*number,this.y*number)
	}
	//this*=number
	scale_in(number){
		this.x*=number
		this.y*=number
	}
	//return this dot vec2_
	dot(vec2_){
		return this.x*vec2_.x+this.y*vec2_.y
	}
	//return angle(rad) of this
	deg(){
		return Math.atan2(this.y,this.x)
	}
	//return copy of this
	copy(){
		return this.scale(1)
	}
	//copy vec2_ to this
	copy_in(vec2_){
		this.x=vec2_.x
		this.y=vec2_.y
	}
	//return |this|
	long(){
		return Math.sqrt(this.x**2+this.y**2)
	}
	//return whether this equal to vec2_(boolean)
	equal(vec2_){
		if(vec2_.x===this.x&&vec2_.y===this.y){
			return true
		}else{
			return false
		}
	}
	//set this by length and angle(rad) 
	set_in(long,deg){
		this.x=long*Math.cos(deg)
		this.y=long*Math.sin(deg)
	}
	//return new vector which is set by |this| and designated-angle(rad)
	set_deg(deg){
		return new vec2(this.long()*Math.cos(deg),this.long()*Math.sin(deg))
	}
	//rotate this to designated-angle(rad)
	set_deg_in(deg){
		this.x=this.long()*Math.cos(deg)
		this.y=this.long()*Math.sin(deg)
	}
	//divide this into two vectors with different direction
	divide2(deg,add_deg=Math.PI/2){
		let alpha=deg-this.deg()
		let beta=this.deg()-(deg+add_deg)
		let normal=new vec2()
		normal.set_in(this.long()*Math.sin(beta)/Math.sin(Math.PI-alpha-beta),deg)
		let tangent=new vec2()
		tangent.set_in(this.long()*Math.sin(alpha)/Math.sin(Math.PI-alpha-beta),deg+add_deg)
		return {normal:normal,tangent:tangent}
	}
}