"use strict";

const fightInfo = require("@stacon/fight-log-generator");
const representBattle = require("./src/components/Representation").default;

representBattle(fightInfo(), {
  fighterName1: "Mike Tyson",
  fighterName2: "Muhammad Ali",
  timeInterval: 1000,
  withConsoleLogRefresh: true,
});
