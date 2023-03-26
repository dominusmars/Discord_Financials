import allCommands from '../allCommands'
import Command from '../model/Command'
import config from '../../config.json'
import db, { DateToString, formatDollarAmount, setStatus } from '../data/db';

const add_deposit: Command = {
    name: 'Add Deposit',
    description: 'Adds deposit to payment cycle',
    hidden: false,
    disabled: false,
    action: async (c, message, args) => {
        if (!args) {
            return message.channel.send('Please enter a deposit');
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
        await db.add_deposit({
            'amount': amount,
            date: DateToString(new Date()),
            'name': name
        })
        var amount_deposit = await db.getCurrentAmountDeposit()
        message.channel.send(`Total Deposit this month: ${formatDollarAmount(amount_deposit)}`)
        setStatus(c);
    }
}

export default add_deposit
