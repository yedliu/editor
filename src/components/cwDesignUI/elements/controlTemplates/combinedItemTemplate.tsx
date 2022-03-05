import React from 'react';
import CombinedEditItem from '@/modelClasses/courseDetail/editItemViewModels/combinedEditItem';
import EditItemView from '../elementItemUI';
import ResizableRect from '../resizable';

const Template = props => {
  const { courseware, dataContext, isMainView } = props;

  var combinedEditItem = dataContext as CombinedEditItem;

  var reskey = props.dataContext.Res?.resourceKey;
  return (
    <div
      className={props.className}
      style={{ position: 'absolute', width: '100%', height: '100%' }}
    >
      {combinedEditItem.Children.map((element, i) => {
        return (
          <div
            key={element.Id}
            style={{
              position: 'absolute',
              left: `${element.X}px`,
              top: `${element.Y}px`,
              display: isMainView && element.IsDesignHide ? 'none' : 'block',
            }}
          >
            <EditItemView
              dataContext={element}
              courseware={courseware}
              isMainView={isMainView}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Template;
