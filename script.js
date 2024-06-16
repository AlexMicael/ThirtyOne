const CARDS = []; /* array of cards */
const CARD_NAMES = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];
const CARD_VALUES = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10]; /* array of card values */
const CARD_SUITS = ["Hearts", "Spades", "Diamonds", "Clubs"];
let playerDeck = []; /* set playerHand to this, array for player decks */
let discardDeck = [];

/* Decks of each of the players */
let DECK = [];
let cpuDeck1 = [];
let cpuDeck2 = [];
let cpuDeck3 = [];
let discard; /* Discard pile */

/* Value of each of the players' hands */
let playerSum = 0;
let cpu1Sum = 0;
let cpu2Sum = 0;
let cpu3Sum = 0;

/* Represents if the player has knocked */
let playerKnock = false;
let cpu1Knock = false;
let cpu2Knock = false;
let cpu3Knock = false;

let lastDiscard = false;

/* Number of strikes that each player has */
let playerStrike = 0;
let cpu1Strike = 0;
let cpu2Strike = 0;
let cpu3Strike = 0;
let roundNumber = 1;

/* REpresents if the player has been eliminated*/
let playerEliminated = false;
let cpu1Eliminated = false;
let cpu2Eliminated = false;
let cpu3Eliminated = false;

let cpu1Message = "";
let cpu2Message = "";
let cpu3Message = "";

/* Resets elimination status of alls players before the start of a new game */
function resetEliminated() {
    playerEliminated = false;
    cpu1Eliminated = false;
    cpu2Eliminated = false;
    cpu3Eliminated = false;
}

/** Sets up the decks */
function initialize() {
    playerDeck = [];
    discardDeck = [];
    DECK = [];
    cpuDeck1 = [];
    cpuDeck2 = [];
    cpuDeck3 = [];
    discard = false;
    playerKnock = false;
    cpu1Knock = false;
    cpu2Knock = false;
    cpu3Knock = false;
    makeDeck();
    lastDiscard = false;
    dicard = false;
    DECK = CARDS;
    for (i = 0; i < 3; i++) {
        let randomCard = parseInt(Math.random() * DECK.length);
        playerDeck.push(DECK[randomCard]);
        DECK.splice(randomCard, 1);
    }
    if (!cpu1Eliminated) {
        for (i = 0; i < 3; i++) {
            let randomCard = parseInt(Math.random() * DECK.length);
            cpuDeck1.push(DECK[randomCard]);
            DECK.splice(randomCard, 1);
        }
    }
    if (!cpu2Eliminated) {
        for (i = 0; i < 3; i++) {
            let randomCard = parseInt(Math.random() * DECK.length);
            cpuDeck2.push(DECK[randomCard]);
            DECK.splice(randomCard, 1);
        }
    }
    if (!cpu3Eliminated) {
        for (i = 0; i < 3; i++) {
            let randomCard = parseInt(Math.random() * DECK.length);
            cpuDeck3.push(DECK[randomCard]);
            DECK.splice(randomCard, 1);
        }
    }
    let randomCard = parseInt(Math.random() * DECK.length);
    discardDeck.push(DECK[randomCard]);
    DECK.splice(randomCard, 1);
    renderDeck();
    renderPile();
    playerSum = cpuKnock(playerDeck);
    cpu1Sum = cpuKnock(cpuDeck1);
    cpu2Sum = cpuKnock(cpuDeck2);
    cpu3Sum = cpuKnock(cpuDeck3);
    updateStrikes();
    document.getElementById("message").innerHTML = "card game go brrrr";
    document.getElementById("myModal").innerHTML = "<div class='modal-content'><div class='modal-header'><h2>CPU1-3 Has Knocked!</h2></div><div class='modal-body'><p>This is the Final Turn of Round</p><p>Pick Hit or Discard to Continue!</p></div><div class='modal-footer'><h3 class='button-rack'><a class='button' id='hitID' onclick='lastHit()'>+ Hit</a><a class='button' id='discardID' onclick='lastDiscardButton()'>+ Discard</a></h3></div></div>";
}

