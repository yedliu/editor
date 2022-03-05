import InvokableBase from '@/modelClasses/courseDetail/InvokableBase';
import React from 'react';
import FreeCaculator from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/Invokables/Caculator/FreeCaculator';
import { Checkbox, Input, Popover, Select } from 'antd';
import { HelpIcon } from '@/svgs/designIcons';
import CustomLogicItem from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/Invokables/Branch/CustomLogicItem';

export const SymbolSelectSettingTemplate = inv => {
  return (
    <div
      style={{
        display: '-webkit-box',
        WebkitBoxOrient: 'horizontal',
        WebkitBoxAlign: 'center',
        WebkitBoxPack: 'start',
        margin: '2px',
        whiteSpace: 'nowrap',
      }}
      onWheel={e => e.stopPropagation()}
    >
      <label>{inv.SymbolName}</label>
      <Select
        size={'small'}
        style={{
          marginLeft: '3px',
          minWidth: '140px',
        }}
        value={inv.SymbolType}
        onChange={value => (inv.SymbolType = value)}
      >
        {inv?.SymbolSource?.map((symbol, i) => {
          return (
            <Select.Option key={i} value={i}>
              {symbol}
            </Select.Option>
          );
        })}
      </Select>
    </div>
  );
};

export const FreeScriptSettingTemplate = (
  inv: FreeCaculator | CustomLogicItem,
) => {
  if (inv.LogicDesign != null) {
    return (
      <div
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
        }}
      >
        {inv.FatherItem ? (
          <div
            style={{
              position: 'relative',
              width: '100%',
            }}
          >
            {'全局变量'}
            <Checkbox
              style={{ marginLeft: '6px' }}
              checked={inv.IsPageGlobal || false}
              onChange={e => {
                inv.IsPageGlobal = e.target.checked;
              }}
            />
          </div>
        ) : null}
        <div
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            WebkitBoxAlign: 'center',
            whiteSpace: 'nowrap',
            height: '20px',
          }}
        >
          {inv.InputAreaName}
          <Popover
            content={
              <div
                style={{ fontSize: '8px', whiteSpace: 'pre' }}
              >{`${inv.Tips}`}</div>
            }
          >
            <div style={{ width: '15px', height: '15px', marginLeft: '8px' }}>
              {HelpIcon()}
            </div>
          </Popover>
        </div>
        <Input.TextArea
          className="scrollableView"
          style={{
            width: '140px',
            overflowY: 'auto',
            overflowX: 'hidden',
            wordBreak: 'break-all',
            background: '#EEEEEE',
            color: '#333333',
            height: '24px',
            border: '0px solid transparent',
            resize: 'none',
          }}
          placeholder="输入表达式"
          value={inv.ScriptString}
          onChange={e => {
            inv.ScriptString = e.target.value;
            e.target.style.height = `24px`;
            var height = Math.max(24, Math.min(70, e.target.scrollHeight));
            e.target.style.height = `${height}px`;
          }}
        />
        {inv.ScriptError && inv.ScriptError != '' ? (
          <div
            style={{
              wordBreak: 'break-all',
              color: '#FF3333',
              WebkitLineClamp: 2,
              textOverflow: 'ellipsis',
            }}
          >
            {inv.ScriptError}
          </div>
        ) : null}
      </div>
    );
  }
  return null;
};
