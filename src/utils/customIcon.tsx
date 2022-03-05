import Icon from '@ant-design/icons';
import React from 'react';
export const RefreshIcon = props => {
  const { svgwidth = 15, svgheight = 15 } = props;
  return (
    <svg
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width={`${svgwidth}px`}
      height={`${svgheight}px`}
    >
      <path
        d="M907.462482 834.333101A508.834229 508.834229 0 0 1 7.312938 585.035044h146.258761a364.403703 364.403703 0 0 0 649.827675 145.308078L658.164424 585.035044h365.646902v365.646902zM511.905663 146.258761a363.672409 363.672409 0 0 0-291.639969 147.136313L365.646902 438.776283H0V73.12938l116.275715 116.275715A508.907359 508.907359 0 0 1 1016.498388 438.776283h-146.258761A365.646902 365.646902 0 0 0 511.905663 146.258761z"
        fill="#0078D7"
      />
    </svg>
  );
};

export const FlipXIcon = props => {
  const {
    svgwidth = 18,
    svgheight = 18,
    svgColor = ['#7B7B7B', '#F2F2F2'],
  } = props;
  return (
    <svg
      viewBox="0 0 1489 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width={`${svgwidth}px`}
      height={`${svgheight}px`}
    >
      <path
        d="M698.181818 0h93.090909v279.272727h-93.090909V0z m0 372.363636h93.090909v279.272728h-93.090909V372.363636z m0 372.363637h93.090909v279.272727h-93.090909V744.727273zM512 977.454545H465.454545a418.909091 418.909091 0 0 1 0-837.818181h46.545455v837.818181zM1024 139.636364a418.909091 418.909091 0 1 1 0 837.818181h-46.545455v-837.818181h46.545455z"
        fill={svgColor[0]}
      />
      <path
        d="M1070.545455 881.105455a325.818182 325.818182 0 0 0 0-645.12v645.12z"
        fill={svgColor[1]}
      />
    </svg>
  );
};

export const FlipYIcon = props => {
  const {
    svgwidth = 18,
    svgheight = 18,
    svgColor = ['#7B7B7B', '#F2F2F2'],
  } = props;
  return (
    <svg
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width={`${svgwidth}px`}
      height={`${svgheight}px`}
    >
      <path
        d="M864 480v64H672v-64h192z m-256 0v64H416v-64h192z m-256 0v64H160v-64h192zM192 352V320a288 288 0 0 1 576 0v32h-576zM768 704a288 288 0 1 1-576 0v-32h576v32z"
        fill={svgColor[0]}
      />
      <path
        d="M258.24 736a224 224 0 0 0 443.52 0h-443.52z"
        fill={svgColor[1]}
        p-id="3961"
      />
    </svg>
  );
};

export const LeftIcon = props => {
  const { svgwidth = 18, svgheight = 18, svgColor = ['#797A79'] } = props;
  return (
    <svg
      style={{ marginTop: 2 }}
      viewBox="0 0 1479 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width={`${svgwidth}px`}
      height={`${svgheight}px`}
    >
      <path
        d="M56.888889 113.777778V0h1365.333333v113.777778H56.888889z m0 455.111111V455.111111h682.666667v113.777778h-682.666667z m0 455.111111V910.222222h910.222222v113.777778h-910.222222z"
        fill={svgColor[0]}
      ></path>
    </svg>
  );
};

export const CenterIcon = props => {
  const { svgwidth = 18, svgheight = 18, svgColor = ['#797A79'] } = props;
  return (
    <svg
      style={{ marginTop: 2 }}
      viewBox="0 0 1479 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width={`${svgwidth}px`}
      height={`${svgheight}px`}
    >
      <path
        d="M56.888889 113.777778V0h1365.333333v113.777778H56.888889z m341.333333 455.111111V455.111111h682.666667v113.777778h-682.666667z m-113.777778 455.111111V910.222222h910.222223v113.777778h-910.222223z"
        fill={svgColor[0]}
      ></path>
    </svg>
  );
};

