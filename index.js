
const strValueArray = ['A','2','3','4','5','6','7','8','9','T','J','Q','K'];
const suitArray = ['C','H','D','S'];
const payouts = [0,1,2,3,4,5,8,25,50,250];
var cardsSelected = [false,false,false,false,false];
var cardsDealt = true;
var hand = [0,0,0,0,0]; // the 5 dealt cards
const startingCredits = 20;
var credits = startingCredits; // money

var cardImage = [];
for (let i=0; i<5; i++){
	cardImage[i] = document.getElementById("cardImage"+(i+1));
}

var dealButton = document.getElementById("dealButton");
var handText = document.getElementById("handText");
var creditsText = document.getElementById("creditsText");

var deck = [];

for (let i=0; i<5; i++){
	cardImage[i].src="images/BACK.png";
	cardImage[i].style.borderColor = "white";
}
creditsText.innerHTML = "Credit: "+credits;

function initialize(){
	deck = [];
	hand = [0,0,0,0,0];
	cardsSelected = [false,false,false,false,false];
	dealButton.innerHTML="Deal";
	handText.innerHTML = "";
	handText.style.color = "black";
	creditsText.innerHTML = "Credit: "+credits;

	for (let i=0; i<=51; i++){
		deck.push(i);
	}
	//Choose 5 cards
	for (let i=0; i<5; i++){
		var newCard = dealOneCard();
		hand[i] = newCard;
		cardImage[i].src="images/"+ getCardString(newCard) + ".png";
		cardImage[i].style.borderColor = "white";
	}
	cardsDealt = false;
	console.log(hand);
}

function getValue(absCard){
	var numValue = (absCard)%13 + 1;
	return strValueArray[numValue-1];
}

function getSuit(absCard){
	var numSuit = Math.floor((absCard)/13);
	return suitArray[numSuit];
}

function getCardString(absCard){
	return getValue(absCard)+"-"+getSuit(absCard);
}

function dealOneCard(){
	const i = Math.floor(Math.random() * deck.length)+1;
	var card = deck[i-1];
	deck.splice(i-1,1);
	return card;
}

function isRoyal(hand){
	var copyofHand = hand.slice();
	copyofHand.sort((a,b) => a-b);
	handString = JSON.stringify(copyofHand);
	return (handString == "[0,9,10,11,12]" || handString == "[13,22,23,24,25]" || handString == "[26,35,36,37,38]" || handString == "[39,48,49,50,51]");
}

function isFlush(hand){
	const set = new Set(hand.map(x => Math.floor(x/13)));
	return (set.size == 1);
}

function isStraight(hand){
	var mod13hand = hand.map(x => x%13);

	const set = new Set(mod13hand);
	if (set.size == 5){
		mod13hand.sort((a, b) => a - b);
		return ((mod13hand[0]==0 && mod13hand[1]==9) || (mod13hand[4] == mod13hand[0]+4));
	}
	else {
		return false;
	}
}


 // player attemps to select card n
function selectCard(n){
	if (!cardsDealt) { // in 1st half of hand (selecting phase)
		cardsSelected[n-1] = !(cardsSelected[n-1]);
		// TODO: change border color here
		if (cardsSelected[n-1]){
			cardImage[n-1].style.borderColor = "blue";
		} else{
			cardImage[n-1].style.borderColor = "white";
		}
	} else{ // in 2st half of hand, so don't do any selecting

	}
	console.log(cardsSelected);

}

function dealCards(){
	if (!cardsDealt){
		for (let i=0; i<5; i++){
			if (!cardsSelected[i]){
				var newCard = dealOneCard();
				hand[i] = newCard;
				cardImage[i].src="images/"+ getCardString(newCard) + ".png";
			}
		}
		cardsDealt = true;
		//console.log(hand);

		var rankCount = [0,0,0,0,0,0,0,0,0,0,0,0,0];

		for (let i=0; i<5; i++){
			rankCount[hand[i]%13]++;
		}

		var signature = [];
		for (let i=0;i<rankCount.length;i++){
			if (rankCount[i]>0){
				signature.push(rankCount[i]);
			}
		}
		signature.sort();
		//console.log(signature);
		sigString = JSON.stringify(signature);

		var pay=0;

		// Check to see what poker hand it is! *****************************************
		if (isRoyal(hand)){
			handText.style.color = "blue";
			handText.innerHTML = "Royal flush";
			pay = payouts[9];
		} else if (isFlush(hand) && isStraight(hand)){
			handText.style.color = "blue";
			handText.innerHTML = "Straight flush";
			pay = payouts[8];
		} else if (sigString == "[1,4]"){
			handText.style.color = "blue";
			handText.innerHTML = "Four of a kind";
			pay = payouts[7];
		} else if (sigString == "[2,3]"){
			handText.innerHTML = "Full house";
			pay = payouts[6];
		} else if (isFlush(hand)){
			handText.innerHTML = "Flush";
			pay = payouts[5];
		} else if (isStraight(hand)){
			handText.innerHTML = "Straight";
			pay = payouts[4];
		} else if (sigString == "[1,1,3]"){
			handText.innerHTML = "Three of a kind";
			pay = payouts[3];
		} else if (sigString == "[1,2,2]"){
			handText.innerHTML = "Two pair";
			pay = payouts[2];
		} else if (sigString == "[1,1,1,2]" && (rankCount[0]==2 || rankCount[10]==2 || rankCount[11]==2 || rankCount[12]==2)){
			handText.innerHTML = "Jacks or better";
			pay = payouts[1];
		}

		// Make payout!
		credits += pay;
		if (credits > 0){
			creditsText.style.color = "black";
		}
		creditsText.innerHTML = "Credit: "+credits;


		// Change text on deal button! (Pay 1 credit)
		if (credits>0){
			dealButton.innerHTML="Play 1 credit";
		}
		else{
			dealButton.innerHTML="Reload (" + startingCredits + " credits)";
		}
	} else if (credits>=1){ // start next hand
		credits -= 1;
		if (credits <= 0){
			creditsText.style.color = "red";
		}
		initialize();
	} else { // out of credits
		// RELOAD
		credits += startingCredits;
		creditsText.style.color = "black";
		dealButton.innerHTML="Play 1 credit";
		for (let i=0; i<5; i++){
			cardImage[i].src="images/BACK.png";
			cardImage[i].style.borderColor = "white";
		}
		creditsText.innerHTML = "Credit: "+credits;
		handText.innerHTML = "";
	} 

}





















