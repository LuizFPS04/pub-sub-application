import { EventEmitter } from "events";

export const appEvents = new EventEmitter();

// Exemplo de listener
appEvents.on("newMatch", (match) => {
    console.log("📢 Novo jogo detectado:", match.homeTeam.name, "x", match.awayTeam.name);
});