export class ResourceRQ {
  emailOwner: string;
  type: string;
  name: string;
  category: Array<string>;

  constructor(
    emailOwner: string,
    type: string,
    name: string,
    category: Array<string>
  ) {
    this.emailOwner = emailOwner;
    this.type = type;
    this.name = name;
    this.category = category;
  }
}
