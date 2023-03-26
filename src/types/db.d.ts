export type payment_cycle = {
    key: string;
    payments: payment[];
    deposits: deposits[];
}
export type deposits = {
    amount: number;
    name: string;
    date: string;
}
export type payment = {
    amount: number
    name: string
    date: string
}


export type cycles = payment_cycle[];