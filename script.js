const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0,0,canvas.width,canvas.height);//(x-position,y-position,width,height)

const gravity = 0.7

const background = new Sprite({
	position: {
		x: 0,
		y:0
	},
	imageSrc: './game-assets/background.png'
})

const shop = new Sprite({
	position: {
		x: 600,
		y:128
	},
	imageSrc: './game-assets/shop.png',
	scale: 2.75,
	framesMax: 6
})

const player = new Fighter({
	position:{
		x:0,
		y:0
	},
	velocity:{
		x:0,
		y:0
	},
	color: 'red',
	offset: {
		x: 0,
		y: 0
	},
	imageSrc: './game-assets/actions/Idle.png',
	framesMax: 8,
	scale: 2.5,
	offset: {
		x: 215,
		y: 157
	},
	sprites: {
		idle: {
			imageSrc: './game-assets/fighters/samuraiMack/Idle.png',
			framesMax: 8
		},
		run: {
			imageSrc: './game-assets/fighters/samuraiMack/Run.png',
			framesMax: 8
		},
		jump: {
			imageSrc: './game-assets/fighters/samuraiMack/Jump.png',
			framesMax: 2
		},
		fall: {
			imageSrc: './game-assets/fighters/samuraiMack/Fall.png',
			framesMax: 2
		},
		attack1: {
			imageSrc: './game-assets/fighters/samuraiMack/Attack1.png',
			framesMax: 6
		},
		takeHit: {
			imageSrc: './game-assets/fighters/samuraiMack/Take Hit - white silhouette.png',
			framesMax: 4
		},
		death: {
			imageSrc: './game-assets/fighters/samuraiMack/Death.png',
			framesMax: 4
		}		
	},
	attackBox: {
		offset: {
			x:100,
			y:50
		},
		width: 150,
		height: 50
	}
});

console.log(player)

const keys = {
	a: {
		pressed: false
	},
	d: {
		pressed: false
	},
	ArrowLeft: {
		pressed: false
	},
	ArrowRight: {
		pressed: false
	}
}

const enemy = new Fighter({
	position:{
		x:400,
		y:100
	},
	velocity:{
		x:0,
		y:0
	},
	color: 'blue',
	offset: {
		x: 50,
		y: 0
	},
	imageSrc: './game-assets/fighters/kenji/Idle.png',
	framesMax: 4,
	scale: 2.5,
	offset: {
		x: 215,
		y: 167
	},
	sprites: {
		idle: {
			imageSrc: './game-assets/fighters/kenji/Idle.png',
			framesMax: 4
		},
		run: {
			imageSrc: './game-assets/fighters/kenji/Run.png',
			framesMax: 8
		},
		jump: {
			imageSrc: './game-assets/fighters/kenji/Jump.png',
			framesMax: 2
		},
		fall: {
			imageSrc: './game-assets/fighters/kenji/Fall.png',
			framesMax: 2
		},
		attack1: {
			imageSrc: './game-assets/fighters/kenji/Attack1.png',
			framesMax: 4
		},
		takeHit: {
			imageSrc: './game-assets/fighters/kenji/Take hit.png',
			framesMax: 3
		},
		death: {
			imageSrc: './game-assets/fighters/kenji/Death.png',
			framesMax: 7
		}		
	},
	attackBox: {
		offset: {
			x:-170,//we should have offset x equal to width if fighter is facing toeards left side of screen
			y: 50
		},
		width: 170,
		height: 50
	}
})

deacreaseTimer()