/** Game loop if player is eliminated */
function withoutPlayerLoop() {
    console.log("player eliminated, cpu left");
    let gameRun = true;
    while (gameRun) {
        if (!cpu1Eliminated) cpuTurn1();
        if (!cpu2Eliminated) cpuTurn2();
        if (!cpu3Eliminated) cpuTurn3();
        compareSum(playerSum, cpu1Sum, cpu2Sum, cpu3Sum);
        if ((cpu1Strike > 2) && (cpu1Eliminated == false)) {
            console.log("cpu 1 eliminated");
            cpu1Eliminated = true;
        }
        if ((cpu2Strike > 2) && (cpu2Eliminated == false)) {
            console.log("cpu 2 eliminated");
            cpu2Eliminated = true;
        }
        if ((cpu3Strike > 2) && (cpu3Eliminated == false)) {
            console.log("cpu 3 eliminated");
            cpu3Eliminated = true;
        }
        if (cpu1Eliminated && cpu2Eliminated) gameRun = false;
        if (cpu2Eliminated && cpu3Eliminated) gameRun = false;
        if (cpu1Eliminated && cpu3Eliminated) gameRun = false;
    }
    for (var i = 0; i < document.getElementsByClassName("a").length; i++) {
        document.getElementsByClassName("a")[i].onclick = 'gameOver()';
    }
    for (var i = 0; i < document.getElementsByClassName("card").length; i++) {
        document.getElementsByClassName("card")[i].onclick = 'gameOver()';
    }
    let winMessage = "";
    if (cpu3Strike < 3) winMessage = "CPU 3 Won in " + roundNumber + " Turns!";
    if (cpu2Strike < 3) winMessage = "CPU 2 Won in " + roundNumber + " Turns!";
    if (cpu1Strike < 3) winMessage = "CPU 1 Won in " + roundNumber + " Turns!";
    document.getElementById("message").innerHTML = "Game Over! " + winMessage;
}

/** End of Game */
function gameOver() {
    document.getElementById("message").innerHTML = "Reload Page to Play Again";
}

/** Makes card object */
function card(name, value, suit) {
    this.name = CARD_NAMES[name]; /* assigns a name to the card */
    this.value = CARD_VALUES[value]; /* assigns a value to the card */
    this.suit = CARD_SUITS[suit]; /* assigns a suit to the card */
}

/** Makes the whole deck */
function makeDeck() {
    for (let i = 0; i < CARD_SUITS.length; i++) {
        for (let j = 0; j < CARD_VALUES.length; j++) {
            const newCard = new card(j, j, i); // creates a new card
            CARDS.push(newCard); // adds the new card to the deck
        }
    }
}

/** Draws a card */
function hit() {
    if (!playerKnock) {
        if (!discard) {
            if (DECK.length <= 0) {
                document.getElementById("message").innerHTML = "No more cards in the deck";
            } else {
                document.getElementById("message").innerHTML = "Choose one of your card to discard!";
                let randomCard = parseInt(Math.random() * DECK.length);
                drawnCard = DECK[randomCard];
                playerDeck.push(drawnCard);
                DECK.splice(randomCard, 1);
                renderDeck();
            }
            renderDeck();
            discard = true;

        } else {
            document.getElementById("message").innerHTML = "Discard a card first!"
        }
    }
    playerSum = cpuKnock(playerDeck);
}

