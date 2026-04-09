export class ParseDataGridQueryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ParseDataGridQueryError";
  }
}
