import { registerInfo } from "./getters";

export const saveUserInfo = (state, userInfo) => {
  state.userInfo = userInfo;
}
export const saveRegisterInfo = (state, registerInfo) => {
  state.registerInfo = registerInfo;;
}