export const RightIcon = props => {
  const { svgwidth = 18, svgheight = 18, svgColor = ['#797A79'] } = props;
  return (
    <svg
      style={{ marginTop: 2 }}
      viewBox="0 0 1479 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width={`${svgwidth}px`}
      height={`${svgheight}px`}
    >
      <path
        d="M56.888889 113.777778V0h1365.333333v113.777778H56.888889z m682.666667 455.111111V455.111111h682.666666v113.777778h-682.666666z m-227.555556 455.111111V910.222222h910.222222v113.777778h-910.222222z"
        fill={svgColor[0]}
      ></path>
    </svg>
  );
};

export const BoldIcon = props => {
  const { svgwidth = 30, svgheight = 18, svgColor = ['#797A79'] } = props;
  return (
    <svg
      viewBox="0 0 1740 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width={`${svgwidth}px`}
      height={`${svgheight}px`}
    >
      <path
        d="M665.6 802.3552V256h283.4432c44.544 0 76.9024 5.7344 96.9728 17.2032 23.552 12.544 41.3184 33.5872 53.3504 63.0784 8.5504 20.1728 12.8 41.216 12.8 63.0784a159.744 159.744 0 0 1-20.6848 79.4624c-13.7728 24.576-31.232 41.472-52.224 50.7392 48.64 24.064 72.9088 66.9184 72.9088 128.6144 0 35.5328-7.7824 65.28-23.296 89.2928-13.5168 20.736-30.8224 35.072-51.8656 43.008-21.0432 7.936-52.3776 11.8784-94.0032 11.8784H665.6z m88.064-312.7808h171.6224c18.3808 0 31.5904-1.024 39.5776-2.9696 7.9872-2.048 15.872-6.3488 23.552-12.9536 18.432-15.9232 27.5968-37.888 27.5968-65.7408 0-26.5728-8.6016-46.1312-25.8048-58.7776-12.4416-9.2672-33.1776-13.9264-62.2592-13.9264H753.664v154.368z m0 233.5744h171.6224c18.3808 0 31.744-1.024 40.0384-2.9696 8.2944-2.048 15.9744-6.3488 23.0912-12.9536 18.432-15.9232 27.5968-37.888 27.5968-65.7408 0-26.5728-8.6016-46.1312-25.8048-58.7776-12.4416-9.2672-33.1776-13.9264-62.2592-13.9264H753.664v154.368z"
        fill={svgColor[0]}
      ></path>
    </svg>
  );
};

export const ItalicIcon = props => {
  const { svgwidth = 30, svgheight = 18, svgColor = ['#797A79'] } = props;
  return (
    <svg
      viewBox="0 0 1740 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width={`${svgwidth}px`}
      height={`${svgheight}px`}
    >
      <path
        d="M762.0608 768l38.6048-460.8H716.8V256h256v51.2h-77.6192l-38.6048 460.8H972.8v51.2h-307.2v-51.2h96.4608z"
        fill={svgColor[0]}
      ></path>
    </svg>
  );
};

export const UnderLineIcon = props => {
  const { svgwidth = 30, svgheight = 18, svgColor = ['#797A79'] } = props;
  return (
    <svg
      viewBox="0 0 1740 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width={`${svgwidth}px`}
      height={`${svgheight}px`}
    >
      <path
        d="M759.4496 256v266.24c0 21.2992 1.792 37.8368 5.3248 49.5616 3.584 11.776 9.5232 21.8624 17.9712 30.3104 18.6368 18.176 44.5952 27.2896 77.8752 27.2896 21.2992 0 39.8336-3.6352 55.552-11.008 15.7696-7.3216 26.7776-17.152 32.9728-29.5936 6.1952-12.4416 9.3184-34.6112 9.3184-66.56V256h94.5152v261.5808c0 34.6112-3.6352 63.1296-11.008 85.504-7.3216 22.4256-18.4832 40.4992-33.5872 54.272-35.072 30.6176-84.736 45.9264-149.0944 45.9264-68.7616 0-118.9376-15.104-150.4256-45.2608a123.8016 123.8016 0 0 1-33.9456-52.224c-6.1952-19.3536-9.3184-46.4896-9.3184-81.5616V256h93.8496zM665.6 768h409.6v51.2h-409.6v-51.2z"
        fill={svgColor[0]}
      ></path>
    </svg>
  );
};

