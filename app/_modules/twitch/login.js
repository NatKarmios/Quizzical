// @flow

import { remote } from 'electron';
import { createServer } from 'http';
import connect from 'connect';
import qs from 'qs';
import { delay, httpGet } from '../../utils/helperFuncs';

// <editor-fold desc="Constants">

// Extract BrowserWindow class and session object from `remote`
const { BrowserWindow, session } = remote;

// The client ID to use when accessing the Twitch API
// noinspection SpellCheckingInspection
const CLIENT_ID = 'aaq1ihaa22xgkeswvo8r02pi62iiw2';

// The port to open the local authentication webserver on
const AUTH_SERVER_PORT = 23121;

// A mapping of potential responses to HTTP requests sent to the
// local authentication webserver
const WEBSERVER_REPLY = {
  // The pre-authentication endpoint
  preauth:
    "<html><head><script type='text/javascript'>" +
    "window.location = 'http://127.0.0.1:23121/auth?' + window.location.hash.substr(1);" +
    '</script> </head>',

  // The main endpoint, on a successful login
  success: '<html><body>Redirecting...</body></html>',

  // The main endpoint, on an unsuccessful login
  failure: {
    // The first part of the response
    s1: '<html><body>Auth failed!<br /><br />Supplied query string:<br />',
    // The second part of the response
    s2: '</body></html>'
  }
};

// </editor-fold>

// <editor-fold desc="Types">

