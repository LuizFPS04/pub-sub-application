import cron from "node-cron";
import { teamTask } from "./teamSync.task";
import { leagueTask } from "./leagueSync.task";
import { matchTask } from "./matchSync.task";

export async function runTasks() {
  await leagueTask();
  await teamTask();
  await matchTask();
}
