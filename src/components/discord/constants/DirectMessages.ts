const divider = '-----------------------------------------------------------------------------------------------------------------------------------';

export default {
    inviteSpamWarningMessage: (user: string) => `🛡️ Hello ${user},\n\nWe have detected that you have sent an **invite link** in the BlueBubbles Discord server.\nPlease refrain from sending invite links in the future. If you continue to send invite links, you will be _kicked_ from the server.\n${divider}`,
    kickMessage: (user: string) => `🛡️ Hello ${user},\n\nWe have detected that you have sent multiple invite links in quick succession in the BlueBubbles Discord server.\nYou have been **kicked** from the server. If you believe this was done in error, please contact the BlueBubbles team at bluebubblesapp@gmail.com.\n${divider}`,
    banMessage: (user: string) => `🛡️ Hello ${user},\n\nYou have been **banned** from the BlueBubbles Discord server for repeated invite spam.\nIf you believe this was done in error, please contact the BlueBubbles team at bluebubblesapp@gmail.com.\n${divider}`
}