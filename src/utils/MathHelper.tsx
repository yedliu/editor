export default class MathHelper {
  public static round(v: number, count: number): number {
    var temp = Math.pow(10, count);
    return Math.round(v * temp) / temp;
  }
}
