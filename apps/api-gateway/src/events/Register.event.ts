export class RegisterEvent {
  constructor(public readonly name: string) {}

  toString() {
    return JSON.stringify({
      name: this.name,
    });
  }
}
