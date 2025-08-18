import { EventEmitter } from "events";
import { Server } from "socket.io";
import * as notificationService from '../services/notification.service';
import * as teamService from '../services/team.service';
import * as userService from '../services/user.service';

export const appEvents = new EventEmitter();
let io: Server;

export function initSocket(server: any) {
    io = new Server(server, { cors: { origin: "*" } });

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId as string;
        if (userId) {
            socket.join(`user-${userId}`);
            console.log(`Usuário ${userId} conectado na sala user-${userId}`);
        }

        socket.on("disconnect", () => {
            console.log(`Usuário desconectado: ${socket.id}`);
        });
    });
}

async function getUsersFollowingTeams(teamIds: string[]) {
    return await userService.findUserFollowedTeams(teamIds);
}

appEvents.on("newMatch", async (match) => {
    const message = `📢 Novo jogo: ${match.homeTeam.shortName} × ${match.awayTeam.shortName}`;
    console.log(message);

    const homeTeam: any = await teamService.getTeamById(match.homeTeam.id);
    const awaitTeam: any = await teamService.getTeamById(match.awayTeam.id);

    const users = await getUsersFollowingTeams([homeTeam?._id, awaitTeam?._id]);
    
    if (users) {
        for (const user of users) {
            io.to(`user-${user._id}`).emit("newMatch", {
                home: match.homeTeam.shortName,
                away: match.awayTeam.shortName,
            });

            const notificationBody: any = {
                userId: user._id,
                type: "newMatch",
                message,
                teams: [match.homeTeam.shortName, match.awayTeam.shortName],
                matchId: match._id
            }

            await notificationService.createNotification(notificationBody);
        }
    }
});

appEvents.on("matchUpdated", async ({ match, changedFields }) => {
    const message = `📢 Jogo atualizado: ${match.homeTeam.shortName} × ${match.awayTeam.shortName} | ${match.score.home} × ${match.score.away} (${match.status})`;
    console.log(message);

    const homeTeam: any = await teamService.getTeamById(match.homeTeam.id);
    const awaitTeam: any = await teamService.getTeamById(match.awayTeam.id);

    const users = await getUsersFollowingTeams([homeTeam?._id, awaitTeam?._id]);

    if (users) {
        for (const user of users) {
            io.to(`user-${user._id}`).emit("matchUpdated", {
                home: match.homeTeam.shortName,
                away: match.awayTeam.shortName,
                score: match.score,
                status: match.status,
                changedFields,
            });

            const notificationBody: any = {
                userId: user._id,
                type: "matchUpdated",
                message,
                teams: [match.homeTeam.shortName, match.awayTeam.shortName],
                matchId: match._id
            }

            await notificationService.createNotification(notificationBody);
        }
    }
});

appEvents.on("updateTable", async (table) => {
    const users = await getUsersFollowingTeams([table.teamId]);
    if (users) {
        for (const user of users) {
            io.to(`user-${user._id}`).emit("updateTable", {
                id: table.id,
                position: table.position,
                points: table.points,
                playedGames: table.playedGames,
                won: table.won,
                draw: table.draw,
                lost: table.lost,
                goalDifference: table.goalDifference,
                goalsAgainst: table.goalsAgainst,
                goalsFor: table.goalsFor,
                leagueId: table.leagueId
            });
        }
    }
});


appEvents.on("insertLeague", (league) => {
    console.log(`📢 Liga inserida: ${league.name}`);
    io.emit("insertLeague", league);
});