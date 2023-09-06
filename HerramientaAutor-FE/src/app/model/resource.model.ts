export class Resource {
  emailOwner: string;
  type: string;
  name: string;
  description: string;
  category: Array<string>;

  constructor(
    emailOwner: string,
    type: string,
    name: string,
    description: string,
    category: Array<string>
  ) {
    this.emailOwner = emailOwner;
    this.type = type;
    this.name = name;
    this.description = description;
    this.category = category;
  }
}
