import { Client, Message, GatewayIntentBits } from 'discord.js'
import Discord from 'discord.js'
import * as dotenv from 'dotenv'
dotenv.config()
import config from '../config.json'
import allCommands from './allCommands'
import { log } from './log/logging'

const client: Client = new Discord.Client({
    intents: [
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ],
})
client.on('messageCreate', (message: Message) => {
    try {
        if (
            message.content.startsWith(config.commandPrefix) &&
            !message.author.bot
        ) {

            const args = message.content
                .slice(config.commandPrefix.length)
                .split(/ +/)
                .filter((element) => element)
            const commandString = args.shift()
            if (commandString) {
                const command = allCommands.get(commandString)
                if (command && !command.disabled) {
                    command.action(client, message, args)
                }
            }
        }
    } catch (e: any) {
        log(e, 'error')
    }
})

client.on('ready', () => {
    log("Discord Bot Ready", 'info')
})

client.login(process.env.TOKEN)
