// @flow


import { httpGet } from '../../utils/helperFuncs';

export const upload = async (title, content, fileType='.md') => {
  const data = {
    description: title,
    public: true,
    files: {}
  };

  data.files[`${title}${fileType}`] = { content };

  try {

    const reply = await httpGet({
      url: 'https://api.github.com/gists',
      headers: {
        'User-Agent': 'Quizzical'
      },
      method: 'POST',
      json: true,
      body: data
    });

    return reply['html_url'];

  } catch (e) {
    return 'Something went wrong!';
  }
};
