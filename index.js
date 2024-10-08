import { app } from "./app.js"
import { connectDatabase } from "./backend/database.js"
import "dotenv/config"
//const connecteddb = connectDatabase()
//console.log(connecteddb)
//console.log(process.env.USER,process.env.ORACLE_PASSWORD,process.env.ORACLE_CONNECTION_STRING)
/*connecteddb
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`server Running at localhost:${process.env.PORT}`)
    })
})
.catch((error)=>{
    console.error("Failure Error",error)
})*/
connectDatabase()
  .then((connecteddb) => {
    if (connecteddb !== -1) {
      app.listen(process.env.PORT, () => {
        console.log(`Server running at localhost:${process.env.PORT}`);
      });
    } else {
      console.error('Failed to connect to the database.');
    }
  })
  .catch((error) => {
    console.error('Connection error:', error);
  });
/*
async function run(){
    const connecteddb = await connectDatabase();
    
    if (connecteddb !== -1) {  // Check if the connection was successful
      try {
        // Execute a SQL query
        const result = await connecteddb.execute('create table hh(a char(2))');
        console.log('Table created successfully:', result);
      } catch (err) {
        console.error('Error executing query:', err);
      } finally {
        // Close the connection
        try {
           await connecteddb.close()
           console.log("database disconnected")
        } catch (err) {
          console.error('Error closing connection:', err);
        }
      }
    } else {
      console.error('Failed to connect to the database');
    }
  }
  */
  // Run the async function
  //run();
  