function animate(){
	window.requestAnimationFrame(animate)
	c.fillStyle = 'black'
	c.fillRect(0,0,canvas.width,canvas.height)
	background.update()
	shop.update()
	player.update()
	enemy.update()

	//player movement
	player.velocity.x = 0
	if (keys.a.pressed && player.lastKeyPressed === 'a') {
		player.velocity.x = -5
		player.switchSprite('run')
	} else if (keys.d.pressed && player.lastKeyPressed === 'd') {
		player.velocity.x = 5
		player.switchSprite('run')
	} else {
		player.switchSprite('idle')
	}

	if (player.velocity.y < 0) {
		player.switchSprite('jump')
	}else if (player.velocity.y > 0) {
		player.switchSprite('fall')
	}

	//enemy movement
	enemy.velocity.x = 0
	if (keys.ArrowLeft.pressed && enemy.lastKeyPressed === 'ArrowLeft') {
		enemy.velocity.x = -5
		enemy.switchSprite('run')
	} else if (keys.ArrowRight.pressed && enemy.lastKeyPressed === 'ArrowRight') {
		enemy.velocity.x = 5
		enemy.switchSprite('run')
	} else {
		enemy.switchSprite('idle')
	}

	if (enemy.velocity.y < 0) {
		enemy.switchSprite('jump')
	}else if (enemy.velocity.y > 0) {
		enemy.switchSprite('fall')
	}

	//detect for collision
	if(
		rectangularCollisionConditions({
			rectangle1: player,
			rectangle2: enemy
		})
		&&
		player.isAttacking
		 &&
		 player.frameCurrent === 4 //framesCurrent === 4 bcz we want enemy health to deacrease after player hits the enemy with sword not when player takes out his sword
	) {
		enemy.takeHit()
		player.isAttacking = false //setting false bcz if we dont do this then the code inside if will run multiple times even though we pressed space bar only one time
		if(gsap.to){
				gsap.to('#enemyHealth', {
				width: enemy.health + '%'
			})
			} else {
				document.querySelector('#enemyHealth').style.width = enemy.health + '%'
			}
	}

		// if player misses
		if (player.isAttacking && player.frameCurrent === 4 ) {
			player.isAttacking = false //setting false bcz not doing this will set isAttacking always true and this may cause enemy to lose health if player rec. touches enemy rec. even if player doesn't strike to enemy 
		}

		//player gets hit
		if(
		rectangularCollisionConditions({
			rectangle1: enemy,
			rectangle2: player
		})
		&&
		enemy.isAttacking
		&&
		enemy.frameCurrent === 2
	) {
		player.takeHit()
		enemy.isAttacking = false 
		player.health -= 10
		if(gsap.to){
				gsap.to('#playerHealth', {
				width: player.health + '%'
			})
			} else {
				document.querySelector('#playerHealth').style.width = player.health + '%'
			}
	}

	// if enemy misses
		if (enemy.isAttacking && enemy.frameCurrent === 2 ) {
			enemy.isAttacking = false 
		}

	// end game based on health
	if (enemy.health <= 0 || player.health<=0 ) {
		determineWiner({ player, enemy, timerId})
	}
}
animate()

window.addEventListener('keydown', (event) => {
	if (!player.dead) {
		switch (event.key){
			case 'd':
				keys.d.pressed = true
				player.lastKeyPressed = 'd' // this lastKeyPressed thing isn't mandetory but we are doing this for getting even more accurate results
				break
			case 'a':
				keys.a.pressed = true
				player.lastKeyPressed = 'a'
				break
			case 'w':
				player.velocity.y = -20
				break
			case ' ':
				player.attack()
		}
	}

	if (!enemy.dead) {
		switch(event.key) {
			case 'ArrowRight':
				keys.ArrowRight.pressed = true
				enemy.lastKeyPressed = 'ArrowRight'
				break
			case 'ArrowLeft':
				keys.ArrowLeft.pressed = true
				enemy.lastKeyPressed = 'ArrowLeft'
				break
			case 'ArrowUp':
				enemy.velocity.y = -20
				break
			case 'ArrowDown':
				enemy.attack()
				break
		}
	}
}
)

window.addEventListener('keyup', (event) => {
	switch (event.key){
	case 'd':
		keys.d.pressed = false
		break
	case 'a':
		keys.a.pressed = false
		break
	case 'ArrowRight':
		keys.ArrowRight.pressed = false
		break
	case 'ArrowLeft':
		keys.ArrowLeft.pressed = false
		break
	}
})
