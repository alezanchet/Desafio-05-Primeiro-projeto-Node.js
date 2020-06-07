import Transaction from '../models/Transaction';

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const reducer = (accumulator: number, currentValue: number): number =>
      accumulator + currentValue;

    const incomeTransactions = this.transactions.filter(
      transaction => transaction.type === 'income',
    );

    let income = 0;

    if (incomeTransactions.length > 0) {
      income = incomeTransactions
        .map(transaction => transaction.value)
        .reduce(reducer);
    }

    const outcomeTransactions = this.transactions.filter(
      transaction => transaction.type === 'outcome',
    );

    let outcome = 0;

    if (outcomeTransactions.length > 0) {
      outcome = outcomeTransactions
        .map(transaction => transaction.value)
        .reduce(reducer);
    }

    const total = income - outcome;

    const balance = {
      income,
      outcome,
      total,
    };

    return balance;
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const balance = this.getBalance();

    if (value > balance.total && type === 'outcome') {
      throw Error('Balance is lower then value');
    }

    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
