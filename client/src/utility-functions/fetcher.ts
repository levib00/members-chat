const getFetcher = async (url: string) => {
  try {
    const data = await fetch(url, {
      method: 'GET',
      // @ts-ignore
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: (() => {
          const token = localStorage.getItem('jwt');
          if (token) {
            return `Bearer ${token}`;
          }
          return null;
        })(),
      },
      // 'Access-Control-Allow-Origin': '*',
      mode: 'cors',
    });

    return await data.json();
  } catch (error: any) {
    throw new Error(error);
  }
};

// eslint-disable-next-line import/prefer-default-export
export { getFetcher };
