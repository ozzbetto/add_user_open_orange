# User Management Script

This script allows a user to add new users to multiple MySQL databases simultaneously.

## Features

-   Connects to a MySQL server.
-   Identifies target databases based on a naming convention (containing 'cantera' or 'obra') and a predefined list.
-   Prompts for user details (code, name, access group, email).
-   Inserts the new user into the `User` table of each target database.
-   Allows adding multiple users in a single session.

## Prerequisites

-   Python 3.6+
-   `pymysql`

## Installation

1.  Clone this repository:
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  Install the required dependencies:
    ```bash
    pip install -r requirements.txt
    ```

## Configuration

The database connection settings are located in `src/config.py`. Update the `DB_CONFIG` dictionary with your database credentials:

```python
DB_CONFIG = {
    "host": "your-database-host",
    "user": "your-username",
    "password": "your-password",
    "charset": "utf8mb4"
}
```

## Usage

Run the main script from the root directory of the project:

```bash
python -m src.main
```

The script will guide you through the process of adding a new user.
