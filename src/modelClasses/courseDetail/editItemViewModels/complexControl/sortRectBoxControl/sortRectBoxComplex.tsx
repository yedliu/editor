import RectMazeBase from '../RectMazeBase';
import sortRectBoxComplexTemplate, {
  PropPanelTemplate as sortRectBoxComplexPropPanelTemplate,
} from '@/components/cwDesignUI/elements/controlTemplates/sortRectBoxTemplate';
import sortRectBoxUnitComplex from './sortRectBoxUnitComplex';
import CWResource from '@/modelClasses/courseDetail/cwResource';

export default class sortRectBoxComplex extends RectMazeBase {
  public get Template(): any {
    return sortRectBoxComplexTemplate;
  }

  public get PropPanelTemplate(): any {
    return sortRectBoxComplexPropPanelTemplate;
  }

  constructor() {
    super();
    this.UnitVMType = sortRectBoxUnitComplex;
    this.RowNum = 1;
    this.ColNum = 5;
  }

  SetResourcesFromLib(reslib: CWResource[]) {
    super.SetResourcesFromLib(reslib);
  }
}
