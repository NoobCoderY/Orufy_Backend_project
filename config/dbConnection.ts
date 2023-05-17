
import neo4j from 'neo4j-driver';

//**********************************Connect Database*********************************/
const dbConnection=()=>{
const driver = neo4j.driver(process.env.DATABASE_URI!,
                  neo4j.auth.basic(process.env.USER_NAME!, process.env.PASSWORD!), 
                  {/* encrypted: 'ENCRYPTION_OFF' */});
                  return driver;
}

export  default dbConnection;

