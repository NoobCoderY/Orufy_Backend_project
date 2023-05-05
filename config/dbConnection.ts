
import neo4j from 'neo4j-driver';

//**********************************Connect Database*********************************/
const dbConnection=()=>{
const driver = neo4j.driver('bolt://3.95.224.76:7687',
                  neo4j.auth.basic('neo4j', 'logs-panels-hyphens'), 
                  {/* encrypted: 'ENCRYPTION_OFF' */});
                  return driver;

}

export  default dbConnection;