/** Removes a card from a player's pile */
function discardCard(dcard) {
    if (discard) {
        if (!lastDiscard) {
            cpuTurn1();
            cpuTurn2();
            cpuTurn3();
        }
        for (let i = 0; i < playerDeck.length; i++) {
            let cardDescription = playerDeck[i]['name'];
            if (playerDeck[i]['suit'] == 'Hearts') cardDescription = cardDescription + "♥";
            if (playerDeck[i]['suit'] == 'Spades') cardDescription = cardDescription + "♠";
            if (playerDeck[i]['suit'] == 'Diamonds') cardDescription = cardDescription + "♦";
            if (playerDeck[i]['suit'] == 'Clubs') cardDescription = cardDescription + "♣";
            if (cardDescription == dcard.innerText) {
                discardDeck.push(playerDeck[i]); // puts the card in the discard pile
                playerDeck.splice(i, 1); // deletes the card from the player's deck
                document.getElementById("message").innerHTML = cpu1Message + " " + cpu2Message + " " + cpu3Message + " You discarded  " + cardDescription + ". " + "Click Discard/Hit to continue!";
                discard = false;
            }
        }
        renderDeck();
        renderPile();
    } else {
        document.getElementById("message").innerHTML = "You have to hit a card before discarding another!"
    }
}

/** Takes card from discard pile */
function discard2() {
    if (!playerKnock) {
        if (!discard) {
            if (discardDeck.length <= 0) {
                document.getElementById("message").innerHTML = "No more cards in the discarded deck";
            }
            else {
                document.getElementById("message").innerHTML = "Choose one of your card to discard!";
                playerDeck.push(discardDeck[0]); // adds card to the player's deck
                discardDeck.splice(0, 1); // removes card from discard pile
            }
            renderDeck();
            renderPile();
            discard = true;
        }
        else {
            document.getElementById("message").innerHTML = "Discard a card first!";
        }
    } else {
    }
    playerSum = cpuKnock(playerDeck);
}

/** Renders the deck */
function renderDeck() {
    document.getElementById('playerHand').innerHTML = '';
    for (var i = 0; i < playerDeck.length; i++) {
        var card = document.createElement("div");
        var icon = '';
        var loadedCard = playerDeck[i];
        if (loadedCard['suit'] == 'Hearts') icon = '&hearts;';
        else if (loadedCard['suit'] == 'Spades') icon = '&spades;';
        else if (loadedCard['suit'] == 'Diamonds') icon = '&diams;';
        else icon = '&clubs;';
        if ((loadedCard['suit'] == 'Hearts') || (loadedCard['suit'] == 'Diamonds')) card.innerHTML = "<span style='color:red;'>" + loadedCard['name'] + '' + icon + "</span>";
        else card.innerHTML = loadedCard['name'] + icon;
        card.classList.add('card');
        card.classList.add(loadedCard['suit']);
        card.setAttribute("onclick", "discardCard(this);");
        document.getElementById("playerHand").appendChild(card);
    }
}

/** Calculates the sum of cards */
function cpuKnock(originalDeck) {
    console.log(originalDeck);
    var heartSum = 0;
    var diamondSum = 0;
    var clubSum = 0;
    var spadeSum = 0;
    for (var j = 0; j < originalDeck.length; j++) {
        if (originalDeck[j]['suit'] == 'Hearts') {
            heartSum += originalDeck[j]['value'];
        }
        if (originalDeck[j]['suit'] == 'Diamonds') {
            diamondSum += originalDeck[j]['value'];
        }
        if (originalDeck[j]['suit'] == 'Spades') {
            spadeSum += originalDeck[j]['value'];
        }
        if (originalDeck[j]['suit'] == 'Clubs') {
            clubSum += originalDeck[j]['value'];
        }
    }
    if (((heartSum >= diamondSum) && (heartSum >= clubSum)) && (heartSum >= spadeSum)) {
        return heartSum;
    } else if (((diamondSum >= spadeSum) && (diamondSum >= heartSum)) && (diamondSum >= clubSum)) {    
        return diamondSum;
    } else if (((spadeSum >= heartSum) && (spadeSum >= clubSum)) && (spadeSum >= spadeSum)) {              
        return spadeSum;
    } else {                     
        return clubSum;
    }
}

