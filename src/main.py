import pymysql
from src import config, database, user_input, ui

def main():
    """Main function to run the user insertion script."""
    connection = None
    try:
        # Get company choice from user first
        company_choice = user_input.get_company_choice()

        # Establish DB connection
        ui.print_info("Estableciendo conexion con el servidor de base de datos...")
        connection = database.get_connection(config.DB_CONFIG)
        ui.print_success("Conexion establecida exitosamente.")

        # Get target databases based on company choice
        ui.print_info("Obteniendo listado de bases de datos de destino...")
        target_dbs = database.get_target_databases(connection, company_choice)

        if not target_dbs:
            ui.print_warning("Advertencia: No se encontraron bases de datos que cumplan los criterios. Finalizando script.")
            return # Exit gracefully

        print(f"{ui.Colors.BOLD}Bases de datos encontradas ({len(target_dbs)}):{ui.Colors.RESET} {', '.join(target_dbs)}")
        input("\nPresione Enter para comenzar a agregar usuarios...")

        # Main loop for adding users
        while True:
            ui.clear_screen()
            user_data = user_input.get_user_data()

            if user_data is None:
                break # User cancelled input

            ui.print_info(f"\n--- Iniciando proceso de insercion para '{user_data['name']}' ---")
            
            success_count = 0
            error_count = 0
            
            for db_name in target_dbs:
                try:
                    database.insert_user(connection, db_name, config.USER_TABLE_NAME, user_data)
                    print(f"  -> Usuario '{user_data['name']}' insertado en '{ui.Colors.CYAN}{db_name}{ui.Colors.RESET}'")
                    success_count += 1
                except pymysql.MySQLError as e:
                    ui.print_error(f"al insertar en '{db_name}': {e}")
                    error_count += 1
            
            connection.commit()
            
            print()
            ui.print_header(f"Proceso finalizado para el usuario '{user_data['name']}'")
            ui.print_success(f"Resumen: {success_count} inserciones exitosas.")
            if error_count > 0:
                ui.print_warning(f"         {error_count} errores.")

            another = input("\n\nDesea agregar otro usuario? (s/n): ").lower()
            if another != 's':
                break

    except pymysql.MySQLError as e:
        ui.print_error(f"Crtico: No se pudo conectar a la base de datos o ejecutar una operacion inicial. Error: {e}")
    
    finally:
        # This check is needed in case the connection failed in the first place
        if 'connection' in locals() and connection and connection.open:
            connection.close()
            ui.print_info("\nConexion a la base de datos cerrada.")
        
        print("\nEjecucion del script finalizada.")

if __name__ == "__main__":
    main()
