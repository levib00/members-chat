const getFetcher = async (url: string) => {
  const data = await fetch(url, { 
    method: 'GET',
    headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
    },
    // 'Access-Control-Allow-Origin': '*',
    mode: 'cors'
  })
  if (data.status === 200) {
    return data.json()
  }
  throw new Error(`${data.status}, something went wrong`)
}

export{ getFetcher }
