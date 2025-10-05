Product schema:
name
description
type (dropdown selection) (Enum)
price
coupon code available (Boolean)
quantity
owner_id (who created the product)
created_at

user schema:
userId
username 
products_created
hashed password
add basic authentication based off bcrypt and jwt
auth manager: handles authentication, login, token creation through login(), logout(), is_authenticated()

user service: handle user registration and login and call methods in authmanager to login

product service: Responsibilities: Create, Read, Update, Delete operations
Methods: create_product(), update_product(), delete_product(), list_user_products()

create, update and delete operations would only work if the user is authenticated because we have to mention for each product that who created it through owner_id, also these methods must reflect for both user and product schema
Each layer should only talk to the one directly below or above it — e.g., Routes ⇄ Services ⇄ Models ⇄ Database.

Each layer should only talk to the one directly below or above it — e.g., Routes ⇄ Services ⇄ Models ⇄ Database.
Ownership validation before update/delete (e.g., product.owner_id == current_user.id)
in ui make  a space for viewing all products which all can do
then a my products section where the authenticated user can look at products they have created before and they can only update or delete the respective products from my products section
in all products section add filter for 1. according to product type which was an Enum 2. if it has coupon code available or not which was boolean

in all products section also add sorting according to price mentioned
also add search option to make text based search on product name
follow modularity and OOPS where it is relevant 
use node.js and react to build the project
