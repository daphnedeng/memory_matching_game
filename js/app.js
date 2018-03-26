//select elements
const deck = $('.deck');
const restart = $('.restart');
const replay = $('#play-again');
const notplay = $('#close-popup');
let openCardList = [];
let moves = 0;
let matchFound = 0;
let timer;

//Create a list that holds all of your cards
let cards = ['fa fa-diamond', 'fa fa-paper-plane-o', 'fa fa-birthday-cake', 'fa fa-bolt', 'fa fa-smile-o', 'fa fa-birthday-cake', 'fa fa-pagelines', 'fa fa-bicycle', 'fa fa-diamond', 'fa fa-gamepad', 'fa fa-pagelines', 'fa fa-gamepad', 'fa fa-bolt', 'fa fa-bicycle', 'fa fa-paper-plane-o', 'fa fa-smile-o']

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

//create cards.
function createCards() {
	//first, randomized the cards
	shuffle(cards);
  	cards.forEach(card => {
		deck.append(`<li class="card"><i class="${card}"></i></li>`)
	});
}

function startGame() {
	location.reload();
}

function showCard() {
	//add onclick event to all the card
	$('.card').on('click', function() {
		if ($(this).hasClass('show open')) {
			return;
		}
		$(this).toggleClass('show open animated jello');
		openCardList.push($(this));
		isMatch();
	})	
}

//check the open cards match
function isMatch() {
	if (openCardList.length === 2) {
		//if they match
		if (openCardList[0][0].innerHTML == openCardList[1][0].innerHTML) {
		//add animation, and a class 'match' to change the color
		$(openCardList[0][0]).addClass('match animated flip');
		$(openCardList[1][0]).addClass('match animated flip');
		//update matchFound and moves.
		matchFound++;
		moves++;
		clearOpenCardList();
		//stop timer when all matches are found.
		setTimeout(stopTimer, 1200);
		} else {
			//if they don't match, add a class 'not-match' to change the color
		$(openCardList[0][0]).addClass('not-match');
		$(openCardList[1][0]).addClass('not-match');
		//update moves;
		moves++;
		clearOpenCardList();
		//and hide the card after 1200ms.
		setTimeout(hideCard, 1200);
		}		
	}
	updateMoves();
} 

//hide the 'not-match' cards
function hideCard() {
	$('.card').each(function() {
		if ($(this).hasClass('not-match')) {
			$(this).attr('class', 'card');
		}
	})
}

//clear openCardList
function clearOpenCardList() {
	openCardList = [];
} 

//update numbers of moves
function updateMoves() {
	$('.moves').text(moves);
	updateStar();
}

//update start base on moves
function updateStar() {
	if (moves > 26 && moves <= 40) {
		$('#one-star').remove();
	} 
	if (moves <= 26 && moves >15) {
		$('#two-star').remove();
	}
}

//start timer when the player start playing
function startTimer() {
	let count = 0;
	$('.card').on('click', function() {
		count++;
		if (count === 1) {
			//timer function from https://stackoverflow.com/a/7910506
			var sec = 0;
			function pad(val) {
				return val > 9 ? val : "0" + val;
			}
			timer = setInterval(function () {
				$('.seconds').html(pad(++sec % 60));
				$('.minutes').html(pad(parseInt(sec / 60, 10)));
			}, 1000);
		}
	})
}

//stop timer when all matches are found
function stopTimer() {
	if (matchFound === 8) {
		clearInterval(timer);
		//and open popup
		togglePopup();
	}
}

//toggle popup window
function togglePopup() {
	$('#standalone').popup('show');
	replay.on('click', function() {
		startGame();
	})
	notplay.on('click', function() {
		$('#standalone').popup('hide');
	});
}

//overlay popup http://dev.vast.com/jquery-popup-overlay/
$('#standalone').popup({
	color: 'white',
	opacity: 0.96,
	transition: '0.3s',
	scrolllock: true
  });

$('#standalone').css('text-align', 'center');

//when click on the restart icon, initialize the game, all cards face down
function restartGame() {
	restart.on('click', function() {
		startGame();
	})
}

//call the functions
createCards();
showCard();
startTimer();
restartGame();