/** Renders the deck and discard cards */
function renderPile() {
    document.getElementById('pile').innerHTML = '';
    var deckCard = document.createElement("div");
    var loadedCard = DECK[0];
    deckCard.innerHTML = "<img height=130px width=80px src='https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Card_back_02.svg/703px-Card_back_02.svg.png' alt='card back'>"; //Messes up card position
    deckCard.innerHTML = "?"; //Temporary Fix
    deckCard.classList.add('card');
    deckCard.classList.add(loadedCard['suit']);
    document.getElementById("pile").appendChild(deckCard);
    if (discardDeck.length > 0) {
        deckCard = document.createElement("div");
        var icon = '';
        loadedCard = discardDeck[0];
        if (loadedCard['suit'] == 'Hearts') icon = '&hearts;';
        else if (loadedCard['suit'] == 'Spades') icon = '&spades;';
        else if (loadedCard['suit'] == 'Diamonds') icon = '&diams;';
        else icon = '&clubs;';
        if ((loadedCard['suit'] == 'Hearts') || (loadedCard['suit'] == 'Diamonds')) {
            deckCard.innerHTML = "<span style='color:red;'>" + loadedCard['name'] + '' + icon + "</span>";
        } else {
            deckCard.innerHTML = loadedCard['name'] + icon;
        }
        deckCard.classList.add('card');
        deckCard.classList.add(loadedCard['suit']);
        document.getElementById("pile").appendChild(deckCard);
    }
}

/** Updates the strikes counters */
function updateStrikes() {
    document.getElementById("pStrikes").innerHTML = "player strikes: " + playerStrike;
    document.getElementById("cpu1Strikes").innerHTML = "cpu 1 strikes: " + cpu1Strike;
    document.getElementById("cpu2Strikes").innerHTML = "cpu 2 strikes: " + cpu2Strike;
    document.getElementById("cpu3Strikes").innerHTML = "cpu 3 strikes: " + cpu3Strike;
}

/** Initiates knock */
function knock() {
    playerKnock = true;
    lastRound("player");
    document.getElementById("message").innerHTML = document.getElementById("message").innerHTML + "Your deck's value is " + playerSum + ".";
    compareSum(playerSum, cpu1Sum, cpu2Sum, cpu3Sum);
    console.log(playerSum + " " + cpu1Sum + " " + cpu2Sum + " " + cpu3Sum);
    let roundMessage = "Your deck's value is " + playerSum + ". " + "CPU 1 got " + cpu1Sum + ". " + "CPU 2 got " + cpu2Sum + ". " + "CPU 3 got " + cpu3Sum + ". ";
    let eliminationWarning = "";
    /* Player is eliminated */
    if ((playerStrike == 3) && (!playerEliminated)) {
        console.log("player eliminated");
        playerEliminated = true;
        eliminationWarning += "Player's Been Eliminated! ";
    }
    /* cpu1 is eliminated */
    if ((cpu1Strike == 3) && (!cpu1Eliminated)) {
        console.log("cpu 1 eliminated");
        cpu1Eliminated = true;
        eliminationWarning = "CPU 1's Been Eliminated! ";
    }
    /* cpu2 is eliminated */
    if ((cpu2Strike == 3) && (!cpu2Eliminated)) {
        console.log("cpu 2 eliminated");
        cpu2Eliminated = true;
        eliminationWarning = "CPU 2's Been Eliminated! ";
    }
    /* cpu3 is eliminated */
    if ((cpu3Strike == 3) && (!cpu3Eliminated)) {
        console.log("cpu 3 eliminated");
        cpu3Eliminated = true;
        eliminationWarning = "CPU 3's Been Eliminated! ";
    }
    initialize();
    roundNumber++;
    document.getElementById("message").innerHTML = roundMessage + eliminationWarning + "<br>" + "Time for Round " + roundNumber;
    if (playerEliminated) {
        withoutPlayerLoop();
    }
    if ((cpu1Eliminated && cpu2Eliminated) && (cpu3Eliminated && !playerEliminated)) {
        document.getElementById("winScreen").style.display = "block";
        document.getElementById("message").innerHTML = "Congratulations 🎉 <br>You won in " + (roundNumber - 1) + " turns!";
        for (var i = 0; i < document.getElementsByClassName("a").length; i++) {
            document.getElementsByClassName("a")[i].setAttribute('onclick', 'gameOver()');
        }
        for (var i = 0; i < document.getElementsByClassName("card").length; i++) {
            document.getElementsByClassName("card")[i].setAttribute('onclick', 'gameOver()');
        }
    }
}

