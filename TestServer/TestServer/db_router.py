class ChatDatabaseRouter:
    """
    A router to control database operations for the chat app and user authentication.
    """

    def db_for_read(self, model, **hints):
        """
        Direct read operations for specific apps to the correct database.
        """
        if model._meta.app_label == 'chats':  # Replace 'chat' with your chat app's label
            return 'chat_db'
        return 'default'

    def db_for_write(self, model, **hints):
        """
        Direct write operations for specific apps to the correct database.
        """
        if model._meta.app_label == 'chats':  # Replace 'chat' with your chat app's label
            return 'chat_db'
        return 'default'

    def allow_relation(self, obj1, obj2, **hints):
        """
        Allow relations if both models are in the same database.
        """
        db_set = {'default', 'chat_db'}
        if obj1._state.db in db_set and obj2._state.db in db_set:
            return True
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """
        Direct migrations for specific apps to the correct database.
        """
        if app_label == 'chats':  # Replace 'chat' with your chat app's label
            return db == 'chat_db'
        return db == 'default'