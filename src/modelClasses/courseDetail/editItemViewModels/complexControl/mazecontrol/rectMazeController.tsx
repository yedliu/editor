import React from 'react';
import CWElement from '../../../cwElement';
import CWResource from '../../../cwResource';
import { from } from 'linq-to-typescript';
import { batch } from '@/server/CacheEntityServer';
import RectMazeUnitBase from '.././RectMazeUnitBase';
import RectMazeBase from '.././RectMazeBase';
import RectMazeControllerTemplate, {
  PropPanelTemplate as RectMazeControllerPropPanelTemplate,
} from '@/components/cwDesignUI/elements/controlTemplates/rectMazeControlerTemplate';
import KeyboardUnitComplex from '../keyboardcontrol/KeyboardUnitComplex';
import RectMazeControllerUnit from './rectMazeControllerUnit';

export default class RectMazeController extends RectMazeBase {
  public get Template(): any {
    return RectMazeControllerTemplate;
  }

  public get PropPanelTemplate(): any {
    return RectMazeControllerPropPanelTemplate;
  }

  constructor() {
    super();
    this.UnitVMType = RectMazeControllerUnit;
    this.RowNum = 3;
    this.ColNum = 3;
  }
}
