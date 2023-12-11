import { prompt } from "./prompt.js";

class Pokemon {
  constructor(name, emoji, hp, attacks) {
    this.name = name;
    this.emoji = emoji;
    this.hp = hp;
    this.maxHp = this.hp;
    this.attacks = attacks;
  }
  randomAttack() {
    const randomIndex = Math.floor(Math.random() * this.attacks.length);
    return this.attacks[randomIndex];
  }
  logPokemon() {
    console.log(`${this.name} ${this.emoji} ${this.hp}/${this.maxHp}
  Attacks:
    `);
    this.logAttacks();
  }
  logAttacks() {
    this.attacks.forEach((attack) => attack.logAttack());
  }
  getHealth() {
    let hp = "";
    let copyHp = this.hp;

    for (let i = 0; i < 10; i++) {
      hp += copyHp > 0 ? "🟩" : "🟥";
      copyHp -= this.maxHp / 10;
    }
    return hp;
  }
}

class Attack {
  constructor(name, power, stability) {
    this.name = name;
    this.power = power;
    this.stability = stability;
  }
  performAttack() {
    const randomPower =
      Math.floor(Math.random() * this.power) * (1 - this.stability);
    return this.power - randomPower;
  }
  logAttack() {
    console.log(
      `Name : ${this.name} Power⚡ : ${this.power} Stability : ${this.stability}`
    );
  }
}

const pikachu = new Pokemon("Pikachu", "⚡️", 100, [
  new Attack("Thunderbolt", 30, 0.2),
  new Attack("Electro Ball", 20, 0.4),
  new Attack("Quick Attack", 10, 0.8),
]);

const bulbasaur = new Pokemon("Bulbasaur", "🍃", 110, [
  new Attack("Vine Whip", 25, 0.3),
  new Attack("Seed Bomb", 20, 0.5),
  new Attack("Tackle", 10, 0.8),
]);

const charmander = new Pokemon("Charmander", "🔥", 90, [
  new Attack("Flamethrower", 35, 0.2),
  new Attack("Ember", 25, 0.3),
  new Attack("Scratch", 15, 0.75),
]);

const wait5seconds = async () => {
  await new Promise((resolve) => {
    let i = 0;

    const interval = setInterval(() => {
      i++;
      if (i === 5) {
        clearInterval(interval);
        resolve("");
      }
      console.log(`....${i}`);
    }, 1000);
  });
};

class Game {
  static POKEMONS = [pikachu, bulbasaur, charmander];

  constructor() {
    this.playerPokemon = null;
    this.enemyPokemon = null;
  }

  start() {
    this.playerPokemon = this.choosePokemon();
    this.enemyPokemon = Game.POKEMONS.filter((p) => p !== this.playerPokemon)[
      Math.floor(Math.random() * (Game.POKEMONS.length - 1))
    ];

    this.battle();
  }

  logBattle() {
    if (this.playerPokemon && this.enemyPokemon) {
      console.log(`
      ---
    Battle:

      ${this.playerPokemon.getHealth()}
      ${this.playerPokemon.name} ${this.playerPokemon.emoji}

      ⚡️ VS ⚡️

      ${this.enemyPokemon.getHealth()}
      ${this.enemyPokemon.name} ${this.enemyPokemon.emoji}`);
    } else {
      console.log("Error: Player or enemy Pokemon is undefined.");
    }
  }

  async battle() {
    this.logBattle();

    if (this.playerPokemon.hp <= 0 || this.enemyPokemon.hp <= 0) {
      return this.end();
    }

    this.playerPokemon.logAttacks();
    let userChoice = Number(prompt("Choose your attack: "));
    if (userChoice > 3 || userChoice < 1 || Number.isNaN(userChoice)) {
      console.log("Please choose a valid number between 1 and 3");
      return this.battle();
    }
    const playerAttack = this.playerPokemon.attacks[userChoice - 1];
    const playerAttackPower = playerAttack.performAttack();
    const enemyAttack = this.enemyPokemon.randomAttack();
    const enemyAttackPower = enemyAttack.performAttack();

    console.log(
      `You used ${playerAttack.name} ⚡️ for ${playerAttackPower} dammage and your ennemy used ${enemyAttack.name} ⚡️ for ${enemyAttackPower} dammage`
    );

    this.playerPokemon.hp -= enemyAttackPower;
    this.enemyPokemon.hp -= playerAttackPower;

    await wait5seconds();

    this.battle();
  }

  end() {
    if (this.playerPokemon.hp <= 0) {
      console.log(
        `${this.playerPokemon.name} is out of life - You lost the battle 😭`
      );
    } else if (this.enemyPokemon.hp <= 0) {
      console.log(
        `${this.enemyPokemon.name} is out of life - You won the battle 🎉`
      );
    } else {
      console.log("Error: Player or enemy Pokemon is undefined.");
    }
  }

  choosePokemon() {
    let userChoice;

    while (true) {
      userChoice = Number(
        prompt(
          "Choose your pokemon: \n1. Pikachu ⚡️ \n2. Bulbasaur 🍃 \n3. Charmander 🔥 \nYour choice : "
        )
      );

      if (userChoice >= 1 && userChoice <= 3 && !Number.isNaN(userChoice)) {
        break; // Sortir de la boucle si le choix est valide
      } else {
        console.log("Please choose a valid number between 1 and 3");
      }
    }

    return Game.POKEMONS[userChoice - 1];
  }
}

const game = new Game();
game.start();
