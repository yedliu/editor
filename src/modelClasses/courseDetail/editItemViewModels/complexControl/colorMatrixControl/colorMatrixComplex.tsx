import RectMazeBase from '../RectMazeBase';
import colorMatrixComplexTemplate, {
  PropPanelTemplate as colorMatrixComplexPropPanelTemplate,
} from '@/components/cwDesignUI/elements/controlTemplates/colorMatrixTemplate';
import colorMatrixUnitComplex from './colorMatrixUnitComplex';
import CWResource from '@/modelClasses/courseDetail/cwResource';
import { InvokeTriggerSetting } from '@/modelClasses/courseDetail/triggers/invokeTriggerSetting';
import { ValueChangedTrigger } from '@/modelClasses/courseDetail/triggers/extendedTrigger';

export default class colorMatrixComplex extends RectMazeBase {
  public get Template(): any {
    return colorMatrixComplexTemplate;
  }

  public get PropPanelTemplate(): any {
    return colorMatrixComplexPropPanelTemplate;
  }

  constructor() {
    super();
    this.UnitVMType = colorMatrixUnitComplex;
    this.RowNum = 4;
    this.ColNum = 4;
  }

  SetResourcesFromLib(reslib: CWResource[]) {
    super.SetResourcesFromLib(reslib);
  }

  public GetExtendedTriggerSettings() {
    var triggers = super.GetExtendedTriggerSettings();
    triggers.push(
      new InvokeTriggerSetting('ValueChanged', '值改变', ValueChangedTrigger),
    );
    return triggers;
  }
}
