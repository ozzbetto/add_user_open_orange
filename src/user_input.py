from typing import Dict, Optional
from src import ui

def get_company_choice() -> str:
    """Displays the company selection menu and returns the choice."""
    menu_options = {
        "TOCSA"     : "Agregar usuarios solo a bases de datos de TOCSA",
        "IMPLENIA"  : "Agregar usuarios solo a bases de datos de IMPLENIA",
        "TODAS"     : "Agregar usuarios a TODAS las bases de datos (TOCSA e IMPLENIA)"
    }
    return ui.display_menu("Seleccione una opcion:", menu_options)

def get_user_data() -> Optional[Dict[str, str]]:
    """Prompts the user for their data and returns it as a dictionary."""
    ui.print_header("Agregar Nuevo Usuario")
    print("Por favor, ingrese los datos del usuario. Los campos con * son obligatorios.\n")

    try:
        code = ""
        while not code:
            code = input(f"* {ui.Colors.BOLD}Cdigo (Code):{ui.Colors.RESET} ")
            if not code:
                ui.print_error("El codigo es un dato obligatorio. Intente de nuevo.")

        name = ""
        while not name:
            name = input(f"* {ui.Colors.BOLD}Nombre (Name):{ui.Colors.RESET} ")
            if not name:
                ui.print_error("El nombre es un dato obligatorio. Intente de nuevo.")

        access_group = ""
        while not access_group:
            access_group = input(f"* {ui.Colors.BOLD}Grupo de Acceso (AccessGroup):{ui.Colors.RESET} ")
            if not access_group:
                ui.print_error("El grupo de acceso es un dato obligatorio. Intente de nuevo.")

        email = input(f"  {ui.Colors.BOLD}Email (opcional):{ui.Colors.RESET} ")

        return {
            "code": code,
            "name": name,
            "access_group": access_group,
            "email": email
        }
    except EOFError:
        print()  # Add a newline after the prompt before exiting
        ui.print_warning("\nEntrada cancelada por el usuario.")
        return None
