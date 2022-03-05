import RectMazeBase from '../RectMazeBase';
import KeyboardComplexTemplate, {
  PropPanelTemplate as KeyboardComplexPropPanelTemplate,
} from '@/components/cwDesignUI/elements/controlTemplates/KeyboardComplexTemplate';
import KeyboardUnitComplex from './KeyboardUnitComplex';
import CWResource from '@/modelClasses/courseDetail/cwResource';

export default class KeyboardComplex extends RectMazeBase {
  public get Template(): any {
    return KeyboardComplexTemplate;
  }

  public get PropPanelTemplate(): any {
    return KeyboardComplexPropPanelTemplate;
  }

  constructor() {
    super();
    this.UnitVMType = KeyboardUnitComplex;
  }

  SetResourcesFromLib(reslib: CWResource[]) {
    super.SetResourcesFromLib(reslib);
  }
}
