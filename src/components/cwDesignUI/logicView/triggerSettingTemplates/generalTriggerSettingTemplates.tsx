import {
  ClickInvokeTrigger,
  DisplayInvokeTrigger,
  DropInvokeTrigger,
  TagedInvokeTrigger,
  LineInvokeTrigger,
  SlideInvokeTrigger,
  LongClickInvokeTrigger,
} from '@/modelClasses/courseDetail/triggers/generalTrigger';
import React from 'react';
import styles from '@/styles/property.less';
import { Button, Checkbox, Input, InputNumber, Select } from 'antd';
import ColorPicker from '@/components/cwDesignUI/control/sketchColor';
import { InputInvokeTrigger } from '@/modelClasses/courseDetail/triggers/extendedTrigger';
import { TextAutomaticTag } from '@/components/controls/textAutomaticTag';

export const ClickInvokeTriggerSTemplate = (item: ClickInvokeTrigger) => {
  if (item == null) return <div></div>;
  return (
    <div>
      <div style={{ display: 'flex' }}>
        <label style={{ whiteSpace: 'nowrap' }}>顺序标签</label>
        <div style={{ float: 'right', color: 'black', marginLeft: 18 }}>
          <div style={{ width: '150px' }}>
            <TextAutomaticTag
              //regular='^[0-9,]*$' //支持正则验证
              onChange={value => {
                item.ValuesString = value;
              }}
              separator=","
              value={item.ValuesString || ''}
            ></TextAutomaticTag>
          </div>
        </div>
      </div>

      {/* <div style={{ display: 'flex', marginTop: 3 }}>
        <Button
          onClick={() => item.copyId()}
          size="small"
          type="primary"
          style={{ height: 20, fontSize: 12 }}
        >
          复制ID
        </Button>
        <div style={{ float: 'right', color: 'black', marginLeft: 15 }}>
          <div style={{ width: '150px', height: 20, borderRadius: 5 }}>
            <Input
              value={item.Id}
              style={{
                height: 20,
                border: 'none',
                outline: 'none',
                borderRadius: 3,
              }}
            />
          </div>
        </div>
      </div> */}
    </div>
  );
};

export const LongClickInvokeTriggersTemplate = (
  item: LongClickInvokeTrigger,
) => {
  if (item == null) return <div></div>;
  return (
    <div>
      <div style={{ display: 'flex' }}>
        <label style={{ whiteSpace: 'nowrap' }}>触发间隔</label>
        <div style={{ float: 'right', color: 'black', marginLeft: '3px' }}>
          <div style={{ width: '150px' }}>
            <InputNumber
              size="small"
              min={0.1}
              max={Number.POSITIVE_INFINITY}
              step={1}
              value={Number(item.Interval) || 1}
              onChange={v => (item.Interval = Number(v))}
              style={{
                width: 121,
                float: 'left',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const DisplayInvokeTriggerTemplate = (item: DisplayInvokeTrigger) => {
  if (item == null) return <div></div>;
  return (
    <div
      style={{
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitBoxPack: 'start',
      }}
    >
      <div
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'horizontal',
          WebkitBoxPack: 'justify',
        }}
      >
        <label
          style={{
            whiteSpace: 'nowrap',
            display: '-webkit-box',
            WebkitBoxAlign: 'center',
          }}
        >
          默认标签
        </label>
        <Input
          size="small"
          type="text"
          value={item.DefaultValue || ''}
          onChange={event => (item.DefaultValue = event.target.value)}
          className={styles.proptxt}
          style={{
            marginLeft: 5,
            width: 120,
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitBoxPack: 'end',
          }}
        />
      </div>
      {item.AttachedItem?.Scene.IsOldInit ? (
        <div
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            WebkitBoxPack: 'justify',
            marginTop: 5,
          }}
        >
          <label
            style={{
              whiteSpace: 'nowrap',
              display: '-webkit-box',
              WebkitBoxAlign: 'center',
            }}
          >
            兼容1.0模式
          </label>
          <Checkbox
            checked={item.IsAutoRadio}
            onChange={event => (item.IsAutoRadio = event.target.checked)}
            style={{
              height: '20px',
              fontSize: '10px',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitBoxPack: 'end',
            }}
          >
            1.0音频后置
          </Checkbox>
        </div>
      ) : null}
    </div>
  );
};

