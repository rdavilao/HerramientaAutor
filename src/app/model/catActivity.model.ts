import { CategoryRecord } from "./categoryRecord.model";

export class CatActivity {
    instruction: string;
    records: Array<CategoryRecord>;
  
    constructor(instruction: string, records: Array<CategoryRecord>) {
      this.instruction = instruction;
      this.records = records;
    }
  }