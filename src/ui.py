import os

# Ensure ANSI escape sequences are processed
os.system("")

class Colors:
    """ANSI color codes"""
    RESET = "\033[0m"
    BOLD = "\033[1m"
    UNDERLINE = "\033[4m"
    
    BLACK = "\033[30m"
    RED = "\033[31m"
    GREEN = "\033[32m"
    YELLOW = "\033[33m"
    BLUE = "\033[34m"
    MAGENTA = "\033[35m"
    CYAN = "\033[36m"
    WHITE = "\033[37m"
    
    HEADER = f"\033[95m{BOLD}"
    INFO = f"\033[94m{BOLD}"
    SUCCESS = f"\033[92m{BOLD}"
    WARNING = f"\033[93m{BOLD}"
    ERROR = f"\033[91m{BOLD}"

def print_header(text: str):
    """Prints a magenta header."""
    print(f"{Colors.HEADER}===== {text.upper()} ====={Colors.RESET}")

def print_info(text: str):
    """Prints blue informational text."""
    print(f"{Colors.INFO}{text}{Colors.RESET}")

def print_success(text: str):
    """Prints green success text."""
    print(f"{Colors.SUCCESS}{text}{Colors.RESET}")

def print_warning(text: str):
    """Prints yellow warning text."""
    print(f"{Colors.WARNING}{text}{Colors.RESET}")
    
def print_error(text: str):
    """Prints red error text."""
    print(f"{Colors.ERROR}ERROR: {text}{Colors.RESET}")

def clear_screen():
    """Clears the console screen."""
    os.system('cls' if os.name == 'nt' else 'clear')

def display_menu(title: str, options: dict) -> str:
    """
    Displays a generic menu and returns the key of the selected option.

    Args:
        title (str): The title of the menu.
        options (dict): A dictionary where keys are the option identifiers
                        and values are the display text.

    Returns:
        str: The key of the selected option.
    """
    while True:
        clear_screen()
        print_header(title)
        for key, value in options.items():
            print(f"  {Colors.YELLOW}{key}{Colors.RESET}) {value}")
        
        choice = input(f"\n{Colors.BOLD}Seleccione una opcin: {Colors.RESET} ").upper()
        
        if choice in options:
            return choice
        else:
            print_error("Opcin no vlida. Intente de nuevo.")
            input("\nPresione Enter para continuar...")

def display_main_menu():
    """Displays the main application menu."""
    menu_options = {
        "1": "Agregar Usuario",
        "2": "Desactivar Usuario",
        "S": "Salir"
    }
    return display_menu("Menú Principal", menu_options)