export const TopIcon = props => {
  const { svgwidth = 30, svgheight = 18, svgColor = ['#797A79'] } = props;
  return (
    <svg
      style={{ marginTop: 3 }}
      viewBox="0 0 1210 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width={`${svgwidth}px`}
      height={`${svgheight}px`}
    >
      <path
        d="M651.636364 345.832727V1024H558.545455V347.694545L387.537455 524.474182l-66.932364-64.791273 284.113454-293.515636 290.257455 293.236363-66.094545 65.442909L651.636364 345.832727zM0 93.090909V0h1210.181818v93.090909H0z"
        fill={svgColor[0]}
      ></path>
    </svg>
  );
};

export const MiddleIcon = props => {
  const { svgwidth = 30, svgheight = 18, svgColor = ['#797A79'] } = props;
  return (
    <svg
      style={{ marginTop: 2 }}
      viewBox="0 0 1210 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width={`${svgwidth}px`}
      height={`${svgheight}px`}
    >
      <path
        d="M68.266667 546.119685V477.880315h887.111822v68.23937zM477.498174 614.563774l68.239371-0.409436 2.524857 409.436226-68.239371 0.409436zM477.498174 409.436226l68.239371 0.409436 2.524857-409.436226-68.239371-0.409436z"
        fill={svgColor[0]}
      ></path>
      <path
        d="M525.470452 360.849793L365.790324 195.778755l-49.132347 47.494602 208.334799 215.158737 212.770359-214.954019-48.449954-47.972277zM365.790324 828.221245l-49.132347-47.494602 208.334799-215.158737 212.770359 214.954019-48.449954 47.972277-163.77449-165.343995z"
        fill={svgColor[0]}
      ></path>
    </svg>
  );
};

export const BottomIcon = props => {
  const { svgwidth = 30, svgheight = 18, svgColor = ['#797A79'] } = props;
  return (
    <svg
      style={{ marginTop: 2 }}
      viewBox="0 0 1210 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width={`${svgwidth}px`}
      height={`${svgheight}px`}
    >
      <path
        d="M651.636364 678.167273V0H558.545455v676.305455L387.537455 499.525818l-66.932364 64.791273 284.113454 293.515636 290.257455-293.236363-66.094545-65.442909L651.636364 678.167273zM0 930.909091v93.090909h1210.181818v-93.090909H0z"
        fill={svgColor[0]}
      ></path>
    </svg>
  );
};

export const CloseIcon = props => {
  const { svgwidth = 18, svgheight = 18, svgColor = ['#73777A'] } = props;
  return (
    <svg
      style={{ marginTop: 2 }}
      viewBox="0 0 1210 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width={`${svgwidth}px`}
      height={`${svgheight}px`}
    >
      <path
        d="M583.168 523.776L958.464 148.48c18.944-18.944 18.944-50.176 0-69.12l-2.048-2.048c-18.944-18.944-50.176-18.944-69.12 0L512 453.12 136.704 77.312c-18.944-18.944-50.176-18.944-69.12 0l-2.048 2.048c-19.456 18.944-19.456 50.176 0 69.12l375.296 375.296L65.536 899.072c-18.944 18.944-18.944 50.176 0 69.12l2.048 2.048c18.944 18.944 50.176 18.944 69.12 0L512 594.944 887.296 970.24c18.944 18.944 50.176 18.944 69.12 0l2.048-2.048c18.944-18.944 18.944-50.176 0-69.12L583.168 523.776z"
        fill={svgColor[0]}
      ></path>
    </svg>
  );
};

