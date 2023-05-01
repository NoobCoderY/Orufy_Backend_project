
import neo4j from 'neo4j-driver';

//**********************************Connect Database*********************************/
const dbConnection=()=>{
const driver = neo4j.driver('bolt://54.145.167.130:7687',
                  neo4j.auth.basic('neo4j', 'mornings-ally-shoulder'), 
                  {/* encrypted: 'ENCRYPTION_OFF' */});
                  return driver;

}

export  default dbConnection;

