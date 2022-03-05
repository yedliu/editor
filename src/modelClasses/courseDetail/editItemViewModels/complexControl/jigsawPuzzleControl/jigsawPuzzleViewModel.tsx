import CWElement from '../../../cwElement';
import CWResource from '../../../cwResource';
import { batch } from '@/server/CacheEntityServer';
import IPropUndoable from '@/redoundo/IPropUndoable';
import jigsawPuzzleUnitBaseViewModel from './jigsawPuzzleUnitBaseViewModel';
import jigsawPuzzleBaseViewModel from './jigsawPuzzleBaseViewModel';

import jigsawPuzzleViewModelTemplate, {
  PropPanelTemplate as jigsawPuzzleViewModelPropPanelTemplate,
} from '@/components/cwDesignUI/elements/controlTemplates/jigsawPuzzleTemplate';
import { InvokeTriggerSetting } from '@/modelClasses/courseDetail/triggers/invokeTriggerSetting';
import { ValueChangedTrigger } from '@/modelClasses/courseDetail/triggers/extendedTrigger';

export default class jigsawPuzzleViewModel extends jigsawPuzzleBaseViewModel {
  protected UnitVMType: new (
    ...args: any[]
  ) => any = jigsawPuzzleUnitBaseViewModel;

  public get Template(): any {
    return jigsawPuzzleViewModelTemplate;
  }

  public get PropPanelTemplate(): any {
    return jigsawPuzzleViewModelPropPanelTemplate;
  }

  constructor() {
    super();
  }

  public GetExtendedTriggerSettings() {
    var triggers = super.GetExtendedTriggerSettings();
    triggers.push(
      new InvokeTriggerSetting('ValueChanged', '值改变', ValueChangedTrigger),
    );
    return triggers;
  }
}
