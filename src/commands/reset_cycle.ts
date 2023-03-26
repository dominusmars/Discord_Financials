import allCommands from '../allCommands'
import Command from '../model/Command'
import config from '../../config.json'
import db, { setStatus } from '../data/db'

const resetPayment: Command = {
    name: 'Reset Current or Any Payment Cycles',
    description: 'resets the payment cycle',
    hidden: false,
    disabled: false,
    action: async (c, message, args) => {
        if (args && args.length > 0) {
            await db.resetPaymentCircle(args[0]);
            message.channel.send(`Reset ${args[0]} `)
            setStatus(c);

            return
        } else {
            await db.resetPaymentCircle();
            message.channel.send(`Reset Current Cycle `)
            setStatus(c);

            return
        }

    }
}
function getCurrentString() {
    var now = new Date()
    var mm = now.getMonth() + 1; // getMonth() is zero-based
    return [now.getFullYear(),
    (mm > 9 ? '' : '0') + mm,
    ].join('-');
}
export default resetPayment
