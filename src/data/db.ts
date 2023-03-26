import { Client } from "discord.js";
import { Level } from "level"
import path from 'path'
import { log } from "../log/logging";
import { deposits, payment, payment_cycle } from "../types/db";

const dbPath = path.join(__dirname, "db")

function getCurrentString() {
    var now = new Date()
    var mm = now.getMonth() + 1; // getMonth() is zero-based
    return [now.getFullYear(),
    (mm > 9 ? '' : '0') + mm,
    ].join('-');
}
function ObjectToString(object: any): string {
    return JSON.stringify(object)
}

function parseArray(str: string): Array<any> {
    try {
        return JSON.parse(str) as Array<any>

    } catch (error) {
        log(`Error while parsing str: ${str} \n ${error}`, 'error')
        return []
    }
}


class DB {
    level: Level<string, string>;
    constructor() {
        this.level = new Level(dbPath);
        log('Connected to DB', 'info')
        process.on('beforeExit', async () => {
            await this.level.close()
            log('Closed DB', 'info')

        })
        process.on('exit', () => {
            this.level.close();
        });
        process.on('SIGINT', () => {
            this.level.close(() => {
                log('Closed DB', 'info')
                process.exit();
            });
        });
    }
    async getAllPayment_Cycles(): Promise<Array<string>> {
        var cycles: Array<string>;
        try {
            var string_cycles = await this.level.get("payment_cycles")
            cycles = JSON.parse(string_cycles);
        } catch (error) {
            cycles = [];
        }


        return cycles;
    }
    async addPayment_Cycle(current_cycle: string) {
        var cycles = await this.getAllPayment_Cycles();
        cycles.push(current_cycle);
        await this.level.put("payment_cycles", ObjectToString(cycles));
    }
    async getCurrent(): Promise<payment_cycle> {
        var current_spent: string;
        var payment_cycle: payment_cycle;
        try {
            current_spent = await this.level.get(getCurrentString());
            payment_cycle = JSON.parse(current_spent) as payment_cycle;
        } catch (error) {
            console.log(error)
            current_spent = "";
            payment_cycle = {
                key: getCurrentString(),
                payments: [],
                deposits: [],
            }
            await this.level.put(getCurrentString(), ObjectToString(payment_cycle));
            await this.addPayment_Cycle(getCurrentString())
        }

        return payment_cycle;
    }
    async getPaymentCircle(cycle: string | undefined): Promise<payment_cycle> {
        try {
            if (!cycle) {
                cycle = getCurrentString();
            }
            var current_spent = await this.level.get(cycle);
            var payment_cycle = JSON.parse(current_spent) as payment_cycle;
            return payment_cycle;
        } catch (error) {
            log("Unable to find cycle " + cycle, 'error');
            throw error;
        }
    }
    async resetPaymentCircle(cycle?: string): Promise<payment_cycle> {
        if (!cycle) {
            cycle = getCurrentString();
        }
        var payment_cycle = {
            key: cycle,
            payments: [],
            deposits: [],
        }
        await this.getPaymentCircle(cycle);
        await this.level.put(cycle ? cycle : getCurrentString(), ObjectToString(payment_cycle));
        return payment_cycle;
    }
    async getCurrentAmountSpent(): Promise<number> {
        var payment_cycle = await this.getCurrent()
        var amount_spent = 0;
        for (let index = 0; index < payment_cycle.payments.length; index++) {
            var current_cycle = payment_cycle.payments[index];
            amount_spent += current_cycle.amount
        }
        return amount_spent
    }
    async getCurrentAmountDeposit(): Promise<number> {
        var payment_cycle = await this.getCurrent()
        var amount_deposit = 0;
        for (let index = 0; index < payment_cycle.deposits.length; index++) {
            var current_cycle = payment_cycle.deposits[index];
            amount_deposit += current_cycle.amount
        }
        return amount_deposit
    }
    async add_payment(payment: payment): Promise<boolean> {
        var payment_cycle = await this.getCurrent()
        payment_cycle.payments.push(payment);
        await this.level.put(getCurrentString(), ObjectToString(payment_cycle))
        return true;
    }
    async add_deposit(deposit: deposits): Promise<boolean> {
        var payment_cycle = await this.getCurrent()
        payment_cycle.deposits.push(deposit);
        await this.level.put(getCurrentString(), ObjectToString(payment_cycle))

        return true;
    }

}

const db = new DB()

export default db


export function formatDollarAmount(amount: number) {
    // Convert the amount to a string and round it to two decimal places
    const formattedAmount = Number(amount.toFixed(2)).toString();

    // Split the string into an array of dollars and cents
    var [dollars, cents] = formattedAmount.split('.');
    if (!cents) {
        cents = "00";
    }

    // Add commas every three digits in the dollars portion
    const formattedDollars = dollars.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Return the formatted dollar amount
    return `$${formattedDollars}.${cents}`;
}
export async function setStatus(c: Client) {
    var amount_spent = await db.getCurrentAmountSpent()
    var deposits = await db.getCurrentAmountDeposit()

    c.user?.setActivity(`Total Spent ${formatDollarAmount(amount_spent)} Total Deposited ${formatDollarAmount(deposits)}`)
}
export function DateToString(date: Date) {
    const month = date.getMonth() + 1; // Add 1 because getMonth() returns 0-based month
    const day = date.getDate();
    const year = date.getFullYear();

    // Pad the month and day with leading zeros if needed
    const paddedMonth = month.toString().padStart(2, '0');
    const paddedDay = day.toString().padStart(2, '0');

    // Concatenate the formatted date string and return it
    return `${paddedMonth}-${paddedDay}-${year}`;
}