/** Compares the players' sums */
function compareSum(player, cpu1, cpu2, cpu3) {
    console.log("player" + player);
    console.log("cpu1" + cpu1);
    console.log("cpu2" + cpu2);
    console.log("cpu3" + cpu3);
    let lowValue = Number.MAX_SAFE_INTEGER;
    if ((!playerEliminated) && (player < lowValue)) lowValue = player;
    if (!cpu1Eliminated) {
        if (cpu1 < lowValue) lowValue = cpu1;
    }
    if (!cpu2Eliminated) {
        if (cpu2 < lowValue) lowValue = cpu2;
    }
    if (!cpu3Eliminated) {
        if (cpu3 < lowValue) lowValue = cpu3;
    }
    if ((player == lowValue) && (!playerEliminated)) {
        console.log("player receives a strike");
        playerStrike++;
    }
    if ((cpu1 == lowValue) && (!cpu1Eliminated)) {
        console.log("cpu 1 receives a strike");
        cpu1Strike++;
    }
    if ((cpu2 == lowValue) && (!cpu2Eliminated)) {
        console.log("cpu 2 receives a strike");
        cpu2Strike++;
    }
    if ((cpu3 == lowValue) && (!cpu3Eliminated)) {
        console.log("cpu 3 receives a strike");
        cpu3Strike++;
    }
    updateStrikes();
}

/** Last round after CPU or player knocks */
function lastRound(initiater) {
    lastDiscard = true;
    let playersLeft = ["CPU1", "CPU2", "CPU3", "player"];
    for (var i = 0; i < playersLeft.length; i++) {
        if (playersLeft[i] == initiater) {
            playersLeft.splice(i, 1);
        }
    }
    for (var i = 0; i < playersLeft.length; i++) {
        if (playersLeft[i] == "player") {
            renderPile();
            var icon;
            if (discardDeck[0]['suit'] == 'Hearts') icon = '&hearts;';
            else if (discardDeck[0]['suit'] == 'Spades') icon = '&spades;';
            else if (discardDeck[0]['suit'] == 'Diamonds') icon = '&diams;';
            else icon = '&clubs;';
            document.getElementsByClassName("modal-header")[0].innerHTML = "<b><h2>" + initiater + " Has Knocked" + "</h2></b>";
            document.getElementsByClassName("modal-body")[0].innerHTML = "<p>" + "This is the Last Turn of Round " + roundNumber + "</p>" + "<p>" + "Pick Hit/Discard to Continue" + "</p>" + "<p>" + "P.S. The Topmost Discard Card is " + discardDeck[0]['name'] + icon + "</pr>";
            document.getElementById("myModal").style.display = "block";
        }
        if (playersLeft[i] == "CPU1") {
            cpuTurn1();
            renderPile();
        }
        if (playersLeft[i] == "CPU2") {
            cpuTurn2();
            renderPile();
        }
        if (playersLeft[i] == "CPU3") {
            cpuTurn3();
            renderPile();
        }
    }
}

