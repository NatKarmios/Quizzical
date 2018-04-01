// @flow

import { httpGet, notify } from '../utils/helperFuncs';

// The IP of the Quizzical companion script's HTTP server
const BOT_IP = '127.0.0.1';

// The HTTP URL of the Quizzical companion script's HTTP server
const BOT_URL = `http://${BOT_IP}:23120`;

/**
 *  Tests connection to StreamLabs Bot; the streamer must be
 *  running the Quizzical companion script.
 *
 * @returns A promise that resolves once the action is complete
 */
export const testConnection = async (): Promise<void> => {
  let reply = null;
  try {
    // Attempt to ping Steamlabs Bot
    reply = await httpGet({ url: `${BOT_URL}/ping`, json: true });
  } catch (e) {
    console.warn(e);
  }

  // Notify the streamer whether the ping was successful
  if (
    reply !== undefined &&
    reply !== null &&
    reply.success !== undefined &&
    reply.success !== null &&
    typeof reply.success === 'boolean' &&
    reply.success === true
  ) {
    notify('Successfully pinged StreamLabs Bot');
  } else {
    notify(
      "Couldn't ping StreamLabs Bot. Check Quizizcal settings," +
        'and make sure you are running the companion script.',
      'warning'
    );
  }
};

/**
 *  Distributes the specified amount of points to the specified
 *  list of users, via StreamLabs Bot.
 *
 * @param users  | The viewers to recieve points
 * @param amount | The amount of points to give
 * @returns A promise that resolves once the action is complete
 */
export const distributePoints = async (
  users: Array<string>,
  amount: number
) => {
  // Abort if there are no users to send points to
  if (users.length === 0) {
    notify('No winners to distribute points to.');
    return;
  }

  let reply = null;

  try {
    // Attempt to make the request to Streamlabs Bot
    reply = await httpGet({
      url: `${BOT_URL}/add_points`,
      method: 'POST',
      json: true,
      body: { amount, users }
    });
  } catch (e) {
    console.warn(e);
  }

  // Notify the streamer of the result of the attempt
  if (
    reply !== undefined &&
    reply !== null &&
    reply.success !== undefined &&
    reply.success !== null &&
    typeof reply.success === 'boolean' &&
    reply.message !== undefined &&
    reply.message !== null &&
    typeof reply.message === 'string'
  ) {
    if (reply.success === true) {
      notify(reply.message);
    } else {
      notify(`Couldn't add points to winners: ${reply.message}`);
    }
  } else {
    notify(
      "Couldn't add points via StreamLabs Bot. Check Quizizcal settings," +
        'and make sure you are running the companion script.',
      'warning'
    );
  }
};
