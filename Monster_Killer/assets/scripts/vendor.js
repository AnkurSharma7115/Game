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
  playerHealthBar.value = +health;
}

// JavaScript Code for Executing Game Fnctions

const PLAYER_ATTACK_VALUE = 10;
const MONSTER_ATTACK_VALUE = 14;
const PLAYER_STRONG_ATTACK = 17; //chance to attack on Monster
const HEAL_VALUE = 20

const MODE_ATTACK = 'ATTACK'; //MODE_ATTACK = 0
const MODE_STRONG_ATTACK = 'STRONG_ATTAcK'; //MODE_STRONG_ATTACK = 1

let battleLog = [];

const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';

let chosenMaxLife = 100;

let currentMosnterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;

let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

function writeToLog(ev, val, monsterHealth, playerHealth){
  let logEntry = {
    event : ev,
    value : val,
    finalMonsterHealth : monsterHealth,
    finalPlayerHealth : playerHealth,
  };  
  if(ev=== LOG_EVENT_PLAYER_ATTACK){
    logEntry.target = "MONSTER";
  }else if(ev=== LOG_EVENT_PLAYER_STRONG_ATTACK){
    logEntry.target = "MONSTER";
  }else if(ev=== LOG_EVENT_MONSTER_ATTACK){
    logEntry.target = "PLAYER";
  }else if(ev=== LOG_EVENT_PLAYER_HEAL){
    logEntry.target = "PLAYER"; 
  }else if(ev=== LOG_EVENT_GAME_OVER){
    logEntry = {
      event : ev,
      value : val,
      finalMonsterHealth : monsterHealth,
      finalPlayerHealth : playerHealth,
    };
  }
  battleLog.push(logEntry);
}

// attack on Player by Monster
function attackOnPlayer(){
  let healingHealth;
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);  
  currentPlayerHealth = currentPlayerHealth - playerDamage;
  writeToLog(LOG_EVENT_MONSTER_ATTACK, playerDamage, currentMosnterHealth, currentPlayerHealth);
  //using Bonus Life 
  if(currentPlayerHealth <= 0 && hasBonusLife)
  {
    alert("You're Loosing!! Bonus Heal will be Used Now");
    hasBonusLife = false;
    removeBonusLife();
    setPlayerHealth(HEAL_VALUE);
    currentPlayerHealth = HEAL_VALUE;
    healBtn.disabled = true;
    writeToLog(LOG_EVENT_PLAYER_HEAL, "PLAYER_AUTO_HEAL", currentMosnterHealth, currentPlayerHealth);

  }

  else if(currentMosnterHealth <= 0 && currentPlayerHealth > 0){
    alert("Hurray!!! You've WON!!!");
    writeToLog(LOG_EVENT_GAME_OVER, "PLAYER_WON", currentMosnterHealth, currentPlayerHealth);
  }else if(currentPlayerHealth <= 0 && currentMosnterHealth > 0){
    alert("OOPS!!! You LOOSE!!!");
    writeToLog(LOG_EVENT_GAME_OVER, "PLAYER_LOOSE", currentMosnterHealth, currentPlayerHealth);
  }else if(currentMosnterHealth <= 0 && currentPlayerHealth <= 0){
    alert("It's a DRAW MATCH!!");
    writeToLog(LOG_EVENT_GAME_OVER, "DRAW_MATCH", currentMosnterHealth, currentPlayerHealth);

  }
}

  //creating function to dealing special attacks on Monster
function attackWithChance(attackMode){
            let damageOnMonster;
            let logEvents;
            //special case for Attack on Moster
            if(attackMode === MODE_ATTACK){
              damageOnMonster = PLAYER_ATTACK_VALUE;
              logEvents = LOG_EVENT_PLAYER_ATTACK;
            }else if(attackMode === MODE_STRONG_ATTACK){
              damageOnMonster = PLAYER_STRONG_ATTACK; 
              logEvents = LOG_EVENT_PLAYER_STRONG_ATTACK;
            }

            const monsterDamage = dealMonsterDamage(damageOnMonster);
            currentMosnterHealth = currentMosnterHealth - monsterDamage;
            writeToLog(logEvents, monsterDamage, currentMosnterHealth, currentPlayerHealth);
            
            //attack on Player remains normal
            attackOnPlayer();
            
            //Reload
            if((currentPlayerHealth <= 0 && hasBonusLife === false) || currentMosnterHealth <=0)
            {
              attackBtn.disabled = true;
            }
            
}

function attackHandler(){
  attackWithChance(MODE_ATTACK);
}

// special attack on Monster
function strongAttackHandler(){
  attackWithChance(MODE_STRONG_ATTACK);
  strongAttackBtn.disabled = true;
}

 //heal Player along with Monster Attack
function healPlayerHandler(){
  let healVal=0;
  if(currentPlayerHealth === chosenMaxLife){
    alert("You can't heal until Hitting the first Attack");
  }else{ 
    if(currentPlayerHealth >= chosenMaxLife - HEAL_VALUE){
      alert("You can't heal more than max. initial health");
      healVal = chosenMaxLife - currentPlayerHealth;
    }else{
      healVal = HEAL_VALUE;
    }
    increasePlayerHealth(healVal);
    alert("Your Bonus Heal Used");
    healBtn.disabled = true; 
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealth = currentPlayerHealth + healVal;
     attackOnPlayer();
    writeToLog(LOG_EVENT_PLAYER_HEAL, "HEALING_PLAYER", currentMosnterHealth, currentMosnterHealth);
  }
}
function printLogHandler(){
  console.log(battleLog);
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler); 
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", printLogHandler);