export const DropInvokeTriggerTemplate = (item: DropInvokeTrigger) => {
  if (item == null) return <div></div>;
  return (
    <div
      style={{
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitBoxPack: 'start',
      }}
    >
      <div
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'horizontal',
          WebkitBoxPack: 'justify',
        }}
      >
        <Checkbox
          checked={item.ErrorNoReset}
          onChange={event => (item.ErrorNoReset = event.target.checked)}
          style={{
            height: '20px',
            fontSize: '10px',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitBoxPack: 'end',
          }}
        >
          错误不还原
        </Checkbox>
      </div>
      <div
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'horizontal',
          WebkitBoxPack: 'justify',
          marginTop: 5,
        }}
      >
        <Checkbox
          checked={item.IsSucessLocked}
          onChange={event => (item.IsSucessLocked = event.target.checked)}
          style={{
            height: '20px',
            fontSize: '10px',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitBoxPack: 'end',
          }}
        >
          成功是否锁定
        </Checkbox>
      </div>
      <div
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'horizontal',
          WebkitBoxPack: 'justify',
          marginTop: 5,
        }}
      >
        <Checkbox
          checked={item.IsNullChanged}
          onChange={event => (item.IsNullChanged = event.target.checked)}
          style={{
            height: '20px',
            fontSize: '10px',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitBoxPack: 'end',
          }}
        >
          空值触发
        </Checkbox>
      </div>
    </div>
  );
};

