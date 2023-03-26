import add_deposit from './commands/addDeposit'
import add_payment from './commands/addPayment'
import commands from './commands/commands'
import getAllPaymentCycles from './commands/getAllPaymentCycles'
import get_payment_cycle from './commands/get_payment_cycle'
import pingPong from './commands/pingPong'
import resetPayment from './commands/reset_cycle'
import Command from './model/Command'

const allCommands: Map<string, Command> = new Map()

allCommands.set('commands', commands)
allCommands.set('ping', pingPong)
allCommands.set('addp', add_payment)
allCommands.set('addd', add_deposit)
allCommands.set("list", get_payment_cycle)
allCommands.set("reset", resetPayment)
allCommands.set("all", getAllPaymentCycles)

export default allCommands
