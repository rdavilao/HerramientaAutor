import { UnirCRecord } from "./unirCRecord.model";

export class UnirCActivity {
  instruction: string;
  records: Array<UnirCRecord>;

  constructor(instruction: string, records: Array<UnirCRecord>) {
    this.instruction = instruction;
    this.records = records;
  }
}