export const TagedInvokeTriggerTemplate = (item: TagedInvokeTrigger) => {
  const { Option } = Select;
  if (item == null) return <div></div>;
  return (
    <div
      style={{
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitBoxPack: 'start',
      }}
    >
      <div
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'horizontal',
          //WebkitBoxPack: 'justify',
        }}
      >
        <label
          style={{
            whiteSpace: 'nowrap',
            display: '-webkit-box',
            WebkitBoxAlign: 'center',
            width: '49px',
          }}
        >
          标签
        </label>
        <Input
          size="small"
          type="text"
          value={item.Tag || ''}
          onChange={event => (item.Tag = event.target.value)}
          className={styles.proptxt}
          style={{
            width: 121,
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitBoxPack: 'end',
          }}
        />
      </div>

      <div
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'horizontal',
          marginTop: '2px',
          //WebkitBoxPack: 'justify',
        }}
      >
        <label
          style={{
            whiteSpace: 'nowrap',
            display: '-webkit-box',
            WebkitBoxAlign: 'center',
            width: '49px',
          }}
        >
          标签计数
        </label>
        <InputNumber
          size="small"
          min={1}
          max={Number.POSITIVE_INFINITY}
          step={1}
          value={Number(item.TagCount) || 0}
          onChange={v => (item.TagCount = Number(v))}
          style={{
            width: 121,
            float: 'left',
            // display: '-webkit-box',
            // WebkitBoxOrient: 'vertical',
            // WebkitBoxPack: 'end',
          }}
        />
        {/* <Input
          size="small"
          type="text"
          value={item.Tag || ''}
          onChange={event => (item.Tag = event.target.value)}
          className={styles.proptxt}
          style={{
            width: 121,
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitBoxPack: 'end',
          }}
        /> */}
      </div>

      <div
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'horizontal',
          WebkitBoxPack: 'justify',
          marginTop: 5,
        }}
      >
        <label
          style={{
            whiteSpace: 'nowrap',
            display: '-webkit-box',
            WebkitBoxAlign: 'center',
          }}
        >
          拖动方式
        </label>
        <Select
          size={'small'}
          style={{
            marginLeft: '2px',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitBoxPack: 'end',
            width: 120,
          }}
          value={item.DragMode || '0'}
          onChange={value => {
            item.DragMode = value?.toString() || '0';
          }}
        >
          <Select.Option value={'0'}>指定拖动</Select.Option>
          <Select.Option value={'1'}>自由拖动</Select.Option>
        </Select>
      </div>

      {item.DragMode == '1' ? (
        <div></div>
      ) : (
        <div>
          <div
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'horizontal',
              WebkitBoxPack: 'justify',
              marginTop: 5,
            }}
          >
            <label
              style={{
                whiteSpace: 'nowrap',
                display: '-webkit-box',
                WebkitBoxAlign: 'center',
              }}
            >
              显示方式
            </label>
            <Select
              size={'small'}
              style={{
                marginLeft: '2px',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitBoxPack: 'end',
                width: 120,
              }}
              value={item.ActMode || '0'}
              onChange={value => {
                item.ActMode = value?.toString() || '0';
              }}
            >
              <Select.Option value={'0'}>普通</Select.Option>
              <Select.Option value={'1'}>复制</Select.Option>
              <Select.Option value={'2'}>替换</Select.Option>
            </Select>
          </div>
          {item.ActMode == '2' ? (
            <div></div>
          ) : (
            <div
              style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'horizontal',
                WebkitBoxPack: 'justify',
                marginTop: 5,
              }}
            >
              <label
                style={{
                  whiteSpace: 'nowrap',
                  display: '-webkit-box',
                  WebkitBoxAlign: 'center',
                }}
              >
                复制方式
              </label>
              <Select
                size={'small'}
                style={{
                  marginLeft: '2px',
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitBoxPack: 'end',
                  width: 120,
                }}
                value={item.DisplayMode || '0'}
                onChange={value => {
                  item.DisplayMode = value?.toString() || '0';
                }}
              >
                <Select.Option value={'0'}>显示</Select.Option>
                <Select.Option value={'1'}>隐藏</Select.Option>
              </Select>
            </div>
          )}
        </div>
      )}

      <div
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'horizontal',
          WebkitBoxPack: 'justify',
          marginTop: 5,
        }}
      >
        <Checkbox
          checked={item.InitTrigger}
          onChange={event => (item.InitTrigger = event.target.checked)}
          style={{
            marginLeft: 50,
            height: '20px',
            fontSize: '10px',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitBoxPack: 'end',
          }}
        >
          初始化触发
        </Checkbox>
      </div>
      {item.AttachedItem?.Scene.IsOldInit ? (
        <div
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            WebkitBoxPack: 'justify',
            marginTop: 5,
          }}
        >
          <Checkbox
            checked={item.OldMode}
            onChange={event => (item.OldMode = event.target.checked)}
            style={{
              marginLeft: 50,
              height: '20px',
              fontSize: '10px',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitBoxPack: 'end',
            }}
          >
            兼容1.0模式
          </Checkbox>
        </div>
      ) : null}
    </div>
  );
};

