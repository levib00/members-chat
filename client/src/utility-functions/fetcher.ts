export const getFetcher = (url: string) => fetch(url, { 
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  // 'Access-Control-Allow-Origin': '*',
  mode: 'cors'
})
.then(res => res.json())
.catch(function(error) {
  console.log("error---", error)
});
