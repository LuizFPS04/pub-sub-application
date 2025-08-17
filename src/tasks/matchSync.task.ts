import cron from "node-cron";
import * as matchService from '../services/match.service';

// Rodar a cada hora
cron.schedule("0 * * * *", async () => {
  console.log("🔄 Sincronizando jogos do Brasileirão...");
  await matchService.syncMatches(); // ID do Brasileirão no Football Data
});