export const LineInvokeTriggerTemplate = (item: LineInvokeTrigger) => {
  if (item == null) return <div></div>;
  return (
    <div
      style={{
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitBoxPack: 'start',
      }}
    >
      <div
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'horizontal',
          WebkitBoxPack: 'justify',
        }}
      >
        <label
          style={{
            whiteSpace: 'nowrap',
            display: '-webkit-box',
            WebkitBoxAlign: 'center',
            width: '62px',
          }}
        >
          标签
        </label>
        <Input
          size="small"
          type="text"
          value={item.Tag || ''}
          onChange={event => (item.Tag = event.target.value)}
          className={styles.proptxt}
          style={{
            marginLeft: 5,
            width: 61,
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitBoxPack: 'end',
          }}
        />
      </div>

      <div
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'horizontal',
          //WebkitBoxPack: 'justify',
        }}
      >
        <label
          style={{
            whiteSpace: 'nowrap',
            display: '-webkit-box',
            WebkitBoxAlign: 'center',
            width: '62px',
          }}
        >
          是否单线
        </label>
        <Checkbox
          checked={item.IsSingleLine}
          onChange={event => (item.IsSingleLine = event.target.checked)}
          style={{
            marginLeft: 5,
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitBoxPack: 'end',
          }}
        ></Checkbox>
      </div>
      {item.AttachedItem?.Scene.IsOldInit ? (
        <div
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            //WebkitBoxPack: 'justify',
          }}
        >
          <label
            style={{
              whiteSpace: 'nowrap',
              display: '-webkit-box',
              WebkitBoxAlign: 'center',
              width: '62px',
            }}
          >
            双线兼容1.0
          </label>
          <Checkbox
            checked={item.IsTwoWay}
            onChange={event => (item.IsTwoWay = event.target.checked)}
            style={{
              marginLeft: 5,
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitBoxPack: 'end',
            }}
          ></Checkbox>
        </div>
      ) : null}
      <div
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'horizontal',
          WebkitBoxPack: 'justify',
        }}
      >
        <label
          style={{
            whiteSpace: 'nowrap',
            display: '-webkit-box',
            WebkitBoxAlign: 'center',
            width: '62px',
          }}
        >
          粗细
        </label>
        <InputNumber
          type="text"
          size="small"
          max={100}
          min={0}
          step={1}
          value={item.LineThickness || 0}
          onChange={value => (item.LineThickness = Number(value))}
          style={{
            marginLeft: 5,
            width: 61,
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitBoxPack: 'end',
          }}
        />
      </div>
      <div
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'horizontal',
          WebkitBoxPack: 'justify',
          marginTop: 5,
        }}
      >
        <label
          style={{
            whiteSpace: 'nowrap',
            display: '-webkit-box',
            WebkitBoxAlign: 'center',
            width: '52px',
          }}
        >
          线色
        </label>
        <ColorPicker
          selectedcolor={item.Color}
          selectedcolorchanged={value => (item.Color = value)}
        />
      </div>
      <div
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'horizontal',
          WebkitBoxPack: 'justify',
          marginTop: 5,
        }}
      >
        <label
          style={{
            whiteSpace: 'nowrap',
            display: '-webkit-box',
            WebkitBoxAlign: 'center',
            width: '52px',
          }}
        >
          点色
        </label>
        <ColorPicker
          selectedcolor={item.PointColor}
          selectedcolorchanged={value => (item.PointColor = value)}
        />
      </div>
      <div
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'horizontal',
          WebkitBoxPack: 'justify',
          marginTop: 5,
        }}
      >
        <label
          style={{
            whiteSpace: 'nowrap',
            display: '-webkit-box',
            WebkitBoxAlign: 'center',
            width: '52px',
          }}
        >
          移动线色
        </label>
        <ColorPicker
          selectedcolor={item.MoveColor}
          selectedcolorchanged={value => (item.MoveColor = value)}
        />
      </div>
      <div
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'horizontal',
          WebkitBoxPack: 'justify',
          marginTop: 5,
        }}
      >
        <label
          style={{
            whiteSpace: 'nowrap',
            display: '-webkit-box',
            WebkitBoxAlign: 'center',
            width: '52px',
          }}
        >
          移动点色
        </label>
        <ColorPicker
          selectedcolor={item.MovePointColor}
          selectedcolorchanged={value => (item.MovePointColor = value)}
        />
      </div>
    </div>
  );
};

