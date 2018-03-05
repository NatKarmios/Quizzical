// @flow

import { remote } from 'electron';
import { createServer } from 'http';
import connect from 'connect';
import qs from 'qs';
import { delay, httpGet } from '../../utils/helperFuncs';


const { BrowserWindow, session } = remote;
// noinspection SpellCheckingInspection
const CLIENT_ID = 'aaq1ihaa22xgkeswvo8r02pi62iiw2';

const authURL =
  (forceVerify: boolean = false, scopes: Array<string>) =>
    (`${'https://api.twitch.tv/kraken/oauth2/authorize' +
        `?client_id=${CLIENT_ID}` +
        '&redirect_uri=http://127.0.0.1:23121' +
        '&response_type=token' +
        '&scope='}${scopes.join('+')}${
        forceVerify ? '&force_verify=true' : ''}`);

const WEBSERVER_REPLY = {
  preauth: "<html><head><script type='text/javascript'>" +
             "window.location = 'http://127.0.0.1:23121/auth?' + window.location.hash.substr(1);" +
           '</script> </head>',
  success: '<html><body>Redirecting...</body></html>',
  failure: {
    s1: '<html><body>Auth failed!<br /><br />Supplied query string:<br />',
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

export type AccountDetailsType = {
  username: string,
  displayName: string,
  avatarURL: string
};

export type LoginDataType = {
  token: string,
  details: AccountDetailsType
};

// </editor-fold>


function loadPopup(
  sessionPartition: ?string, persist: boolean, cache: boolean, scopes: Array<string>
) {
  const realPartition = (sessionPartition !== null && sessionPartition !== undefined) ?
    `${persist ? 'persist:' : ''}${sessionPartition}` :
    sessionPartition;

  const browserSession = session.fromPartition(realPartition, { cache });

  const popupWindow = new BrowserWindow({
    title: 'Quizzical | Log into Twitch',
    width: 400,
    height: 550,
    // show: false,
    // alwaysOnTop: true,
    // modal: true,
    // parent: remote.getCurrentWindow()
    session: browserSession
  });
  popupWindow.setMenu(null);

  popupWindow.loadURL(authURL(true, scopes));

  return popupWindow;
}

async function loginWithLocalAuthWebserver(
  sessionPartition: string, persist: boolean, cache: boolean, scopes: Array<string>
): Promise<?string> {
  await new Promise(resolve => {
    remote.session.defaultSession.clearStorageData([], () => {
      resolve();
    });
  });

  await new Promise(resolve => {
    remote.session.defaultSession.clearCache(() => {
      resolve();
    });
  });

  const popupWindow = loadPopup(sessionPartition, persist, cache, scopes);
  let token = null;

  const app = connect();

  const replyPromise = new Promise(resolve => {
    app.use((req/* : LoginRawQueryType */, res) => {
      if (req.url.startsWith('/auth')) {
        // eslint-disable-next-line no-underscore-dangle
        const queryRaw = req._parsedUrl.query;
        const queryParsed: LoginParsedQueryType = qs.parse(queryRaw);

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

async function retrieveAccountDetails(token: string): Promise<?AccountDetailsType> {
  const username = await retrieveUsername(token);
  if (username === null || username === undefined) return null;

  await delay(200);

  const avatarAndDisplayName = await retrieveAvatarAndDisplayName(token, username);
  if (avatarAndDisplayName === null || avatarAndDisplayName === undefined) return null;

  return { username, ...avatarAndDisplayName };
}

async function retrieveUsername(token: string): Promise<?string> {
  try {
    const reply: LoginUsernameReplyType = await httpGet({
      uri: 'https://api.twitch.tv/kraken',
      headers: {
        Authorization: `OAuth ${token}`,
        'CLIENT-ID': CLIENT_ID
      },
      json: true
    });
    return reply.token.user_name;
  } catch (e) {
    console.log('There was a problem retrieving a username!', e);
    return null;
  }
}

async function retrieveAvatarAndDisplayName(token: string, username: string) {
  try {
    const reply = await httpGet({
      uri: `https://api.twitch.tv/helix/users?login=${username}`,
      headers: {
        Authorization: `OAuth ${token}`,
        'CLIENT-ID': CLIENT_ID
      },
      json: true
    });
    const allDetails = reply.data[0];
    return { avatarURL: allDetails.profile_image_url, displayName: allDetails.display_name };
  } catch (e) {
    console.log('There was a problem retrieving a display name and avatar URL!', e);
    return null;
  }
}

export async function tokenLogin(token: ?string): Promise<?AccountDetailsType> {
  if (token === undefined || token === null || token === '') return null;
  return retrieveAccountDetails(token);
}

export async function guiLogin(
  sessionPartition: string,
  scopes: Array<string> = [],
  persist: boolean = false,
  cache: boolean = false,
): Promise<?LoginDataType> {
  const token: ?string =
    await loginWithLocalAuthWebserver(sessionPartition, persist, cache, scopes);
  if (token === null || token === undefined) return null;

  const details = await retrieveAccountDetails(token);
  if (details === null || details === undefined) return null;

  return { token, details };
}
