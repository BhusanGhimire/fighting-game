function rectangularCollisionConditions({rectangle1,rectangle2}){
	return (
		rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x 
		/* rectangle1.attackBox.position.x gives the co-ords of the rectangle1-attackBox's left side so we are adding rectangle1.attackBox.width in order to get the co-ords of the rectangle1-attackBox from it's rightSide and then we are checking if these co-ords exeeds the rectangle2-attckBox's left side's co-ords */
		&&
		rectangle1.attackBox.position.x <= rectangle2.attackBox.position.x + rectangle2.attackBox.width 
		/* and similarly shecking if the rectangle1 hasn't exeeded the rectangle2 and has rectangle1-attackBox's left side x co-ords is less than or equal to the rectangle2-attackBox's right side x co-ords */
		&&
		rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
		&&
		rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
		/*in summery, it checks if the rectangle1(including rectangle1's attack box) has touched or has overlapped (but not has exeeded and not is over and under) the rectangle2 (including rectangle2's attack box) */
	)
}

function determineWiner({player,enemy, timerId}){
	clearTimeout(timerId)
	document.querySelector('#displayText').style.display = 'flex'
	if(player.health === enemy.health){
			document.querySelector('#displayText').innerHTML = 'tie'
		} else if (player.health > enemy.health){
			document.querySelector('#displayText').innerHTML = 'Player1 wins'
		} else if (enemy.health > player.health){
			document.querySelector('#displayText').innerHTML = 'player2 wins'
		}
}

let timer = 20
let timerId
function deacreaseTimer(){
	if(timer > 0){
		timerId = setTimeout(deacreaseTimer,1000)
		timer--
		document.querySelector('#timer').innerHTML = timer
	}

	if(timer === 0){
		determineWiner({ player, enemy, timerId})
	}
}