export const SlideInvokeTriggerTemplate = (item: SlideInvokeTrigger) => {
  if (item == null) return <div></div>;
  return (
    <div
      style={{
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitBoxPack: 'start',
      }}
    >
      <div
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'horizontal',
          WebkitBoxPack: 'justify',
        }}
      >
        <label
          style={{
            whiteSpace: 'nowrap',
            display: '-webkit-box',
            WebkitBoxAlign: 'center',
          }}
        >
          滑动方向
        </label>
        <Select
          size={'small'}
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitBoxPack: 'end',
            width: 120,
          }}
          value={item.SlipDirection}
          onChange={value => {
            item.SlipDirection = Number(value) || 0;
          }}
        >
          <Select.Option value={0}>从下到上</Select.Option>
          <Select.Option value={1}>从上到下</Select.Option>
          <Select.Option value={2}>从左到右</Select.Option>
          <Select.Option value={3}>从右到左</Select.Option>
        </Select>
      </div>
      <div
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'horizontal',
          WebkitBoxPack: 'justify',
          marginTop: 5,
        }}
      >
        <label
          style={{
            whiteSpace: 'nowrap',
            display: '-webkit-box',
            WebkitBoxAlign: 'center',
          }}
        >
          范围角度
        </label>
        <InputNumber
          type="text"
          size="small"
          max={360}
          min={0}
          step={1}
          value={item.Angle || 0}
          onChange={value => (item.Angle = Number(value))}
          style={{
            width: 120,
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitBoxPack: 'end',
          }}
        />
      </div>
      <div
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'horizontal',
          WebkitBoxPack: 'justify',
          marginTop: 5,
        }}
      >
        <label
          style={{
            whiteSpace: 'nowrap',
            display: '-webkit-box',
            WebkitBoxAlign: 'center',
          }}
        >
          初始范围
        </label>
        <InputNumber
          type="text"
          size="small"
          max={360}
          min={0}
          step={1}
          value={item.TheInitialScope || 0}
          onChange={value => (item.TheInitialScope = Number(value))}
          style={{
            width: 120,
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitBoxPack: 'end',
          }}
        />
      </div>
    </div>
  );
};

export const InputInvokeTriggerTemplate = (item: InputInvokeTrigger) => {
  if (item == null) return <div></div>;

  return (
    <div
      style={{
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitBoxPack: 'start',
      }}
    >
      <div
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'horizontal',
          WebkitBoxPack: 'justify',
          marginTop: 5,
        }}
      >
        <label
          style={{
            whiteSpace: 'nowrap',
            display: '-webkit-box',
            WebkitBoxAlign: 'center',
          }}
        >
          错误设置
        </label>
        <Checkbox
          checked={item.IsErrorClear}
          onChange={event => (item.IsErrorClear = event.target.checked)}
          style={{
            width: 120,
            height: '20px',
            fontSize: '10px',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitBoxPack: 'end',
          }}
        >
          是否清除
        </Checkbox>
      </div>

      {item.IsErrorClear ? (
        <div
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            WebkitBoxPack: 'justify',
          }}
        >
          <label
            style={{
              whiteSpace: 'nowrap',
              display: '-webkit-box',
              WebkitBoxAlign: 'center',
            }}
          >
            消失时长
          </label>
          <InputNumber
            type="text"
            size="small"
            max={100}
            min={0}
            step={1}
            value={item.ErrorTimer || 0}
            onChange={value => (item.ErrorTimer = Number(value))}
            style={{
              marginLeft: 5,
              width: 120,
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitBoxPack: 'end',
            }}
          />
        </div>
      ) : null}

      <div
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'horizontal',
          WebkitBoxPack: 'justify',
          marginTop: 5,
        }}
      >
        <label
          style={{
            whiteSpace: 'nowrap',
            display: '-webkit-box',
            WebkitBoxAlign: 'center',
          }}
        >
          正确设置
        </label>
        <Checkbox
          checked={item.IsSuccessClear}
          onChange={event => (item.IsSuccessClear = event.target.checked)}
          style={{
            width: 120,
            height: '20px',
            fontSize: '10px',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitBoxPack: 'end',
          }}
        >
          是否清除
        </Checkbox>
      </div>

      {item.IsSuccessClear ? (
        <div
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            WebkitBoxPack: 'justify',
          }}
        >
          <label
            style={{
              whiteSpace: 'nowrap',
              display: '-webkit-box',
              WebkitBoxAlign: 'center',
            }}
          >
            消失时长
          </label>
          <InputNumber
            type="text"
            size="small"
            max={100}
            min={0}
            step={1}
            value={item.SuccessTimer || 0}
            onChange={value => (item.SuccessTimer = Number(value))}
            style={{
              marginLeft: 5,
              width: 120,
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitBoxPack: 'end',
            }}
          />
        </div>
      ) : null}
    </div>
  );
};
