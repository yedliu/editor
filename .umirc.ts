import { defineConfig } from 'umi';

export default defineConfig({
  hash: true,
  routes: [
    {
      path: '/',
      title: '掌门课件编辑器-主页',
      component: '@/pages/mainView',
    },
    {
      path: '/designer',
      title: '掌门课件编辑器-设计器',
      component: '@/pages/index',
    },
    {
      path: '/formworkselect',
      title: '掌门课件编辑器-互动模板选择',
      component: '@/pages/formworkSelect',
    },
    {
      path: '/formworkcombined',
      title: '掌门课件编辑器-合并课件预览',
      component: '@/pages/formworkcombined',
    },
    {
      path: '/managerEditor',
      title: '掌门课件编辑器-后台管理',
      component: '@/pages/managerEditor',
    },
  ],
  links: [
    { rel: 'icon', href: './editlogo.png' }, // },
  ],
});
