import cron from "node-cron";
import * as leagueService from "../services/league.service";

export async function leagueTask() {
    cron.schedule(
        "0 5 1 * *",
        async () => {
            try {
                console.log("🔄 Sincronizando liga...");
                await leagueService.syncLeague();
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