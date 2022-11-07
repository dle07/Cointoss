


# from backend.src.utils.ConfigUtils import ConfigUtils

# class DBManager():
#     engine = create_engine( url="postgresql://{0}:{1}@{2}:{3}/{4}".format(
#         ConfigUtils.db_username,
#         ConfigUtils.db_password,
#         ConfigUtils.db_host,
#         ConfigUtils.db_port,
#         ConfigUtils.db_name, 
#     ),
#     echo = True,future = True)  #Echo = True :: Logs all sql statements to python logger
#     print("RAAAAAAAAAAAANNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN")
#     x = 10
#     @staticmethod
#     def hello():
#         print(DBManager.x)




# if __name__ == '__main__':
  
#     try:
#         # GET THE CONNECTION OBJECT (ENGINE) FOR THE DATABASE
#         engine = get_connection()
#         print(
#             f"Connection to the {ConfigUtils.db_host} for user {ConfigUtils.db_username} created successfully.")
#     except Exception as ex:
#         print("Connection could not be made due to the following error: \n", ex)