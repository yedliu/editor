import { defineConfig } from 'umi';

export default defineConfig({
  exportStatic: {
    htmlSuffix: false,
    dynamicRoot: true,
  },
  routes: [
    { path: '/', component: '@/pages/mainView' },
    { path: '/designer', component: '@/pages/index' },
    { path: '/tip', component: '@/pages/tippage' },
  ],

  define: {
    'process.env.apiUrl': '/',
    'process.env.openapiUrl': 'https://kids-app-gateway.zmlearn.com/',
    'process.env.prevVideoAIUrl':
      'https://hdkj.zmtalent.com/zm-ai-videoclass/index.html?env=prod',
    'process.env.prevVoiceClassUrl':
      'https://hdkj.zmtalent.com/zm-ai-voiceclass/index.html?env=prod',
    'process.env.prevUrl':
      'https://hdkj.zmtalent.com/zm_course_web2/index.html',
    'process.env.kidsHomeWorkUrl':
      'https://inner-hdkj.zmlearn.com/zmgEditorHomework/',
    'process.env.pbookUrl': 'https://hdkj.zmtalent.com/zm_picturebook_web/',
    'process.env.managerUrl': 'https://www.zmlearn.com/zm-ai-editor-manager/',
    'process.env.loginUrl': 'https://www.zmlearn.com/',
    'process.env.waveCaptionsToolUrl':
      'https://inner-hdkj.zmlearn.com/zmgEditorHomework/audioWave',
    'process.env.webServerName': 'prod',
    'process.env.environment': 'prod',
    'process.env.logLevel': 'error',
    'process.env.port': '23461',
  },
});
