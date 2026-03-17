import unittest
from unittest.mock import MagicMock, patch
from src import database

class TestDatabase(unittest.TestCase):

    @patch('pymysql.connect')
    def test_get_connection(self, mock_connect):
        """Tests that get_connection calls pymysql.connect with the correct config."""
        config = {"host": "localhost", "user": "test", "password": "password"}
        database.get_connection(config)
        mock_connect.assert_called_once_with(**config)

    def test_get_target_databases(self):
        """Tests that get_target_databases correctly filters databases."""
        mock_cursor = MagicMock()
        mock_cursor.fetchall.return_value = [
            ('cantera_test',),
            ('obra_test',),
            ('implenia_prd',),
            ('other_db',)
        ]
        
        mock_connection = MagicMock()
        mock_connection.cursor.return_value.__enter__.return_value = mock_cursor
        
        explicit_dbs = ['implenia_prd', 'maquinaria_prd', 'tocsa_prd']
        keywords = ['cantera', 'obra']
        
        result = database.get_target_databases(mock_connection, explicit_dbs, keywords)
        
        self.assertIn('cantera_test', result)
        self.assertIn('obra_test', result)
        self.assertIn('implenia_prd', result)
        self.assertNotIn('other_db', result)

    def test_insert_user(self):
        """Tests that insert_user executes the correct SQL query."""
        mock_cursor = MagicMock()
        mock_connection = MagicMock()
        mock_connection.cursor.return_value.__enter__.return_value = mock_cursor

        db_name = "test_db"
        table_name = "User"
        user_data = {
            "code": "test_code",
            "name": "test_name",
            "access_group": "test_group",
            "email": "test_email@example.com"
        }

        database.insert_user(mock_connection, db_name, table_name, user_data)

        expected_query = f"""
            INSERT INTO `{db_name}`.`{table_name}` 
            (Code, Name, AccessGroup, Email) 
            VALUES (%s, %s, %s, %s)
        """
        
        # We need to check the first argument of the call to execute
        # which is the query itself.
        # The second argument is the tuple of values.
        call_args = mock_cursor.execute.call_args
        self.assertEqual(len(call_args[0]), 2) # query and values
        
        # Normalize whitespace for comparison
        self.assertEqual(
            " ".join(expected_query.split()),
            " ".join(call_args[0][0].split())
        )
        self.assertEqual(
            tuple(user_data.values()),
            call_args[0][1]
        )


if __name__ == '__main__':
    unittest.main()
