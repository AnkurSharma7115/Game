const monsterHealthBar = document.getElementById('monster-health');
const playerHealthBar = document.getElementById('player-health');
const bonusLifeEl = document.getElementById('bonus-life');

const attackBtn = document.getElementById('attack-btn');
const strongAttackBtn = document.getElementById('strong-attack-btn');
const healBtn = document.getElementById('heal-btn');
const logBtn = document.getElementById('log-btn');

function adjustHealthBars(maxLife) {
  monsterHealthBar.max = maxLife;    //for progress bar
  monsterHealthBar.value = maxLife;   // for progress bar actual value
  
  playerHealthBar.max = maxLife;  //for progress bar
  playerHealthBar.value = maxLife;  // for progress bar actual value
}

function dealMonsterDamage(damage) {
  const dealtDamage = Math.random() * damage;
  monsterHealthBar.value = +monsterHealthBar.value - dealtDamage;  //converting to Int and updating value
  return dealtDamage;
}

function dealPlayerDamage(damage) {
  const dealtDamage = Math.random() * damage;
  playerHealthBar.value = +playerHealthBar.value - dealtDamage;   //converting to Int and updating value
  return dealtDamage;
}

function increasePlayerHealth(healValue) {
  playerHealthBar.value = +playerHealthBar.value + healValue; //converting to Int and updating value
}

function resetGame(value) {
  playerHealthBar.value = value;
  monsterHealthBar.value = value;
}

function removeBonusLife() {
  bonusLifeEl.parentNode.removeChild(bonusLifeEl);
}

function setPlayerHealth(health) {
  playerHealthBar.value = health;
}

// JavaScript Code for Executing Game Fnctions

const PLAYER_ATTACK_VALUE = 10;
const MONSTER_ATTACK_VALUE = 12;


let chosenMaxLife = 100;

let currentMosnterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;

adjustHealthBars(chosenMaxLife);

function attackHandler(){
  const monsterDamage = dealMonsterDamage(PLAYER_ATTACK_VALUE);
  currentMosnterHealth = currentMosnterHealth - monsterDamage;
  
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);  
  currentPlayerHealth = currentPlayerHealth - playerDamage;

  if(currentMosnterHealth <= 0 && currentPlayerHealth > 0){
    alert("Hurray!!! You've WON!!!");
  }else if(currentPlayerHealth <= 0 && currentMosnterHealth > 0){
    alert("OOPS!!! You LOOSE!!!");
  }else if(currentMosnterHealth <= 0 && currentPlayerHealth <= 0){
    alert("It's a DRAW MATCH!!");
  }
}

attackBtn.addEventListener("click", attackHandler);