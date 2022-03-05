export default class MetaHelper {
  public static getMetadata<
    T extends { target: Function; propertyName: string }
  >(metadatas: Map<Function, Map<String, T>>, target: Function): T[] {
    const metadataFromTargetMap = metadatas.get(target);
    let metadataFromTarget: T[] = [];
    if (metadataFromTargetMap) {
      metadataFromTarget = Array.from(metadataFromTargetMap.values()).filter(
        meta => meta.propertyName !== undefined,
      );
    }
    let metadataFromAncestors: T[] = [];
    for (const ancestor of this.getAncestors(target)) {
      const ancestorMetadataMap = metadatas.get(ancestor);
      if (ancestorMetadataMap) {
        const metadataFromAncestor = Array.from(
          ancestorMetadataMap.values(),
        ).filter(
          meta =>
            meta.propertyName !== undefined &&
            !metadataFromTarget.find(
              x => x.propertyName == meta.propertyName,
            ) &&
            !metadataFromAncestors.find(
              x => x.propertyName == meta.propertyName,
            ),
        );
        metadataFromAncestors.push(...metadataFromAncestor);
      }
    }
    return metadataFromTarget.concat(metadataFromAncestors || []);
  }

  private static _ancestorsMap = new Map<Function, Function[]>();
  public static getAncestors(target: Function): Function[] {
    if (!target) return [];
    if (!MetaHelper._ancestorsMap.has(target)) {
      let ancestors: Function[] = [];
      for (
        let baseClass = Object.getPrototypeOf(target.prototype.constructor);
        typeof baseClass.prototype !== 'undefined';
        baseClass = Object.getPrototypeOf(baseClass.prototype.constructor)
      ) {
        ancestors.push(baseClass);
      }
      MetaHelper._ancestorsMap.set(target, ancestors);
    }
    return MetaHelper._ancestorsMap.get(target);
  }
}
