import allCommands from '../allCommands'
import Command from '../model/Command'
import config from '../../config.json'
import db, { formatDollarAmount, setStatus } from '../data/db'
import { payment_cycle } from '../types/db'

const get_payment_cycle: Command = {
    name: 'Get Current or Any Payment Cycles',
    description: 'Displays all Payments and Deposits',
    hidden: false,
    disabled: false,
    action: async (c, message, args) => {
        var current_cycle: payment_cycle;
        if (args && args?.length > 0) {
            current_cycle = await db.getPaymentCircle(args[0]);
        } else {
            current_cycle = await db.getCurrent();
        }
        var m = `**${args && args[0] ? args[0] : getCurrentString()} Cycle **\n`

        var amount_spent = await db.getCurrentAmountSpent()
        var deposits = await db.getCurrentAmountDeposit()

        m += `**Total Spent ${formatDollarAmount(amount_spent)} Total Deposited ${formatDollarAmount(deposits)}**\n\n`

        m += `**PAYMENTS**\n`
        for (let index = 0; index < current_cycle.payments.length; index++) {
            var element = current_cycle.payments[index];
            m += `> **${index < 10 ? "0" + index : index}** | ${element.date} ${formatDollarAmount(element.amount)} ${element.name}\n`
        }
        m += `\n**DEPOSITS**\n`
        for (let index = 0; index < current_cycle.deposits.length; index++) {
            var element = current_cycle.deposits[index];
            m += `> **${index < 10 ? "0" + index : index}** | ${element.date} ${formatDollarAmount(element.amount)} ${element.name}\n`
        }


        message.channel.send(m);
        setStatus(c);

    }
}
function getCurrentString() {
    var now = new Date()
    var mm = now.getMonth() + 1; // getMonth() is zero-based
    return [now.getFullYear(),
    (mm > 9 ? '' : '0') + mm,
    ].join('-');
}
export default get_payment_cycle
