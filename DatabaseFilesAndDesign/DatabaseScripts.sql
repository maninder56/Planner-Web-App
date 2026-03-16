SHOW DATABASES;

USE plannerwebapp;

SHOW TABLES;

SHOW COLUMNS
FROM users;


SHOW COLUMNS
FROM refreshtokens;

SHOW COLUMNS
FROM  boardmembers;

SHOW COLUMNS
FROM colours;

SHOW COLUMNS
FROM boards;

SHOW COLUMNS
FROM cards;

SELECT *
FROM users;

SELECT *
FROM boards;

SELECT *
FROM boardmembers;

SELECT *
FROM boardstar;

SELECT *
FROM cards;

SELECT *
FROM colours;

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



SELECT
    BM.Role,
    U.Name AS UserName,
    B.Name AS BoardName
FROM boardmembers BM
LEFT JOIN users U
    ON BM.UserId = U.UserId
LEFT JOIN boards B
    ON BM.BoardId = B.BoardId;


