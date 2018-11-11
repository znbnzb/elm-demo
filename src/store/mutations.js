import {
  RECORD_USERINFO,
  GET_USERINFO,
  OUT_LOGIN,

} from './mutation-types.js'

import {
  setStore
} from '../config/mUtils'


export default {

  // 记录用户信息
  [RECORD_USERINFO](state, info) {
    state.userInfo = info;
    state.login = true;
    setStore('user_id', info.user_id);
  },
  //获取用户信息存入vuex
  [GET_USERINFO](state, info) {
    if (state.userInfo && (state.userInfo.username !== info.username)) {
      return;
    };
    if (!state.login) {
      return
    }
    if (!info.message) {
      state.userInfo = { ...info
      };
    } else {
      state.userInfo = null;
    }
  },
  //退出登录
  [OUT_LOGIN](state) {
    state.userInfo = {};
    state.login = false;
  }

}
