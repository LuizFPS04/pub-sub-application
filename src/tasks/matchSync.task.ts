import cron from "node-cron";
import * as matchService from "../services/match.service";

export async function matchTask() {
  cron.schedule(
    "* * * * *",
    async () => {
      try {
        console.log("🔄 Sincronizando jogos do Brasileirão... ", new Date().toISOString());
        await matchService.syncMatches();
        console.log("✅ Sincronização concluída!");
      } catch (err) {
        console.error("❌ Erro na sincronização:", err);
      }
    },
    {
      timezone: "America/Sao_Paulo",
    }
  );
}