export const MoreIcon = props => {
  const { svgwidth = 30, svgheight = 25, svgColor = ['#73777A'] } = props;
  return (
    <svg
      style={{ marginTop: 2 }}
      viewBox="0 0 1210 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width={`${svgwidth}px`}
      height={`${svgheight}px`}
    >
      <path
        fill={svgColor[0]}
        d="M514.048 572.416c-35.84 0-63.488-28.672-63.488-64.512s28.672-64.512 63.488-64.512 63.488 28.672 63.488 64.512c1.024 35.84-27.648 64.512-63.488 64.512zM674.816 572.416c-35.84 0-63.488-28.672-63.488-64.512s28.672-64.512 63.488-64.512 63.488 28.672 63.488 64.512-29.696 64.512-63.488 64.512zM870.4 551.936c-22.528 0-39.936-17.408-39.936-39.936s17.408-39.936 39.936-39.936c21.504 0 39.936 17.408 39.936 39.936s-18.432 39.936-39.936 39.936zM353.28 572.416c-35.84 0-63.488-28.672-63.488-64.512s28.672-64.512 63.488-64.512 63.488 28.672 63.488 64.512-27.648 64.512-63.488 64.512z"
        p-id="3985"
      ></path>
      <path
        d="M855.04 575.488c-17.408 0-32.768 12.288-37.888 28.672-39.936 130.048-159.744 225.28-303.104 225.28-176.128 0-317.44-143.36-317.44-320.512s143.36-320.512 317.44-320.512c141.312 0 263.168 95.232 303.104 226.304 5.12 16.384 19.456 28.672 37.888 28.672 21.504 0 39.936-17.408 39.936-39.936 0-4.096-1.024-8.192-2.048-11.264-49.152-163.84-200.704-281.6-378.88-281.6-219.136 0-396.288 179.2-396.288 398.336s178.176 398.336 396.288 398.336c175.104 0 324.608-114.688 376.832-274.432 2.048-5.12 4.096-10.24 4.096-16.384-1.024-23.552-18.432-40.96-39.936-40.96z"
        fill={svgColor[0]}
      ></path>
    </svg>
  );
};

export const LoginOutIcon = props => {
  const { svgwidth = 20, svgheight = 20, svgColor = ['#1D91FC'] } = props;
  return (
    <svg
      style={{ marginTop: 2 }}
      viewBox="0 0 1210 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width={`${svgwidth}px`}
      height={`${svgheight}px`}
    >
      <path
        d="M511.999744 1023.999488C229.222285 1023.999488 0 794.777203 0 511.999744S229.222285 0 511.999744 0a511.231744 511.231744 0 0 1 409.599795 204.799898h-138.75193a409.599795 409.599795 0 1 0 0.0512 614.399692h138.75193A511.231744 511.231744 0 0 1 511.999744 1023.999488z m358.399821-307.199846v-153.599924H460.79977V460.79977h409.599795V307.199846l255.999872 204.799898-255.999872 204.799898z"
        fill={svgColor[0]}
      ></path>
    </svg>
  );
};

export const CourseIcon = props => {
  const { svgwidth = 18, svgheight = 18, svgColor = ['#ACACAC'] } = props;
  return (
    <svg
      style={{ marginTop: 2 }}
      viewBox="0 0 1210 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width={`${svgwidth}px`}
      height={`${svgheight}px`}
    >
      <path
        d="M73.142857 0h292.571429a73.142857 73.142857 0 0 1 73.142857 73.142857v292.571429a73.142857 73.142857 0 0 1-73.142857 73.142857H73.142857a73.142857 73.142857 0 0 1-73.142857-73.142857V73.142857a73.142857 73.142857 0 0 1 73.142857-73.142857z m0 585.142857h292.571429a73.142857 73.142857 0 0 1 73.142857 73.142857v292.571429a73.142857 73.142857 0 0 1-73.142857 73.142857H73.142857a73.142857 73.142857 0 0 1-73.142857-73.142857V658.285714a73.142857 73.142857 0 0 1 73.142857-73.142857z m585.142857-585.142857h292.571429a73.142857 73.142857 0 0 1 73.142857 73.142857v292.571429a73.142857 73.142857 0 0 1-73.142857 73.142857H658.285714a73.142857 73.142857 0 0 1-73.142857-73.142857V73.142857a73.142857 73.142857 0 0 1 73.142857-73.142857z m0 585.142857h292.571429a73.142857 73.142857 0 0 1 73.142857 73.142857v292.571429a73.142857 73.142857 0 0 1-73.142857 73.142857H658.285714a73.142857 73.142857 0 0 1-73.142857-73.142857V658.285714a73.142857 73.142857 0 0 1 73.142857-73.142857z"
        fill={svgColor[0]}
      ></path>
    </svg>
  );
};

