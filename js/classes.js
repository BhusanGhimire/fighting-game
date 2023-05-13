class Sprite {
	constructor({ position, imageSrc, scale = 1, framesMax = 1, offset = {x:0,y:0}}) {
		this.position = position,
		this.width = 50,
		this.height = 150,
		this.image = new Image(),
		this.image.src = imageSrc,
		this.scale = scale,
		this.framesMax = framesMax,
		this.frameCurrent = 0,
		this.framesElapsed = 0,
		this.framesHold = 4,
		this.offset = offset
	}

	draw(){
		c.drawImage(
			this.image,
			this.frameCurrent * (this.image.width / this.framesMax),
			0,
			this.image.width/this.framesMax,
			this.image.height,
			this.position.x - this.offset.x,
			this.position.y - this.offset.y,
			(this.image.width / this.framesMax) *this.scale,
			this.image.height*this.scale
		)//(dom-element,x-position-toStartCrop,y-position-toStartCrop,x-position,y-position,width,height)
	}

	animateFrames(){ // function to make the image sets look like a gif
		this.framesElapsed++

		if(this.framesElapsed % this.framesHold === 0){// to slow down the animation
			if(this.frameCurrent < this.framesMax - 1){ // -1 bcz background image has framesMax = 1 and frameCurrent = 0 so if we don't put -1 then the condition will be true for background also for 1 time in every 6 frames of the shop and because of this background will be repaint once for every 6 frames will cause background flicker. So, to avoid the background flicker we subtract 1
				this.frameCurrent++
			} else {
				this.frameCurrent = 0
			}			
		}		
	}

	update(){
		this.draw()
		this.animateFrames()
	}
}

class Fighter extends Sprite{
	constructor({ 
		position,
	 	velocity,
	  	color,
	    imageSrc,
	    scale = 1,
	    framesMax = 1,
	    offset = {x:0,y:0},
	    sprites,
	    attackBox = {offset: {},width: undefined, height: undefined}
	    }) {

		super({
			position,
			imageSrc,
			scale,
			framesMax,
			offset
		})

		this.velocity = velocity,
		this.width = 50,
		this.height = 150,
		this.lastKeyPressed,
		this.attackBox = {
			position: {
				x: this.position.x,
				y: this.position.y
			},
			offset: attackBox.offset,
			width: attackBox.width,
			height: attackBox.height
		},
		this.color = color,
		this.isAttacking,
		// this.offset = offset,
		this.health = 100,
		this.frameCurrent = 0,
		this.framesElapsed = 0,
		this.framesHold = 4,
		this.sprites = sprites,
		this.dead = false

		for(const sprite in this.sprites){
			sprites[sprite].image = new Image()
			sprites[sprite].image.src = sprites[sprite].imageSrc
		}
	}

	update(){
		this.draw()
		if (!this.dead) this.animateFrames()

		this.attackBox.position.x = this.position.x + this.attackBox.offset.x
		this.attackBox.position.y = this.position.y + this.attackBox.offset.y
		//draw the attack box
		// c.fillRect(this.attackBox.position.x,this.attackBox.position.y,this.attackBox.width,this.attackBox.height)

		this.position.x += this.velocity.x
		this.position.y += this.velocity.y

		if(this.position.y + this.height + this.velocity.y >= canvas.height-96){
			this.velocity.y = 0
			this.position.y = 330
		} else{
			this.velocity.y += gravity
		}
		/* we have a background image in the canvas and that background has a ground 96px above the canvas base.We want player to be in the ground rather than in the base of the canvas
			so, we are subtracting 96 from the canvas.height 

			And, we are also setting this.position.y = 330 inside if statement. That's bcz
			we are executing if statement again and again inside animate function so when we
			run that if st. next time, the fighter may fall through the ground(for a very short period of time)
			which may cause the fighter to flicker between fall and idle sprite when it touches the ground
			so, to avoid this we are setting this.pposition.y = 330
		*/
	}

	attack(){
		this.switchSprite('attack1')
		this.isAttacking = true

	}

	takeHit(){
		this.health -= 10

		if (this.health <= 0) {
			this.switchSprite('death')
		} else {
			this.switchSprite('takeHit')
		}
	}

	switchSprite(sprite) {
		if (this.image === this.sprites.death.image) {
			if (this.frameCurrent === this.sprites.death.framesMax -1 ) this.dead = true
			return
		}

		//overriding all other animations with the attack animation
		if(this.image === this.sprites.attack1.image &&
		this.frameCurrent < this.sprites.attack1.framesMax-1) return
		//framesMax-1 because frameCurrent starts from 0 and framesMax is our actual amount of frames starting at 1

		//overriding all other animations with the takeHit animation
		if(this.image === this.sprites.takeHit.image && this.frameCurrent < this.sprites.takeHit.framesMax-1) return
		switch (sprite){
			case 'idle':
				if(this.image != this.sprites.idle.image){
					this.image = this.sprites.idle.image
					this.framesMax = this.sprites.idle.framesMax
					this.frameCurrent = 0
				}
				break

			case 'run':
				if(this.image != this.sprites.run.image){
					this.image = this.sprites.run.image
					this.framesMax = this.sprites.run.framesMax
					this.frameCurrent = 0
				}			
				break
				
			case 'jump':
				if(this.image != this.sprites.jump.image){
					this.image = this.sprites.jump.image
					this.framesMax = this.sprites.jump.framesMax
					this.frameCurrent = 0
				}
				break

			case 'fall':
				if(this.image != this.sprites.fall.image){
					this.image = this.sprites.fall.image
					this.framesMax = this.sprites.fall.framesMax
					this.frameCurrent = 0
				}
				break

				case 'attack1':
				if(this.image != this.sprites.attack1.image){
					this.image = this.sprites.attack1.image
					this.framesMax = this.sprites.attack1.framesMax
					this.frameCurrent = 0
				}
				break

				case 'takeHit':
				if(this.image != this.sprites.takeHit.image){
					this.image = this.sprites.takeHit.image
					this.framesMax = this.sprites.takeHit.framesMax
					this.frameCurrent = 0
				}
				break

				case 'death':
				if(this.image != this.sprites.death.image){
					this.image = this.sprites.death.image
					this.framesMax = this.sprites.death.framesMax
					this.frameCurrent = 0
				}
				break
		}
	}
}
