// @flow

import { httpGet } from '../../utils/helperFuncs';
import AUTH_TOKEN from './auth_token';

/**
 *  Upload a string to GitHub Gists and get the Gist's URL
 *
 * @param title    | The title as it will appear on GitHub Gists
 * @param content  | The text to be uploaded
 * @param fileType | The file extension that is put on the file
 *                 | name in the Gist; optional, defaults to '.md'
 * @returns The URL of the uploaded Gist
 */
const upload = async (
  title: string,
  content: string,
  fileType: string = '.md'
) => {
  // Form the POST data to be sent with the HTTP request to GitHub
  const data = {
    description: title,
    public: true,
    files: {
      [`${title}${fileType}`]: { content }
    }
  };

  try {
    // Send the data to GitHub and retrieve the post details
    const reply = await httpGet({
      url: `https://api.github.com/gists?access_token=${AUTH_TOKEN}`,
      headers: {
        'User-Agent': 'Quizzical'
      },
      method: 'POST',
      json: true,
      body: data
    });

    // Return the viewable URL
    return reply.html_url;
  } catch (e) {
    console.warn(e);
    return 'Something went wrong!';
  }
};

export default upload;
