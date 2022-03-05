import CourseCommander from '@/modelClasses/courseDetail/courseCommander';
import { configure } from 'react-hotkeys';
import LogicDesign from '@/modelClasses/courseDetail/logicDesign';
import RUHelper from '@/redoundo/redoUndoHelper';
import { Point2D } from '@/utils/Math2D';
export const winhotkeyMap = {
  UNDO: 'ctrl+z',
  REDO: 'ctrl+y',

  COMBINE: 'ctrl+f',
  SPLITE: 'ctrl+r',
  DEL: 'del',
  DELL: 'shift+del',

  COPY: 'ctrl+c',
  CUT: 'ctrl+x',
  PASTE: 'ctrl+v',
  PASTEL: 'ctrl+shift+v',

  LEFTAlign: 'ctrl+alt+l',
  HCenterAlign: 'ctrl+alt+c',
  RIGHTAlign: 'ctrl+alt+r',

  TOPAlign: 'ctrl+alt+t',
  VCenterAlign: 'ctrl+alt+m',
  BOTTOMAlign: 'ctrl+alt+b',

  TRAVERSE: 'ctrl+alt+h',
  ENDWISE: 'ctrl+alt+u',

  SELECTALL: 'ctrl+a',

  MOVEUP: 'up',
  MOVEDOWN: 'down',
  MOVELEFT: 'left',
  MOVERIGHT: 'right',

  SAVE: 'ctrl+s',

  HorizontalEquidistanceAlign: 'ctrl+alt+e',
  VerticalEquidistanceAlign: 'ctrl+alt+g',
  CenterAlign: 'ctrl+alt+o',
};

export const machotkeyMap = {
  UNDO: 'command+z',
  REDO: 'command+y',

  COMBINE: 'command+f',
  SPLITE: 'command+r',
  DEL: ['del', 'command+backspace'],
  DELL: ['shift+del', 'shift+command+backspace'],

  COPY: 'command+c',
  CUT: 'command+x',
  PASTE: 'command+v',
  PASTEL: 'command+shift+v',

  LEFTAlign: 'command+alt+l',
  HCenterAlign: 'command+alt+c',
  RIGHTAlign: 'command+alt+r',

  TOPAlign: 'command+alt+t',
  VCenterAlign: 'command+alt+m',
  BOTTOMAlign: 'command+alt+b',

  TRAVERSE: 'command+alt+h',
  ENDWISE: 'command+alt+u',

  SELECTALL: 'command+a',

  MOVEUP: 'up',
  MOVEDOWN: 'down',
  MOVELEFT: 'left',
  MOVERIGHT: 'right',

  SAVE: 'command+s',

  HorizontalEquidistanceAlign: 'command+alt+e',
  VerticalEquidistanceAlign: 'command+alt+g',
  CenterAlign: 'command+alt+o',
};

export const getGlobalHotkeyHandlers = (commander: CourseCommander) => {
  return {
    UNDO: () => commander.Undo(),
    REDO: () => commander.Redo(),
    SAVE: () => commander.Courseware.SaveCourse(),
  };
};

export const getItemDesignHotkeyHandlers = (commander: CourseCommander) => {
  return {
    COMBINE: () => commander.CombineItems(),
    SPLITE: () => commander.SplitCombinedItem(),
    SELECTALL: () =>
      commander.SelectedPage?.TotalEditItemList?.forEach(
        x => (x.IsSelected = true),
      ),
    DEL: () => commander.DeleteSelectedItem(),
    DELL: () => commander.DeleteSelectedItemsAndLogic(),
    COPY: () => {
      commander.ExportToElementsBox();
    },
    CUT: () => {
      commander.CutItems();
    },
    PASTE: () => {
      commander.PasteItems();
    },
    PASTEL: () => {
      commander.ImportElementsBox(
        commander.SelectedPage,
        // commander.ItemsCopyboard,
      );
    },

    LEFTAlign: () => {
      commander.ElementAlign('LeftAlign');
    },
    HCenterAlign: () => {
      commander.ElementAlign('HorizontalAlign');
    },
    RIGHTAlign: () => {
      commander.ElementAlign('RightAlign');
    },
    TOPAlign: () => {
      commander.ElementAlign('TopAlign');
    },
    VCenterAlign: () => {
      commander.ElementAlign('VerticalAlign');
    },
    BOTTOMAlign: () => {
      commander.ElementAlign('BottomAlign');
    },
    TRAVERSE: () => {
      commander.ElementAlign('Traverse');
    },
    ENDWISE: () => {
      commander.ElementAlign('Endwise');
    },
    HorizontalEquidistanceAlign: () => {
      commander.ElementAlign('HorizontalEquidistanceAlign');
    },
    VerticalEquidistanceAlign: () => {
      commander.ElementAlign('VerticalEquidistanceAlign');
    },
    CenterAlign: () => {
      commander.ElementAlign('CenterAlign');
    },
  };
};

export const getStageHotkeyHandlers = (commander: CourseCommander) => {
  return {
    MOVEUP: () => {
      RUHelper.Core.CreateTransaction();
      commander.SelectedItems?.forEach(
        x =>
          (x.AbsolutePosition = new Point2D(
            x.AbsolutePosition.x,
            x.AbsolutePosition.y - 1,
          )),
      );
      RUHelper.Core.CommitTransaction();
    },
    MOVEDOWN: () => {
      RUHelper.Core.CreateTransaction();
      commander.SelectedItems?.forEach(
        x =>
          (x.AbsolutePosition = new Point2D(
            x.AbsolutePosition.x,
            x.AbsolutePosition.y + 1,
          )),
      );
      RUHelper.Core.CommitTransaction();
    },
    MOVELEFT: () => {
      RUHelper.Core.CreateTransaction();
      commander.SelectedItems?.forEach(
        x =>
          (x.AbsolutePosition = new Point2D(
            x.AbsolutePosition.x - 1,
            x.AbsolutePosition.y,
          )),
      );
      RUHelper.Core.CommitTransaction();
    },
    MOVERIGHT: () => {
      RUHelper.Core.CreateTransaction();
      commander.SelectedItems?.forEach(
        x =>
          (x.AbsolutePosition = new Point2D(
            x.AbsolutePosition.x + 1,
            x.AbsolutePosition.y,
          )),
      );
      RUHelper.Core.CommitTransaction();
    },
  };
};

export const getLogicDesignHotkeyHandlers = (logicDesign: LogicDesign) => {
  if (logicDesign) {
    return {
      DEL: () => logicDesign.DeleteLogicDItem(),
      COPY: () => {
        logicDesign.CopySelectedLDItems();
      },
      CUT: () => {
        RUHelper.Core.CreateTransaction();
        logicDesign.CopySelectedLDItems();
        logicDesign.DeleteLogicDItem();
        RUHelper.Core.CommitTransaction();
      },
      PASTE: () => {
        logicDesign.PasteLDItems();
      },
      COMBINE: () => {
        logicDesign.CombineInvs();
      },
    };
  }
  return {};
};

export const initHotkeyConfig = () => {
  configure({
    ignoreRepeatedEventsWhenKeyHeldDown: false,
    allowCombinationSubmatches: true,
    ignoreTags: ['input', 'textarea'],
    enableHardSequences: true,
    ignoreKeymapAndHandlerChangesByDefault: true,
  });
};