export const ManagerIcon = props => {
  const { svgwidth = 18, svgheight = 18, svgColor = ['#ACACAC'] } = props;
  return (
    <svg
      style={{ marginTop: 2 }}
      viewBox="0 0 1113 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width={`${svgwidth}px`}
      height={`${svgheight}px`}
    >
      <path
        d="M1001.73913 3.561739h-890.434782C50.086957 3.561739 0 55.652174 0 119.318261v636.660869c0 63.666087 49.107478 125.996522 109.167304 138.462609l243.266783 50.621218S143.048348 1022.21913 278.26087 1022.21913h556.521739c135.257043 0-74.173217-77.156174-74.173218-77.156173l243.311305-50.621218C1063.936 881.975652 1113.043478 819.645217 1113.043478 755.97913V119.318261c0-63.666087-50.086957-115.756522-111.304348-115.756522z m0 746.629565h-890.434782V107.742609h890.434782v642.448695z"
        fill={svgColor[0]}
      ></path>
    </svg>
  );
};

export const ResourceIcon = props => {
  const { svgwidth = 18, svgheight = 18, svgColor = ['#ACACAC'] } = props;
  return (
    <svg
      style={{ marginTop: 2 }}
      viewBox="0 0 1070 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width={`${svgwidth}px`}
      height={`${svgheight}px`}
    >
      <path
        d="M284.49792 408.482909c20.573091 0 38.074182 6.981818 52.596364 20.852364 14.429091 13.870545 21.690182 30.626909 21.690181 50.362182 0 18.990545-7.261091 35.607273-21.736727 49.803636a72.145455 72.145455 0 0 1-52.549818 21.410909 72.145455 72.145455 0 0 1-52.596364-21.410909c-14.429091-14.196364-21.643636-30.813091-21.643636-49.803636 0-19.735273 7.214545-36.491636 21.690182-50.362182 14.429091-13.917091 31.976727-20.852364 52.596363-20.852364zM860.311738 0c33.512727 0 63.255273 5.678545 89.134546 16.989091a211.549091 211.549091 0 0 1 65.675636 43.752727c17.92 17.92 31.650909 38.167273 41.146182 60.834909 9.541818 22.621091 14.289455 44.869818 14.289454 66.792728v559.662545c0 16.756364-4.002909 33.186909-12.008727 49.245091a163.84 163.84 0 0 1-31.976727 43.845818c-13.312 13.125818-28.578909 23.738182-45.707637 31.744a123.857455 123.857455 0 0 1-53.108363 12.055273V272.709818a124.741818 124.741818 0 0 0-11.450182-53.108363 142.289455 142.289455 0 0 0-30.859636-43.287273 148.898909 148.898909 0 0 0-45.149091-29.556364 139.869091 139.869091 0 0 0-55.389091-10.938182H142.813556c0-16.058182 3.816727-32.116364 11.450182-48.221091 7.586909-16.058182 17.873455-30.626909 30.859637-43.752727 12.939636-13.172364 28.16-23.738182 45.66109-31.790545A132.747636 132.747636 0 0 1 286.778647 0h573.533091z m-99.374545 204.8c34.257455 0 58.647273 8.936727 73.076363 26.810182 14.522182 17.92 21.736727 41.844364 21.736728 71.773091v645.026909c0 18.292364-8.005818 35.421091-23.970909 51.479273-16.011636 16.058182-36.212364 24.110545-60.555637 24.110545H78.860102c-20.573091 0-38.865455-8.052364-54.877091-24.110545A79.266909 79.266909 0 0 1 0.012102 941.847273V284.765091c0-23.365818 6.656-42.542545 20.014545-57.530182 13.312-14.941091 30.999273-22.434909 53.108364-22.434909h687.802182z m-46.824728 166.446545a26.065455 26.065455 0 0 0-8.005818-19.688727 28.485818 28.485818 0 0 0-20.573091-7.68H170.275375a28.485818 28.485818 0 0 0-20.573091 7.68 26.065455 26.065455 0 0 0-8.005819 19.688727v244.270546c6.842182 8.005818 13.125818 16.942545 18.85091 26.810182 5.725091 9.867636 12.753455 19.176727 21.131636 27.927272s19.409455 16.244364 33.140364 22.43491c13.684364 6.237091 32.721455 9.309091 57.111272 9.30909 35.84 0 64.930909-5.445818 87.412364-16.430545a225.093818 225.093818 0 0 0 59.392-41.611636c17.128727-16.756364 33.140364-34.862545 47.988364-54.178909 14.894545-19.362909 32.581818-37.608727 53.154909-54.784 20.526545-17.175273 46.08-31.744 76.520727-43.799273 30.487273-12.055273 69.725091-18.804364 117.713454-20.247273V371.246545z"
        fill={svgColor[0]}
      ></path>
    </svg>
  );
};