/** CPU 1's actions */
function cpuTurn1() {
    if (!cpu1Eliminated) {
        if ((cpu1Sum > 24) && (!playerKnock && !cpu1Knock && !cpu2Knock && !cpu3Knock)) {
            cpu1Knock = true;
            console.log("cpu 1 - knock");
            cpu1Message = " CPU 1 has knocked!";
            lastRound("CPU1");
        } else {
            let actionNumber = parseInt(Math.random() * 2);
            // Hit
            if (actionNumber == 0) {
                console.log("cpu 1 - hit");
                if (DECK.length <= 0) {
                    cpuTurn1();
                } else {
                    cpu1Message = "CPU 1 hit the deck!";
                    let randomCard = parseInt(Math.random() * DECK.length);
                    drawnCard = DECK[randomCard];
                    cpuDeck1.push(drawnCard);
                    DECK.splice(randomCard, 1);
                    randomCard = parseInt(Math.random() * cpuDeck1.length);
                    discardDeck.push(cpuDeck1[randomCard]);
                    cpuDeck1.splice(randomCard, 1);
                }
            }
            // Discard
            if (actionNumber == 1) {
                console.log("cpu 1 - discard");
                if (discardDeck.length <= 0) {
                    console.log("cpu 1 - not enough cards - picked again");
                    cpuTurn1();
                } else {
                    cpu1Message = "CPU1 hit the discard deck!";
                    drawnCard = discardDeck[0];
                    cpuDeck1.push(drawnCard);
                    discardDeck.splice(0, 1);
                    let randomCard = parseInt(Math.random() * cpuDeck1.length);
                    discardDeck.push(cpuDeck1[randomCard]);
                    cpuDeck1.splice(parseInt(Math.random() * cpuDeck1.length), 1);
                    renderPile();
                }
            }
        }
        cpu1Sum = cpuKnock(cpuDeck1); // Calculates the value of the deck of cpu1
    } else {
        cpu1Message = "CPU 1 Skipped.";
    }
}

/** CPU 2's actions */
function cpuTurn2() {
    if (!cpu2Eliminated) {
        if ((cpu2Sum > 24) && (!playerKnock && !cpu1Knock && !cpu2Knock && !cpu3Knock)) {
            cpu2Knock = true;
            console.log("cpu 2 - knock");
            cpu2Message = " CPU 2 has knocked!";
            lastRound("CPU2");
        } else {
            let actionNumber = parseInt(Math.random() * 2);
            // Hit
            if (actionNumber == 0) {
                console.log("cpu 2 - hit");
                if (DECK.length <= 0) {
                    console.log("cpu 2 - not enough cards - picked again");
                    cpuTurn2();
                } else {
                    cpu2Message = "CPU 2 hit the deck!";
                    let randomCard = parseInt(Math.random() * DECK.length);
                    drawnCard = DECK[randomCard];
                    cpuDeck2.push(drawnCard);
                    DECK.splice(randomCard, 1);
                    randomCard = parseInt(Math.random() * cpuDeck2.length);
                    discardDeck.push(cpuDeck2[randomCard]);
                    cpuDeck2.splice(randomCard, 1);
                }
            }
            // Discard
            if (actionNumber == 1) {
                console.log("cpu 2 - discard");
                if (discardDeck.length <= 0) {
                    console.log("cpu 2 - not enough cards - picked again");
                    cpuTurn2();
                } else {
                    cpu2Message = "CPU 2 hit the discard deck!";
                    drawnCard = discardDeck[0];
                    cpuDeck2.push(drawnCard);
                    discardDeck.splice(0, 1);
                    let randomCard = parseInt(Math.random() * cpuDeck2.length);
                    discardDeck.push(cpuDeck2[randomCard]);
                    cpuDeck2.splice(parseInt(Math.random() * cpuDeck2.length), 1);
                    renderPile();
                }
            }
        }
        cpu2Sum = cpuKnock(cpuDeck2); // Calculates the value of the deck of cpu2
    } else {
        cpu2Message = "CPU 2 Skipped.";
    }

}

