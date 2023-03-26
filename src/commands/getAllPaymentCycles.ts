import allCommands from '../allCommands'
import Command from '../model/Command'
import config from '../../config.json'
import db, { DateToString, formatDollarAmount, setStatus } from '../data/db';

const getAllPaymentCycles: Command = {
    name: 'Get all payment cycles',
    description: 'displays all the payment cycles stored',
    hidden: false,
    disabled: false,
    action: async (c, message) => {
        var payment_cycles = await db.getAllPayment_Cycles()
        var m = `**PAYMENT CYCLES**\n`;
        m += payment_cycles.join("\n")
        message.channel.send(m)
        setStatus(c);
    }
}

export default getAllPaymentCycles
