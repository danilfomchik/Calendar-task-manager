export type THoliday = {name: string; description: string};

export interface IParsedContent {
  holidays: {name: string; description: string}[];
  fact: string;
}
