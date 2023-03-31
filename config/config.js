import dotenv from 'dotenv';
dotenv.config({ path: 'config/.env' });

export default {
    port : process.env.DB_PORT,
    db_user : process.env.DB_USER,
    db_pwd : process.env.DB_PWD,
    db_name : process.env.DB_NAME,
    openai_key : process.env.OPENAI_KEY,
    secret_jwt : process.env.SECRET_JWT,
    secret_igdb : process.env.IGDB_KEY,
    client_igdb : process.env.IGBD_CLIENT
}