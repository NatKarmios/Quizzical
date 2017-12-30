// @flow

export type AccountDataType = {
  nick: string,
  display: string,
  avatar: string
}

export type VarsType = {
  accountData: {
    streamer: AccountDataType,
    bot: AccountDataType
  }
}

const vars: VarsType = {
  accountData: {
    streamer: {
      nick: '',
      display: '',
      avatar: ''
    },
    bot: {
      nick: '',
      display: '',
      avatar: ''
    }
  }
};

export default vars;