//#region 首页改版添加

export const NewMoreIcon = props => {
  const {
    svgwidth = '17px',
    svgheight = '14px',
    svgColor = ['#1D91FC'],
  } = props;
  return (
    <svg
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="5417"
      width={svgwidth}
      height={svgheight}
    >
      <path
        d="M615.36 160C805.76 160 960 317.568 960 512s-154.24 352-344.64 352h-206.72C218.24 864 64 706.432 64 512s154.24-352 344.64-352h206.72z m0 70.4h-206.72c-152.32 0-275.712 126.08-275.712 281.6 0 150.784 116.032 273.92 261.952 281.28l13.76 0.32h206.72c152.32 0 275.712-126.08 275.712-281.6 0-150.784-116.032-273.92-261.952-281.28L615.36 230.4zM305.28 441.6c38.08 0 68.928 31.488 68.928 70.4 0 38.912-30.848 70.4-68.928 70.4A69.696 69.696 0 0 1 236.288 512c0-38.912 30.848-70.4 68.928-70.4zM512 441.6c38.08 0 68.928 31.488 68.928 70.4 0 38.912-30.848 70.4-68.928 70.4A69.696 69.696 0 0 1 443.072 512c0-38.912 30.848-70.4 68.928-70.4z m206.72 0c38.144 0 68.992 31.488 68.992 70.4 0 38.912-30.848 70.4-68.928 70.4A69.696 69.696 0 0 1 649.856 512c0-38.912 30.848-70.4 68.928-70.4z"
        p-id="5418"
        fill={svgColor}
      ></path>
    </svg>
  );
};

