# start
yarn install
npm start

需建立config.js
config.js
```
export default {
  line: {
    channelId: '',
    channelSecret: '',
    channelAccessToken: ''
  },
  lineIds: {
    whiteList: ['']
  },
  openai: {
    key: '',
  },
};
```