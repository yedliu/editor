import React from 'react';
import CWElement from '../../../cwElement';
import CWResource from '../../../cwResource';
import { from } from 'linq-to-typescript';
import { batch } from '@/server/CacheEntityServer';
import WritingBase from './WritingBase';

import WritingComplexTemplate, {
  PropPanelTemplate as WritingComplexPropPanelTemplate,
} from '@/components/cwDesignUI/elements/controlTemplates/WritingComplexTemplate';

export default class WritingComplex extends WritingBase {
  public get Template(): any {
    return WritingComplexTemplate;
  }

  public get PropPanelTemplate(): any {
    return WritingComplexPropPanelTemplate;
  }

  constructor() {
    super();
    // this.UnitVMType = KeyboardUnitComplex;
  }
}
