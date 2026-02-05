import { CounterStore } from './counterStore'

export class RootStore {
  counter: CounterStore

  constructor() {
    this.counter = new CounterStore()
  }
}

export const rootStore = new RootStore()


