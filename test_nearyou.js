
const http = require('http');

function get(path) {
  return new Promise((resolve, reject) => {
    http.get({
      hostname: 'localhost',
      port: 5000,
      path: path,
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          console.error("Parse error for " + path + ": " + data);
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function testNearYou() {
  const city = "Chamoli";
  console.log(`Testing NearYou for city: ${city}`);
  
  try {
    const pRes = await get(`/api/products?location=${city}&limit=6`);
    console.log("Products:", pRes.products?.length || pRes.data?.length || 0);
    
    const rRes = await get(`/api/rooms/filter?city=${city}&limit=6&sort=createdAt_desc`);
    console.log("Rooms:", rRes.data?.length || 0);
    
    const sRes = await get(`/api/services/filter?city=${city}&limit=6`);
    console.log("Services:", sRes.data?.length || 0);
    
    const jRes = await get(`/api/jobs/filter?location=${city}&limit=6`);
    console.log("Jobs:", jRes.jobs?.length || 0);
    
  } catch (e) {
    console.error("Error fetching data:", e);
  }
}

testNearYou();