/** CPU 3's actions */
function cpuTurn3() {
    if (!cpu3Eliminated) {
        if ((cpu3Sum > 24) && (!playerKnock && !cpu1Knock && !cpu2Knock && !cpu3Knock)) {
            cpu3Knock = true;
            console.log("cpu 3 - knock");
            cpu3Message = " CPU 3 has knocked!";
            lastRound("CPU3");
        } else {
            let actionNumber = parseInt(Math.random() * 2);
            // Hit
            if (actionNumber == 0) {
                console.log("cpu 3 - hit");
                if (DECK.length <= 0) {
                    console.log("cpu 3 - not enough cards - picked again");
                    cpuTurn3();
                } else {
                    cpu3Message = "CPU 3 hit the deck!";
                    let randomCard = parseInt(Math.random() * DECK.length);
                    drawnCard = DECK[randomCard];
                    cpuDeck3.push(drawnCard);
                    DECK.splice(randomCard, 1);
                    randomCard = parseInt(Math.random() * cpuDeck3.length);
                    discardDeck.push(cpuDeck3[randomCard]);
                    cpuDeck3.splice(randomCard, 1);
                }
            }
            // Discard
            if (actionNumber == 1) {
                console.log("cpu 3 - discard");
                if (discardDeck.length <= 0) {
                    console.log("cpu 3 - not enough cards - picked again");
                    cpuTurn3();
                } else {
                    cpu3Message = "CPU 3 hit the discard deck!";
                    drawnCard = discardDeck[0];
                    cpuDeck3.push(drawnCard);
                    discardDeck.splice(0, 1);
                    let randomCard = parseInt(Math.random() * cpuDeck3.length);
                    discardDeck.push(cpuDeck3[randomCard]);
                    cpuDeck3.splice(parseInt(Math.random() * cpuDeck3.length), 1);
                    renderPile();
                }
            }
        }
        cpu3Sum = cpuKnock(cpuDeck3); // Calculates the value of cpu3
    } else {
        cpu3Message = "CPU 3 Skipped.";
    }

}

/** Hit after knock */
function lastHit() {
    if (DECK.length <= 0) {
        document.getElementsByClassName("modal-body")[0].innerHTML = document.getElementsByClassName("modal-body")[0].innerHTML + "<p>" + "No More Cards in the Deck - Pick Something Else" + "</p>";
    } else {
        let randomCard = parseInt(Math.random() * DECK.length);
        drawnCard = DECK[randomCard];
        playerDeck.push(drawnCard);
        DECK.splice(randomCard, 1);
        renderDeck()
        document.getElementsByClassName("modal-body")[0].innerHTML = document.getElementsByClassName("modal-body")[0].innerHTML + "<br><p>" + "Now Pick a Card to Discard:" + "</p>";
    }
    renderDeck();
    renderDeckButton();
    discard = true;
    playerSum = cpuKnock(playerDeck);
}

/** Discard After Knock */
function lastDiscardButton() {
    if (discardDeck.length <= 0) {
        document.getElementsByClassName("modal-body")[0].innerHTML = document.getElementsByClassName("modal-body")[0].innerHTML + "<p>" + "No More Cards in the Discard Deck - Pick Something Else" + "</p>";
    } else {
        drawnCard = discardDeck[0];
        playerDeck.push(drawnCard);
        discardDeck.splice(0, 1);
        renderDeck();
        document.getElementsByClassName("modal-body")[0].innerHTML = document.getElementsByClassName("modal-body")[0].innerHTML + "<br><p>" + "Now Pick a Card to Discard:" + "</p>";
    }
    renderDeck();
    renderDeckButton();
    discard = true;
    playerSum = cpuKnock(playerDeck);
}

/** Renders the deck as buttons during knock */
function renderDeckButton() {
    for (var i = 0; i < playerDeck.length; i++) {
        var a = document.createElement("a");
        var icon = '';
        var loadedCard = playerDeck[i];
        if (loadedCard['suit'] == 'Hearts') icon = '&hearts;';
        else if (loadedCard['suit'] == 'Spades') icon = '&spades;';
        else if (loadedCard['suit'] == 'Diamonds') icon = '&diams;';
        else icon = '&clubs;';
        if ((loadedCard['suit'] == 'Hearts') || (loadedCard['suit'] == 'Diamonds')) a.innerHTML = loadedCard['name'] + '' + icon;
        else a.innerHTML = loadedCard['name'] + icon;
        a.classList.add('button');
        a.classList.add(loadedCard['suit']);
        a.setAttribute("onclick", "lastDiscard = true; discardCard(this); document.getElementById('myModal').style.display = 'none'; knock();");
        document.getElementsByClassName("button-rack")[0].appendChild(a);
        document.getElementById("hitID").style.display = "none";
        document.getElementById("discardID").style.display = "none";
    }
}