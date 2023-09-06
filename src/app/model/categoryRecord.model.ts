import { CategoryElement } from "./categoryElement.model";

export class CategoryRecord {
  category: string;
  categoryImg: string;
  categoryAudio: string;
  elements: Array<CategoryElement>;

  constructor(
    category: string,
    categoryImg: string,
    categoryAudio: string,
    elements: Array<CategoryElement>
  ) {
    this.category = category;
    this.categoryImg = categoryImg;
    this.categoryAudio = categoryAudio;
    this.elements = elements;
  }
}
