// @flow


import { httpGet } from '../../utils/helperFuncs';

const upload = async (title: string, content: string, fileType: string='.md') => {
  const data = {
    description: title,
    public: true,
    files: {
      [`${title}${fileType}`]: { content }
    }
  };

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

    return reply.html_url;
  } catch (e) {
    return 'Something went wrong!';
  }
};

export default upload;
