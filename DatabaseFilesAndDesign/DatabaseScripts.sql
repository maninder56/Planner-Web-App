SHOW DATABASES;

USE plannerwebapp;

SHOW TABLES;

SHOW COLUMNS
from refreshtokens;


SELECT *
FROM users;

SELECT
    U.Email,
    RT.TokenHash,
    Rt.ExpiresAt
FROM users U
LEFT JOIN refreshtokens RT
    ON U.UserId = RT.UserId;
