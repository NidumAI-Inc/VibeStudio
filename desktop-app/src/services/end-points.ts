export const root = {
  localBackendUrl: 'http://localhost:40901',
  liveBackendUrl: 'https://nativenode.link.nativenode.host:5633/api',
  ttsLocalUrl: 'http://localhost:40902/api/tts',
  // liveBackendUrl: 'http://localhost:5001/api',
} as const

export const endPoints = {
  // local
  uploadFolder: '/upload-folder',

  nodes: {
    content: '/nodes/content',
    rename: '/nodes/rename',
    file: '/nodes/file',
    list: '/nodes/list',
    root: '/nodes',
  },

  general: {
    checkPortInUse: '/general/check-port',
    checkLampLive: '/general/check-lamp-live',
  },

  // live
  register: '/user/register',
  resendOtp: '/user/resend-otp',
  verifyOtp: '/user/verify-otp',
  updatePass: '/user/update-pass',
  forgetPass: '/user/forget-pass',
  resetPass: '/user/reset-pass',
  login: '/user/login',
  logout: '/user/logout',
  deleteAccount: '/user/account',

  usage: {
    overview: '/usage/overview',
    server: '/usage/server/', // :serverId
    update: '/usage',
  },
} as const

export const ttsEndPoints = {
  generate: '/',
  stream: '/stream',
  status: '/status',
  audio: (filename: string) => `/${filename}`,
  delete: '/',
} as const
