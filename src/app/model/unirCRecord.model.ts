export class UnirCRecord {
  key: string;
  keyImg: string;
  keyAudio: string;
  definition: string;
  definitionImg: string;
  definitionAudio: string;

  constructor(
    key: string,
    keyImg: string,
    keyAudio: string,
    definition: string,
    definitionImg: string,
    definitionAudio: string
  ) {
    this.key = key;
    this.keyImg = keyImg;
    this.keyAudio = keyAudio;
    this.definition = definition;
    this.definitionImg = definitionImg;
    this.definitionAudio = definitionAudio;
  }
}
