export default class DraggingData {
  private static map: Map<string, any> = new Map<string, any>();

  static setData(k: string, v: any) {
    DraggingData.map.set(k, v);
  }
  static getData(k: string) {
    if (DraggingData.map.has(k)) return DraggingData.map.get(k);
    return null;
  }

  static delData(k: string) {
    if (DraggingData.map.has(k)) return DraggingData.map.delete(k);
  }
}
