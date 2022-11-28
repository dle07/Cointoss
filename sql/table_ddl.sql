CREATE TABLE users
(
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(75) NOT NULL UNIQUE, 
    pass_word varchar (130) NOT NULL 
);




CREATE TABLE user_stock_assets(
    user_stock_asset_id SERIAL PRIMARY KEY,
    user_id int NOT NULL,
    ticker VARCHAR(15) NOT NULL,

    CONSTRAINT user_id_fk
        FOREIGN KEY(user_id)
        REFERENCES users(user_id)
);