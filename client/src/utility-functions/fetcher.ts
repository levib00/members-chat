const getFetcher = async (url: string) => {
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
  if (data.status === 200) {
    return data.json();
  }
  throw new Error(`${data.status}, something went wrong`);
};

// eslint-disable-next-line import/prefer-default-export
export { getFetcher };
