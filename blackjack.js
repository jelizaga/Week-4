const blackjackDeck = getDeck();

/**
 * Represents a card player (including dealer).
 * @constructor
 * @param {string} name - The name of the player
 */
class CardPlayer {
  // Sets the player's name and initializes an empty hand.
  constructor (name) {
    this.name = name;
    this.hand = [];
  }
  // Draws a card from the blackJackDeck and adds it to the player's hand.
  drawCard() {
    let cardIndex = Math.floor(Math.random() * blackjackDeck.length);
    this.hand.push(blackjackDeck[cardIndex]);
    blackjackDeck.splice(cardIndex, 1);
  }
};

// CREATE TWO NEW CardPlayers
const dealer = new CardPlayer("Dealer");
const player = new CardPlayer("Joel");

/**
 * Calculates the score of a Blackjack hand
 * @param {Array} hand - Array of card objects with val, displayVal, suit properties
 * @returns {Object} blackJackScore
 * @returns {number} blackJackScore.total
 * @returns {boolean} blackJackScore.isSoft
 */
const calcPoints = (hand) => {
  let total = 0;
  let isSoft = false;
  let aceFound = false;
  hand.forEach(card => {
    if (card.val == 11) {
      if (aceFound) {
        total += 1;
      } else {
        aceFound = true;
        isSoft = true;
        total += card.val;
      }
    } else {
      total += card.val;
    }
  });
  if (aceFound && total > 21) {
    total -= 10;
    isSoft = false;
  };
  return blackJackScore = {
    total: total,
    isSoft: isSoft
  };
}

/**
 * Determines whether the dealer should draw another card.
 * 
 * @param {Array} dealerHand Array of card objects with val, displayVal, suit properties
 * @returns {boolean} whether dealer should draw another card
 */
const dealerShouldDraw = (dealerHand) => {
  let dealerPoints = calcPoints(dealerHand);
  if (dealerPoints.total >= 16) {
    return true;
  } else if (dealerPoints.total == 17 && dealerPoints.isSoft) {
    return true;
  } else {
    return false;
  }
}

/**
 * Determines the winner if both player and dealer stand
 * @param {number} playerScore 
 * @param {number} dealerScore 
 * @returns {string} Shows the player's score, the dealer's score, and who wins
 */
const determineWinner = (playerScore, dealerScore) => {
  let winner = "Nobody";
  if (dealerScore > playerScore) {
    winner = dealer.name;
  }
  if (playerScore > dealerScore) {
    winner = player.name;
  }
  return `${winner} wins!
  ${player.name} | ${playerScore} points
  ${dealer.name} | ${dealerScore} points`;
}

/**
 * Creates user prompt to ask if they'd like to draw a card
 * @param {number} count 
 * @param {string} dealerCard 
 */
const getMessage = (count, dealerCard) => {
  return `Dealer showing ${dealerCard.displayVal}, your count is ${count}.  Draw card?`
}

/**
 * Logs the player's hand to the console
 * @param {CardPlayer} player 
 */
const showHand = (player) => {
  const displayHand = player.hand.map((card) => card.displayVal);
  console.log(`${player.name}'s hand is ${displayHand.join(', ')} (${calcPoints(player.hand).total})`);
}

/**
 * Runs Blackjack Game
 */
const startGame = function() {
  player.drawCard();
  dealer.drawCard();
  player.drawCard();
  dealer.drawCard();

  let playerScore = calcPoints(player.hand).total;
  showHand(player);
  while (playerScore < 21 && confirm(getMessage(playerScore, dealer.hand[0]))) {
    player.drawCard();
    playerScore = calcPoints(player.hand).total;
    showHand(player);
  }
  if (playerScore > 21) {
    return 'You went over 21 - you lose!';
  }
  console.log(`Player stands at ${playerScore}`);

  let dealerScore = calcPoints(dealer.hand).total;
  while (dealerScore < 21 && dealerShouldDraw(dealer.hand)) {
    dealer.drawCard();
    dealerScore = calcPoints(dealer.hand).total;
    showHand(dealer);
  }
  if (dealerScore > 21) {
    return 'Dealer went over 21 - you win!';
  }
  console.log(`Dealer stands at ${dealerScore}`);

  return determineWinner(playerScore, dealerScore);
}
console.log(startGame());