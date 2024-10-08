import oracledb from "oracledb";
import 'dotenv/config'
// Initialize Oracle Client (Thick mode)
try {
  oracledb.initOracleClient(); 
} catch (err) {
  console.error('Failed to initialize Oracle Client:', err);
  process.exit(1);
}
/*
async function connectDatabase(){
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: process.env.ORACLE_USER,
      password:process.env.ORACLE_PASSWORD, // Ensure this environment variable is correctly set
      connectionString: process.env.ORACLE_CONNECTION_STRING // For Oracle XE
    });
    console.log('Connection Established');
  } catch (err) {
    console.log('Error', err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.log('Error during connection close:', err);
      }
    }
  }
}
*/
const connectDatabase = async()=>{
  let connection
  try{
    connection = await oracledb.getConnection({
      user:process.env.USER,
      password:process.env.ORACLE_PASSWORD,
      connectionString:process.env.ORACLE_CONNECTION_STRING
    })
  }
  catch(err){
    console.log('Connection failed due to',err)
  }
  finally{
    if(connection){
      return connection
    }
    else{
      return -1
    }
  }
}

export {
  connectDatabase
}