export type LoginParsedQueryType = {
  // eslint-disable-next-line flowtype/delimiter-dangle
  access_token: string
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

// <editor-fold desc="Helper Functions">

/**
 *  Get the authentication URL to use when logging into Twitch
 *
 * @param forceVerify | Whether or not to force Twitch to re-verify the login
 * @param scopes      | The autentication scopes to request when loggin in
 * @returns The URL to direct the streamer to
 */
const authURL = (forceVerify: boolean = false, scopes: Array<string>) =>
  `${'https://api.twitch.tv/kraken/oauth2/authorize' +
    `?client_id=${CLIENT_ID}` +
    '&redirect_uri=http://127.0.0.1:23121' +
    '&response_type=token' +
    '&scope='}${scopes.join('+')}${forceVerify ? '&force_verify=true' : ''}`;

/**
 *  Create and load the popup window for logging into Twitch
 *
 * @param sessionPartition | The partition of the browser cache to use when connecting
 * @param persist          | Whether or not a persistent cache is used
 * @param cache            | Whether to cache the browser session
 * @param scopes           |
 * @returns The instantiated BrowserWindow
 */
function loadPopup(
  sessionPartition: ?string,
  persist: boolean,
  cache: boolean,
  scopes: Array<string>
) {
  // Calculate the partition string
  const realPartition =
    sessionPartition !== null && sessionPartition !== undefined
      ? `${persist ? 'persist:' : ''}${sessionPartition}`
      : sessionPartition;

  // Get the browser session using the partition string
  const browserSession = session.fromPartition(realPartition, { cache });

  // Instantiate the popup window
  const popupWindow = new BrowserWindow({
    title: 'Quizzical | Log into Twitch',
    width: 400,
    height: 550,
    // show: false,
    alwaysOnTop: true,
    modal: true,
    parent: remote.getCurrentWindow(),
    session: browserSession
  });

  // Remove dropdown menus from the popup window
  popupWindow.setMenu(null);

  // Direct the popup window to the login page
  popupWindow.loadURL(authURL(true, scopes));

  return popupWindow;
}

/**
 *  Initiates logging into Twitch using GUI and a local authentication webserver
 *
 * @param sessionPartition | The partition of the browser cache to use when connecting
 * @param persist          | Whether or not a persistent cache is used
 * @param cache            | Whether to cache the browser session
 * @param scopes           | The authentication scopes to request when logging into Twitch
 * @returns A promise that resolves with the OAuth token recieved from Twitch,
 *          or null if login was unsuccessful
 */
async function loginWithLocalAuthWebserver(
  sessionPartition: string,
  persist: boolean,
  cache: boolean,
  scopes: Array<string>
): Promise<?string> {
  // <editor-fold desc="Clear cache and saved data from browser sessions">
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
  // </editor-fold>

  // Load the popup window
  const popupWindow = loadPopup(sessionPartition, persist, cache, scopes);
  let token = null;

  // Initialize the local webserver
  const app = connect();

  // Create a promise that resolves when the local webserver recieves an
  // acceptable response
  const replyPromise = new Promise(resolve => {
    app.use((req, res) => {
      // If the request was to the authentication endpoint...
      if (req.url.startsWith('/auth')) {
        // Get and parse the query string from the request
        // eslint-disable-next-line no-underscore-dangle
        const queryRaw = req._parsedUrl.query;
        const queryParsed: LoginParsedQueryType = qs.parse(queryRaw);

        // If the query string contains an 'access_token' property...
        // eslint-disable-next-line no-prototype-builtins
        if (queryParsed.hasOwnProperty('access_token')) {
          // Store the token
          token = queryParsed.access_token;

          // Resolve the promise
          resolve();

          // Attempt to force-close the popup window, as login was successful
          try {
            popupWindow.close();
            popupWindow.destroy();
          } catch (_) {
            // Ignore errors
          }

          // Serve the success response
          res.end(WEBSERVER_REPLY.success);
        } else {
          // Serve the failure response if the request was invalid
          // The query string is supplied here for debugging purposes
          res.end(
            WEBSERVER_REPLY.failure.s1 + queryRaw + WEBSERVER_REPLY.failure.s2
          );
        }
      } else {
        // ...otherwise, serve the preauthentication response
        res.end(WEBSERVER_REPLY.preauth);
      }
    });
  });

  // Instantiate the webserver and make it start listening for requests
  const server = createServer(app).listen(`${AUTH_SERVER_PORT}`, () => {
    console.log('Local authentication webserver started.');
  });

  // Here, I encountered a strange bug; on some devices, the body of the login page,
  // whilst set to "100%", always stays a bit bigger than the window size.
  // This means that the 'ready-to-show' event never fires.
  // To counteract this, I just show the window immediately, rather than
  // attempting to wait for an event that never fires.

  // Show the popup window
  popupWindow.show();

  // Set the OS' focus on the popup window
  popupWindow.focus();

  // Create a new promise for when the popup window is closed
  const popupClosedPromise = new Promise(resolve => {
    popupWindow.on('closed', resolve);
  });

  // Wait for a successful reply to be recieved OR the popup window to be closed
  await Promise.race([replyPromise, popupClosedPromise]);

  // Destroy the popup window
  popupWindow.destroy();

  // Close the local webserver
  server.close();

  return token;
}

/**
 *  Get the necessary information about a Twitch account using an OAuth token
 *
 * @param token | The account's OAuth token
 * @returns A promise that resolves with the account information,
 *          or null if retrieval was unsuccessful
 */
async function retrieveAccountDetails(
  token: string
): Promise<?AccountDetailsType> {
  // Get the account's username
  const username = await retrieveUsername(token);

  // Verify that username retrieval was successful
  if (username === null || username === undefined) return null;

  // This short delay fixes some internal issues with NodeJS, where too-frequent requests
  // like this can cause a socket hangup
  await delay(200);

  // Get the account's display name and a URL to its avatar image
  const avatarAndDisplayName = await retrieveAvatarAndDisplayName(
    token,
    username
  );

  // Verify that avatar and display name retrieval was successful
  if (avatarAndDisplayName === null || avatarAndDisplayName === undefined)
    return null;

  return { username, ...avatarAndDisplayName };
}

/**
 *  Get a Twitch account's username using an OAuth token
 *
 * @param token | The account's OAuth token
 * @returns A promise that resolves with the account's username,
 *          or null if retrieval was unseccessful
 */
async function retrieveUsername(token: string): Promise<?string> {
  try {
    // Make a request to the Twitch API's base endpoint; this provides
    // all the information needed
    const reply: LoginUsernameReplyType = await httpGet({
      uri: 'https://api.twitch.tv/kraken',
      headers: {
        Authorization: `OAuth ${token}`,
        'CLIENT-ID': CLIENT_ID
      },
      json: true
    });

    // Attempt to return the username from the retrieved data
    return reply.token.user_name;
  } catch (exception) {
    // If there was a problem retrieving or parsing the response,
    // log the auth token used and the exception thrown
    console.warn('There was a problem retrieving a username!', {
      token,
      exception
    });

    return null;
  }
}

/**
 *  Get a Twitch account's display name, and a URL to its avatar image
 *
 * @param token | The account's OAuth token
 * @param username | The account's username
 * @returns A promise that resolves with the retrieved information,
 *          or null if retrieval was unsuccessful
 */
async function retrieveAvatarAndDisplayName(token: string, username: string) {
  try {
    // Make a request to the Twitch API's 'users' endpoint
    const reply = await httpGet({
      uri: `https://api.twitch.tv/helix/users?login=${username}`,
      headers: {
        Authorization: `OAuth ${token}`,
        'CLIENT-ID': CLIENT_ID
      },
      json: true
    });

    // Get all the account data
    const [allDetails] = reply.data;

    // Return the necessary information
    return {
      avatarURL: allDetails.profile_image_url,
      displayName: allDetails.display_name
    };
  } catch (e) {
    // If there was a problem retrieving or parsing,
    // Then log the exception to the console
    console.warn(
      'There was a problem retrieving a display name and avatar URL!',
      e
    );
    return null;
  }
}

// </editor-fold>

/**
 *  Log in using a pre-existing OAuth token
 *
 * @param token | The Twitch account's OAuth token
 * @returns A promise that resolves with the Twitch account's username, avatar URL
 *          and display name, or null if loggin in or retrieval was unsuccessful
 */
export async function tokenLogin(token: ?string): Promise<?AccountDetailsType> {
  // Verify the token is a valid string
  if (token === undefined || token === null || token === '') return null;

  // Get and return the account information
  return retrieveAccountDetails(token);
}

/**
 *  Log in using the GUI and a local webserver
 *
 * @param sessionPartition | The partition of the browser cache to use when connecting
 * @param scopes           | The authentication scopes to request when logging into Twitch
 * @param persist          | Whether or not a persistent cache is used
 * @param cache            | Whether to cache the browser session
 * @returns A promise that resolves with the Twitch account's username, avatar URL
 *          and display name, or null if loggin in or retrieval was unsuccessful
 */
export async function guiLogin(
  sessionPartition: string,
  scopes: Array<string> = [],
  persist: boolean = false,
  cache: boolean = false
): Promise<?LoginDataType> {
  // Perform the login
  const token: ?string = await loginWithLocalAuthWebserver(
    sessionPartition,
    persist,
    cache,
    scopes
  );

  // Verify the login was successful
  if (token === null || token === undefined) return null;

  // Retrieve the account details
  const details = await retrieveAccountDetails(token);

  // Verify that retrieval was successful
  if (details === null || details === undefined) return null;

  return { token, details };
}
