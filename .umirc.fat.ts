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
    'process.env.apiUrl': 'https://p-test.zmlearn.com/',
    'process.env.openapiUrl': 'https://kids-app-gateway-test.zmlearn.com/',
    'process.env.prevVideoAIUrl':
      'https://hdkj-test.zmtalent.com/zm-ai-videoclass/index.html?env=test',
    'process.env.prevVoiceClassUrl':
      'https://hdkj-test.zmtalent.com/zm-ai-voiceclass/index.html?env=test',
    'process.env.prevUrl':
      'https://hdkj-test-gray.zmtalent.com/zm_course_web2/index.html',
    'process.env.kidsHomeWorkUrl':
      'https://hdkj-test.zmtalent.com/zmgEditorHomework/',
    'process.env.pbookUrl':
      'https://hdkj-test.zmtalent.com/zm_picturebook_web/',
    'process.env.managerUrl': 'http://p-test.zmlearn.com/zm-ai-editor-manager/',
    'process.env.loginUrl': 'https://p-test.zmlearn.com/',
    'process.env.waveCaptionsToolUrl':
      'https://hdkj-test.zmtalent.com/zmgEditorHomework/audioWave',
    'process.env.webServerName': 'fat',
    'process.env.environment': 'fat',
    'process.env.logLevel': 'error',
    'process.env.port': '23461',
  },
});
