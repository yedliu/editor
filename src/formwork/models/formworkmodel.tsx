import { Courseware } from '@/modelClasses/courseware';

export class FormworkModel extends Courseware {
  colorType: number;
  playType: number;
  questionType: number;
  styleType: number;
  constructor() {
    super();
  }
}
