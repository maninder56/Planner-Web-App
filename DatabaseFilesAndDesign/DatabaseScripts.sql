SHOW DATABASES;

USE plannerwebapp;

SHOW TABLES;

SHOW COLUMNS
FROM refreshtokens;

SHOW COLUMNS
FROM  boardmembers;

SHOW COLUMNS
FROM colours;

SHOW COLUMNS
FROM boards;

SELECT *
FROM users;

SELECT *
FROM boards;

SELECT *
FROM boardmembers;

SELECT *
FROM boardstar;


SELECT
    U.Email,
    RT.TokenHash,
    Rt.ExpiresAt
FROM users U
LEFT JOIN refreshtokens RT
    ON U.UserId = RT.UserId;


SELECT  *
FROM refreshtokens RT;


SELECT *
FROM users U
JOIN boardmembers BM
    ON U.UserId = BM.UserId
JOIN boards B
    ON BM.BoardId = b.BoardId
JOIN boardlists BL
    ON B.BoardId = BL.BoardId
JOIN cards C
    ON C.BoardListId = BL.BoardListId;






