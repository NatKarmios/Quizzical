// @flow
import { remote } from 'electron';
import { createServer } from 'http';
import connect from 'connect';
import { parse } from 'qs';
import request from 'request-promise-native';

const { BrowserWindow, session } = remote;

const authURL = (forceVerify: boolean = false) => (`${'https://api.twitch.tv/kraken/oauth2/authorize' +
                                                   '?client_id=aaq1ihaa22xgkeswvo8r02pi62iiw2' +
                                                   '&redirect_uri=http://127.0.0.1:23121' +
                                                   '&response_type=token' +
                                                   '&scope='}${
                                                   forceVerify ? '&force_verify=true' : ''}`);

const WEBSERVER_REPLY = {
  preauth: "<html><head><script type='text/javascript'>" +
             "window.location = 'http://127.0.0.1:23121/auth?' + window.location.hash.substr(1);" +
           '</script> </head>',
  success: '<html><head></head><body>Redirecting...</body></html>',
  failure: {
    s1: '<html><head></head><body>Auth failed!<br /><br />Supplied query string:<br />',
    s2: '</body></html>'
  }
};

// <editor-fold desc="Types">

export type LoginRawQueryType = {
  url: string,
  _parsedUrl: {
    query: string
  }
};

export type LoginParsedQueryType = {
  // eslint-disable-next-line flowtype/delimiter-dangle
  access_token: string,
};

export type LoginUsernameReplyType = {
  token: {
    user_name: string
  }
};

export type LoginDataType = {
  token: string,
  username: string
};

// </editor-fold>


function loadPopup(sessionPartition: ?string, persist: boolean, cache: boolean) {
  const realPartition = (sessionPartition !== null && sessionPartition !== undefined) ?
    `${persist ? 'persist:' : ''}${sessionPartition}` :
    sessionPartition;

  const sess = session.fromPartition(realPartition, { cache });

  const popupWindow = new BrowserWindow({
    title: 'Quizzical | Log into Twitch',
    width: 400,
    height: 550,
    // show: false,
    // alwaysOnTop: true,
    // modal: true,
    // parent: remote.getCurrentWindow()
    session: sess
  });
  popupWindow.setMenu(null);

  popupWindow.loadURL(authURL(true));

  return popupWindow;
}

async function loginWithLocalAuthWebserver(
  sessionPartition: string, persist: boolean, cache: boolean
): Promise<?string> {
  await new Promise(resolve => {
    remote.session.defaultSession.clearStorageData([], (data) => {
      resolve();
    });
  });

  await new Promise(resolve => {
    remote.session.defaultSession.clearCache((data) => {
      resolve();
    });
  });

  const popupWindow = loadPopup(sessionPartition, persist, cache);
  let token = null;

  const app = connect();

  const replyPromise = new Promise(resolve => {
    app.use((req, res) => {
      if (req.url.startsWith('/auth')) {
        // eslint-disable-next-line no-underscore-dangle
        const queryRaw = req._parsedUrl.query;
        const queryParsed: LoginParsedQueryType = parse(queryRaw);

        // eslint-disable-next-line no-prototype-builtins
        if (queryParsed.hasOwnProperty('access_token')) {
          token = queryParsed.access_token;
          resolve();
          try {
            popupWindow.close();
            popupWindow.destroy();
          } catch (_) { /* ignored */ }

          res.end(WEBSERVER_REPLY.success);
        } else res.end(WEBSERVER_REPLY.failure.s1 + queryRaw + WEBSERVER_REPLY.failure.s2);
      } else res.end(WEBSERVER_REPLY.preauth);
    });
  });

  const server = createServer(app).listen(23121, () => {
    console.log('Local authentication webserver started.');
  });

  /*
  Here, I encountered a strange bug; on some devices, the body of the login page,
  whilst set to "100%", always stays a bit bigger than the window size.
  This means that the 'ready-to-show' event never fires.
  */


  // popupWindow.webContents.once('ready-to-show', () => {
  //   console.log('ready');
  popupWindow.show();
  popupWindow.focus();
  // });

  const popupClosedPromise = new Promise(resolve => {
    popupWindow.on('closed', resolve);
  });

  await Promise.race([replyPromise, popupClosedPromise]);
  popupWindow.destroy();
  server.close();
  return token;
}

async function retrieveUsername(token: string) {
  const reply: LoginUsernameReplyType = await request({
    uri: 'https://api.twitch.tv/kraken',
    headers: { Authorization: `OAuth ${token}` },
    json: true
  });
  return reply.token.user_name;
}

export async function tokenLogin(token: ?string) {
  if (token === undefined || token === null) return null;
  return retrieveUsername(token);
}

export async function guiLogin(
  sessionPartition: string,
  persist: boolean = false,
  cache: boolean = false
): Promise<?LoginDataType> {
  const token: ?string = await loginWithLocalAuthWebserver(sessionPartition, persist, cache);
  if (token !== null && token !== undefined) {
    return { token, username: await retrieveUsername(token) };
  }
  return null;
}