//上传按钮
export const NewUploadingIcon = props => {
  const {
    svgwidth = '16px',
    svgheight = '16px',
    svgColor = ['#1D91FC'],
  } = props;
  return (
    <svg
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="5603"
      width={svgwidth}
      height={svgheight}
    >
      <path
        d="M512.384 631.04a36.48 36.48 0 0 1 36.736 36.096v148.16a36.48 36.48 0 0 1-36.736 36.096 36.48 36.48 0 0 1-36.8-36.096v-148.16a36.48 36.48 0 0 1 36.8-36.096zM510.4 192c115.008 1.472 210.368 82.816 231.168 190.144 108.8 20.16 196.224 113.92 194.752 227.136-1.664 126.976-106.112 229.504-235.392 231.168-57.856 0.704-57.728-87.36 0-88.064 39.488-0.512 76.928-14.912 104.704-43.52 25.728-26.56 41.536-62.272 41.024-99.584-0.768-78.72-65.6-142.336-145.728-143.104a45.44 45.44 0 0 1-21.952-5.568 40.576 40.576 0 0 1-22.848-37.44 141.248 141.248 0 0 0-44.352-102.784 146.944 146.944 0 0 0-101.376-40.32c-80.128 0.768-144.96 64.384-145.728 143.104-0.384 29.184-24.32 43.392-47.36 42.56a145.792 145.792 0 0 0-103.424 43.456 141.632 141.632 0 0 0-41.024 99.584c0.768 78.72 65.6 142.336 145.728 143.104 57.728 0.704 57.856 88.768 0 88.064-126.784-1.664-237.056-104.192-235.392-231.168 1.536-113.92 85.696-208.192 196.352-227.584C300.864 275.328 395.84 190.592 510.4 192z m28.224 305.088l104.128 102.272a34.816 34.816 0 0 1 0 49.792 36.352 36.352 0 0 1-50.752 0L513.216 571.776l-78.72 77.44a36.352 36.352 0 0 1-50.688 0 34.816 34.816 0 0 1 0-49.92l104.064-102.208a36.032 36.032 0 0 1 22.336-10.176h6.144c8.128 0.64 16 4.096 22.272 10.24z"
        p-id="5604"
        fill={svgColor}
      ></path>
    </svg>
  );
};

//列表模式
export const NewCoursewareListIcon = props => {
  const {
    svgwidth = '16px',
    svgheight = '16px',
    svgColor = ['#1D91FC'],
  } = props;
  return (
    <svg
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="5789"
      width={svgwidth}
      height={svgheight}
    >
      <path
        d="M211.2 746.688a76.8 76.8 0 0 1 76.8 76.8v102.4a76.8 76.8 0 0 1-76.8 76.8H108.8a76.8 76.8 0 0 1-76.8-76.8v-102.4a76.8 76.8 0 0 1 76.8-76.8h102.4z m695.488 42.624a85.312 85.312 0 0 1 0 170.688h-448a85.312 85.312 0 0 1 0-170.688h448z m-695.488-384a76.8 76.8 0 0 1 76.8 76.8v102.4a76.8 76.8 0 0 1-76.8 76.8H108.8a76.8 76.8 0 0 1-76.8-76.8v-102.4a76.8 76.8 0 0 1 76.8-76.8h102.4zM906.688 448a85.312 85.312 0 0 1 0 170.688h-448a85.312 85.312 0 0 1 0-170.688h448zM211.2 64a76.8 76.8 0 0 1 76.8 76.8v102.4A76.8 76.8 0 0 1 211.2 320H108.8A76.8 76.8 0 0 1 32 243.2V140.8A76.8 76.8 0 0 1 108.8 64h102.4z m695.488 42.688a85.312 85.312 0 0 1 0 170.624h-448a85.312 85.312 0 1 1 0-170.624h448z"
        p-id="5790"
        fill={svgColor}
      ></path>
    </svg>
  );
};

//宫格模式
export const NewCoursewareGridIcon = props => {
  const {
    svgwidth = '16px',
    svgheight = '16px',
    svgColor = ['#1D91FC'],
  } = props;
  return (
    <svg
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="6159"
      width={svgwidth}
      height={svgheight}
      fill={svgColor}
    >
      <path
        d="M864 544a128 128 0 0 1 128 128v192a128 128 0 0 1-128 128h-192a128 128 0 0 1-128-128v-256a64 64 0 0 1 64-64h256z m-448 0a64 64 0 0 1 64 64v256a128 128 0 0 1-128 128h-192a128 128 0 0 1-128-128v-192a128 128 0 0 1 128-128h256z m448-512a128 128 0 0 1 128 128v192a128 128 0 0 1-128 128h-256a64 64 0 0 1-64-64v-256a128 128 0 0 1 128-128h192z m-512 0a128 128 0 0 1 128 128v256a64 64 0 0 1-64 64h-256a128 128 0 0 1-128-128v-192a128 128 0 0 1 128-128h192z"
        p-id="6160"
      ></path>
    </svg>
  );
};

//#endregion