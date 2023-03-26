import allCommands from '../allCommands'
import Command from '../model/Command'
import config from '../../config.json'
import db, { DateToString, formatDollarAmount, setStatus } from '../data/db';

const add_payment: Command = {
    name: 'Add Payments',
    description: 'Adds payment to payment cycle',
    hidden: false,
    disabled: false,
    action: async (c, message, args) => {
        if (!args) {
            return message.channel.send('Please enter a Payment');
        }
        if (isNaN(Number.parseFloat(args[0]))) {
            return message.channel.send('Please enter a value number');
        }
        var amount = Number.parseFloat(args[0]);
        if (!args[1]) {
            return message.channel.send('Please enter a value description');
        }
        args.shift();
        var name = args.join(' ')
        await db.add_payment({
            'amount': amount,
            date: DateToString(new Date()),
            'name': name
        })
        var amount_spent = await db.getCurrentAmountSpent()
        message.channel.send(`Total spent this month: ${formatDollarAmount(amount_spent)}`)
        setStatus(c);
    }
}

export default add_payment
