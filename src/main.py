import pymysql
from src import config, database, user_input, ui

def add_user_process(connection):
    """Handles the entire process of adding a new user."""
    company_choice = user_input.get_company_choice()
    target_dbs = database.get_target_databases(connection, company_choice)

    if not target_dbs:
        ui.print_warning("Advertencia: No se encontraron bases de datos que cumplan los criterios.")
        return

    print(f"{ui.Colors.BOLD}Bases de datos encontradas ({len(target_dbs)}):{ui.Colors.RESET} {', '.join(target_dbs)}")
    input("\nPresione Enter para comenzar a agregar usuarios...")

    while True:
        ui.clear_screen()
        user_data = user_input.get_user_data()

        if user_data is None:
            break

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

def deactivate_user_process(connection):
    """Handles the process of deactivating a user."""
    user_to_deactivate = user_input.get_user_to_deactivate()
    if not user_to_deactivate:
        return

    db_choice = input("Ingrese el nombre de la base de datos específica o presione Enter para usar todas: ").strip()

    if db_choice:
        target_dbs = [db_choice]
    else:
        ui.print_info("Obteniendo listado de todas las bases de datos...")
        target_dbs = database.get_all_databases(connection)

    if not target_dbs:
        ui.print_warning("No se encontraron bases de datos para procesar.")
        return

    ui.print_info(f"Se procesarán las siguientes bases de datos: {', '.join(target_dbs)}")
    input("\nPresione Enter para iniciar la desactivación...")

    deactivated_count = 0
    for db_name in target_dbs:
        if database.deactivate_user(connection, db_name, config.USER_TABLE_NAME, user_to_deactivate):
            print(f"  -> Usuario '{user_to_deactivate}' desactivado en '{ui.Colors.CYAN}{db_name}{ui.Colors.RESET}'")
            deactivated_count += 1
    
    ui.print_header(f"Proceso de desactivación finalizado para '{user_to_deactivate}'")
    if deactivated_count > 0:
        ui.print_success(f"Resumen: {deactivated_count} bases de datos afectadas.")
    else:
        ui.print_warning("El usuario no se desactivó en ninguna base de datos.")


def main():
    """Main function to run the user management script."""
    connection = None
    try:
        ui.print_info("Estableciendo conexión con el servidor de base de datos...")
        connection = database.get_connection(config.DB_CONFIG)
        ui.print_success("Conexión establecida exitosamente.")

        while True:
            choice = ui.display_main_menu()

            if choice == "1":
                add_user_process(connection)
            elif choice == "2":
                deactivate_user_process(connection)
            elif choice == "S":
                break
            
            input("\nPresione Enter para volver al menú principal...")

    except pymysql.MySQLError as e:
        ui.print_error(f"Crítico: No se pudo conectar a la base de datos. Error: {e}")
    
    finally:
        if connection and connection.open:
            connection.close()
            ui.print_info("\nConexión a la base de datos cerrada.")
        
        print("\nEjecución del script finalizada.")

if __name__ == "__main__":
    main()
