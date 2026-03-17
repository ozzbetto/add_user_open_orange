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

def get_all_databases(connection: pymysql.connections.Connection) -> List[str]:
    """Gets the list of all relevant databases."""
    with connection.cursor() as cursor:
        cursor.execute("SHOW DATABASES")
        all_dbs = [db[0] for db in cursor.fetchall()]
    
    # Filter databases that follow the requested pattern
    filtered_dbs = [
        db for db in all_dbs 
        if db.startswith('obra_') or db.startswith('cantera_') or db in ['tocsa_prd', 'implenia_prd', 'maquinaria_prd']
    ]
    return filtered_dbs

def deactivate_user(connection: pymysql.connections.Connection, db_name: str, table_name: str, user_code: str) -> bool:
    """
    Deactivates a user in a specific database by setting the 'Closed' field to 1.
    Returns True if the user was deactivated, False otherwise.
    """
    with connection.cursor() as cursor:
        try:
            cursor.execute(f"USE `{db_name}`")
            # Check if user exists and is not already closed
            query = f"SELECT `Closed` FROM `{table_name}` WHERE `Code` = %s"
            cursor.execute(query, (user_code,))
            result = cursor.fetchone()

            if result is None:
                print(f"  - El usuario '{user_code}' no existe en '{db_name}'.")
                return False

            if result[0] == 1:
                print(f"  - El usuario '{user_code}' ya estaba inactivo en '{db_name}'.")
                return False

            # Deactivate user
            update_query = f"UPDATE `{table_name}` SET `Closed` = 1 WHERE `Code` = %s"
            cursor.execute(update_query, (user_code,))
            connection.commit()
            return True
        except pymysql.MySQLError as e:
            print(f"  - Error al desactivar en '{db_name}': {e}")
            return False


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
