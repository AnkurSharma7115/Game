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

let chosenMaxLife = 100;

let currentMosnterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;

let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

// attack on Player by Monster
function attackOnPlayer(){
  let healingHealth;
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);  
  currentPlayerHealth = currentPlayerHealth - playerDamage;

  //using Bonus Life 
  if(currentPlayerHealth <= 0 && hasBonusLife)
  {
    console.log("Your current Health of Player" + currentPlayerHealth);
    
    alert("You're Loosing!! Bonus Heal will be Used Now");
    hasBonusLife = false;
    removeBonusLife();
    setPlayerHealth(HEAL_VALUE);
    currentPlayerHealth = HEAL_VALUE;
    healBtn.disabled = true;
  }

  else if(currentMosnterHealth <= 0 && currentPlayerHealth > 0){
    alert("Hurray!!! You've WON!!!");
  }else if(currentPlayerHealth <= 0 && currentMosnterHealth > 0){
    alert("OOPS!!! You LOOSE!!!");
  }else if(currentMosnterHealth <= 0 && currentPlayerHealth <= 0){
    alert("It's a DRAW MATCH!!");
  }
}

  //creating function to dealing special attacks on Monster
function attackWithChance(attackMode){
            let damageOnMonster;
            
            //special case for Attack on Moster
            if(attackMode === "ATTACK"){
              damageOnMonster = PLAYER_ATTACK_VALUE;
            }else if(attackMode === "STRONG_ATTACK"){
              damageOnMonster = PLAYER_STRONG_ATTACK; 
            }

            const monsterDamage = dealMonsterDamage(damageOnMonster);
            currentMosnterHealth = currentMosnterHealth - monsterDamage;
            
            //attack on Player remains normal
            attackOnPlayer();
            
            //Reload
            if((currentPlayerHealth <= 0 && hasBonusLife === false) || currentMosnterHealth <=0)
            {
              window.location.href = window.location.href ; 
            }
            
}

function attackHandler(){
  attackWithChance("ATTACK");
}

// special attack on Monster
function strongAttackHandler(){
  attackWithChance("STRONG_ATTACK");
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
  }
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler); 
healBtn.addEventListener("click", healPlayerHandler);