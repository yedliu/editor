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
    'process.env.apiUrl': 'https://p.uat.zmops.cc/',
    'process.env.openapiUrl': 'https://kids-app-gateway.uat.zmops.cc/',
    'process.env.prevVideoAIUrl':
      'https://hdkj-ai.uat.zmops.cc/zm-ai-videoclass/index.html?env=uat',
    'process.env.prevVoiceClassUrl':
      'https://hdkj-ai.uat.zmops.cc/zm-ai-voiceclass/index.html?env=uat',
    'process.env.prevUrl':
      'https://hdkj-ai.uat.zmops.cc/zm_course_web2/index.html',
    'process.env.kidsHomeWorkUrl':
      'https://hdkj-ai.uat.zmops.cc/zmgEditorHomework/',
    'process.env.pbookUrl': 'https://hdkj-ai.uat.zmops.cc/zm_picturebook_web/',
    'process.env.managerUrl': 'http://p.uat.zmops.cc/zm-ai-editor-manager/',
    'process.env.loginUrl': 'https://p.uat.zmops.cc/',
    'process.env.waveCaptionsToolUrl':
      'https://hdkj-ai.uat.zmops.cc/zmgEditorHomework/audioWave',
    'process.env.webServerName': 'uat',
    'process.env.environment': 'uat',
    'process.env.logLevel': 'error',
    'process.env.port': '23461',
  },
});
