import styled from 'styled-components';

// export const StyledRect =styled.div.attrs(props => ({}

export default styled.div`
  position: absolute;
  border: 1px solid #eb5648;

  .square {
    position: absolute;
    width: ${props => 7.0 / props.stageScale}px;
    height: ${props => 7.0 / props.stageScale}px;
    background: white;
    border: ${props => 1.0 / props.stageScale}px solid #eb5648;
    border-radius: 1px;
  }

  .resizable-handler {
    position: absolute;
    width: ${props => 14.0 / props.stageScale}px;
    height: ${props => 14.0 / props.stageScale}px;
    cursor: pointer;
    z-index: 1;

    &.tl,
    &.t,
    &.tr {
      top: ${props => -7.0 / props.stageScale}px;
    }

    &.tl,
    &.l,
    &.bl {
      left: ${props => -7.0 / props.stageScale}px;
    }

    &.bl,
    &.b,
    &.br {
      bottom: ${props => -7.0 / props.stageScale}px;
    }

    &.br,
    &.r,
    &.tr {
      right: ${props => -7.0 / props.stageScale}px;
    }

    &.l,
    &.r {
      margin-top: ${props => -7.0 / props.stageScale}px;
    }

    &.t,
    &.b {
      margin-left: ${props => -7.0 / props.stageScale}px;
    }
  }

  .rotate {
    position: absolute;
    left: 50%;
    top: ${props => -26.0 / props.stageScale}px;
    width: ${props => 18.0 / props.stageScale}px;
    height: ${props => 18.0 / props.stageScale}px;
    margin-left: ${props => -9 / props.stageScale}px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .t,
  .tl,
  .tr {
    top: ${props => -3.0 / props.stageScale}px;
  }

  .b,
  .bl,
  .br {
    bottom: ${props => -3.0 / props.stageScale}px;
  }

  .r,
  .tr,
  .br {
    right: ${props => -3.0 / props.stageScale}px;
  }

  .tl,
  .l,
  .bl {
    left: ${props => -3.0 / props.stageScale}px;
  }

  .l,
  .r {
    top: 50%;
    margin-top: ${props => -3.0 / props.stageScale}px;
  }

  .t,
  .b {
    left: 50%;
    margin-left: ${props => -3.0 / props.stageScale}px;
  }
`;
