export class draftDataModel {
  constructor() {}
  blocks: Array<block>;
  entityMap: entityMap;
}

export class block {
  constructor() {}
  key: string = '';
  text: string = '';
  type: string = '';
  depth: number;
  inlineStyleRanges: Array<inlineStyleRangesModel>;
  entityRanges: Array<any>;
  data: draftData;
}

export class inlineStyleRangesModel {
  constructor() {}
  offset: number;
  length: number;
  style: string;
}

export class draftData {
  constructor() {}
  'text-align': string;
}
export class entityMap {
  constructor() {}
}
