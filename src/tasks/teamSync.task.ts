import cron from "node-cron";
import * as teamService from "../services/team.service";

export async function teamTask() {
    cron.schedule(
        "* * * * *",
        async () => {
            try {
                console.log("🔄 Sincronizando tabela...");
                await teamService.syncTeams();
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