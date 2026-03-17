import pymysql
from typing import Dict, List, Any
from src import config

def get_connection(config: Dict[str, Any]) -> pymysql.connections.Connection:
    """Establishes a connection to the database."""
    return pymysql.connect(**config)

def get_target_databases(connection: pymysql.connections.Connection, company_choice: str) -> List[str]:
    """Gets the list of relevant databases based on the selected company."""
    with connection.cursor() as cursor:
        cursor.execute("SHOW DATABASES")
        all_dbs_on_server = {db[0] for db in cursor.fetchall()}

    # First, find all dbs that could possibly be relevant (the old logic)
    possibly_relevant_dbs = {
        db for db in all_dbs_on_server
        if 'cantera' in db or 'obra' in db or db in ['implenia_prd', 'maquinaria_prd', 'tocsa_prd']
    }

    # Next, identify the IMPLENIA dbs from within the relevant set
    implenia_dbs = {
        db for db in possibly_relevant_dbs
        if db in config.IMPLENIA_DBS["explicit"] or config.IMPLENIA_DBS["pattern"].match(db)
    }
    
    # TOCSA dbs are all other relevant dbs that are NOT Implenia dbs
    tocsa_dbs = possibly_relevant_dbs - implenia_dbs

    if company_choice == "TOCSA":
        return sorted(list(tocsa_dbs))
    elif company_choice == "IMPLENIA":
        return sorted(list(implenia_dbs))
    elif company_choice == "TODAS":
        # Union both sets to get all unique dbs
        return sorted(list(tocsa_dbs.union(implenia_dbs)))
    
    return []

def insert_user(connection: pymysql.connections.Connection, db_name: str, table_name: str, user_data: Dict[str, Any]) -> None:
    """Inserts a user into the specified database."""
    with connection.cursor() as cursor:
        query = f"""
            INSERT INTO `{db_name}`.`{table_name}` 
            (Code, Name, AccessGroup, Email) 
            VALUES (%s, %s, %s, %s)
        """
        values = (
            user_data["code"],
            user_data["name"],
            user_data["access_group"],
            user_data["email"]
        )
        cursor.execute(query, values)
