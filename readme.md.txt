Please Check Google Sheet for parameters:

user/creation api will create user.

login api will validate email and password and remember it will return one token
this token is used to update and view user api.

forgot password api will updated password and user will recieve email on it mail with updated password.please avoid <>.

user/view and user/edit api are needs authentication token in its header otherwise it will give authentication error.