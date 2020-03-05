const { getStrTimes } = require('../libs');

const getFightersInfo = (fightInfo, optionsIn) => {
  let options = {
    fighterName1: null,
    fighterName2: null,
    ...optionsIn,
  };

  return {
    'first': () => ({
      'representationalName': () => !!options.fighterName1 ? options.fighterName1 : fightInfo.fighter1ID,
      'ID': () => fightInfo.fighter1ID,
    }),
    'second': () => ({
      'representationalName': () => !!options.fighterName2 ? options.fighterName2 : fightInfo.fighter2ID,
      'ID': () => fightInfo.fighter2ID,
    })
  };
}

/**
 * Visually represents (consoles) fighter's HP in a line (eg. "Muhammad Ali   : [###############     ](72)"")
 * @param  {...{name: string, HP: number}} fightersNameAndHP objects with fighter'name and HP
 */
const representHP = (...fightersNameAndHP) => {
  fightersNameAndHP.forEach(({ name, HP }) => {
    const fighterNameWithTrailingSpace = name + getStrTimes(' ', 15 - name.length);
    const fighter1HPOutOf20 = Math.ceil((HP * 20) / 100);
    console.log(`${fighterNameWithTrailingSpace}: [${getStrTimes('#', fighter1HPOutOf20)}${getStrTimes(' ', Math.min(20, 20 - fighter1HPOutOf20))}](${HP})`);
  });
}

/**
 * Visually represents (consoles) fighters' names
 * @param {string} firstFighterName 
 * @param {string} secondFighterName 
 */
const representAnnouncement = (firstFighterName, secondFighterName) => {
  console.log('\n=================================================');
  console.log(`${firstFighterName} fights against ${secondFighterName}`);
  console.log('=================================================\n');
}

/**
 * Visually represents (consoles) a battaleLogEntry with phase === 'FIGHT'
 * @param {Object} fightLogEntry 
 */
const representAttack = ({ hitResult, attackerID, defenderID, inflictedDamage }) => {
  switch (hitResult) {
    case ('NORMAL'):
    case ('CRITICAL'): {
      console.log(`${attackerID} ${hitResult === 'CRITICAL' ? 'power strikes' : 'jabs'} ${defenderID} for ${inflictedDamage} damage\n`);
      break;
    }
    case ('DODGED'): {
      console.log(`${defenderID} dodges ${attackerID}'s hit\n`);
      break;
    }
    case ('BLOCKED'): {
      console.log(`${attackerID}'s attack was blocked effectively by ${defenderID}\n`);
      break;
    }
    default: {
      throw `Unexpected hitResult value: ${hitResult}`;
    }
  }
}

/**
 * Visually represents (consoles) a battaleLogEntry with phase === 'FIGHT_ENDED'
 * @param {Object} fightLogEntry 
 */
const representFightEnding = (fightLogEntry) => {
  const {
    attackerID,
    defenderID,
    defenderHP,
    inflictedDamage
  } = fightLogEntry;

  if (defenderHP < -9) {
    console.error(`A vicious strike from ${attackerID} for ${inflictedDamage} damage, sends ${defenderID} unconscious, over the ropes and off the ring !!`);
  } else {
    console.info(`${attackerID} knocks out ${defenderID} with a ${inflictedDamage} damage blow.`);
  }

  console.info(`\nThe winner by knockout is: ${attackerID}!`);
}

/**
 * Visually represents (consoles) a battaleLogEntry
 * @param {Object} fightLogEntry
 */
const representfightLogEntry = (fightLogEntry, {first}) => {
  const {
    phase,
    attackerID,
    defenderID,
    attackerHP,
    defenderHP,
  } = fightLogEntry;

  const firstFighterIsAttacker = attackerID === first().representationalName();
  
  const representHPWithNames = () => {
    return representHP(
      {name: firstFighterIsAttacker ? attackerID : defenderID, HP: firstFighterIsAttacker ? attackerHP : defenderHP,},
      {name: firstFighterIsAttacker ? defenderID : attackerID, HP: firstFighterIsAttacker ? defenderHP : attackerHP,},
    );
  }

  switch (phase) {
    case ('FIGHT'): {
      console.log('\n');
      representAttack(fightLogEntry);
      representHPWithNames();
      break;
    }
    case ('FIGHT_ENDED'): {
      console.log('\n\n');
      representFightEnding(fightLogEntry);
      representHPWithNames();
      console.log('');
      break;
    }
    default: {
      throw `Uknown phase entry: ${phase}`;
    }
  }
}

/**
 * Represents fight's fightLog
 * @param {Object[]} fightInfo 
 * @param {Object} options see options variables usage
 */
const getfightLogWithNewFighterNames = (fightInfo, fighterInfo) => {
  const { fightLog } = fightInfo;
  const { first, second } = fighterInfo

  return fightLog.map(fightLogEntry => ({
    ...fightLogEntry,
    attackerID: fightLogEntry.attackerID === first().ID() ? first().representationalName() : second().representationalName(),
    defenderID: fightLogEntry.defenderID === first().ID() ? first().representationalName() : second().representationalName(),
  }));
}

/**
 * Represents fight's fightLog
 * @param {Object[]} fightLog 
 * @param optionsIn set of options for fight representation
 * @param {number} optionsIn.timeInterval time interval to represent fight event
 * @param {boolean} optionsIn.withConsoleLogRefresh clear console on new event
 * @param {string} optionsIn.fighterName1 name to replace fighter1 name in logs
 * @param {string} optionsIn.fighterName2 name to replace fighter2 name in logs
 */
function representFight(fightInfo, optionsIn) {

  const options = {
    timeInterval: 0,
    withConsoleLogRefresh: false,
    fighterName1: null,
    fighterName2: null,
    ...optionsIn
  }

  const { timeInterval, withConsoleLogRefresh } = options;
  const fighterInfo = getFightersInfo(fightInfo, options);
  const { fighter1StartingHP, fighter2StartingHP} = fightInfo;
  const fightLog = getfightLogWithNewFighterNames(fightInfo, fighterInfo);

  if (withConsoleLogRefresh) console.clear();
  
  representAnnouncement(
    fighterInfo.first().representationalName(), 
    fighterInfo.second().representationalName()
  );

  representHP(
    {name: fighterInfo.first().representationalName(), HP: fighter1StartingHP},
    {name: fighterInfo.second().representationalName(), HP: fighter2StartingHP},
  )

  if (timeInterval > 0) {
    let i = 0;
    const fightEventsInterval = setInterval(() => {
      if (withConsoleLogRefresh) console.clear();
      representfightLogEntry(fightLog[i], fighterInfo);

      if (fightLog[i].phase === 'FIGHT_ENDED') {
        clearInterval(fightEventsInterval)
      }

      i++;
    }, timeInterval);

    return;
  }

  fightLog.forEach(fightLogEntry => {
    representfightLogEntry(fightLogEntry, fighterInfo);
  })
}

exports.default = representFight;