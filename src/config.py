import re

# ==============================================================================
# CONFIGURACIN
# ==============================================================================

# Configuracin de la conexin a la base de datos
DB_CONFIG = {
    "host": "10.0.100.84",
    "user": "tocsa",
    "password": "T0cs4$2015",
    "charset": "utf8mb4"
}

# Nombre de la tabla de usuarios
USER_TABLE_NAME = "User"

# --- Definicin de Bases de Datos de IMPLENIA ---
# Se usan para separar las bases de datos de TOCSA (que son todas las dems)
IMPLENIA_DBS = {
    "explicit": ['implenia_prd'],
    "pattern": re.compile(r'obra_12\d{2}_prd')
}
