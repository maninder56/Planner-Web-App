SHOW DATABASES;

USE plannerwebapp;

SHOW TABLES;

# Table column Info

SHOW COLUMNS
FROM boardlists;

SHOW COLUMNS
FROM  boardmembers;

SHOW COLUMNS
FROM boards;

SHOW COLUMNS
FROM boardstar;

SHOW COLUMNS
FROM cards;

SHOW COLUMNS
FROM colours;

SHOW COLUMNS
FROM refreshtokens;

SHOW COLUMNS
FROM users;

SHOW COLUMNS
FROM passwordresettokens;

SHOW COLUMNS
FROM invitations;


# Table data
SELECT * FROM boardlists;

SELECT * FROM boardmembers;

SELECT * FROM boards;

SELECT * FROM boardstar;

SELECT * FROM cards;

SELECT * FROM colours;

SELECT * FROM refreshtokens;

SELECT * FROM users;

SELECT * FROM passwordresettokens;

SELECT * FROM invitations;


SELECT
    U.Email,
    RT.TokenHash,
    Rt.ExpiresAt
FROM users U
LEFT JOIN refreshtokens RT
    ON U.UserId = RT.UserId;


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
    U.UserId,
    U.Name AS UserName,
    B.BoardId,
    B.Name AS BoardName
FROM boardmembers BM
LEFT JOIN users U
    ON BM.UserId = U.UserId
LEFT JOIN boards B
    ON BM.BoardId = B.BoardId;


SELECT *
FROM boards B
JOIN boardlists BL
    ON B.BoardId = BL.BoardId;



SELECT *
FROM boardlists
WHERE BoardId = 38;

SELECT *
FROM boardmembers BM
JOIN boards B
    ON BM.BoardId = B.BoardId
WHERE BM.UserId = 1;


SELECT
    B.BoardId AS BoardID,
    B.Name AS BoardName,
    BL.BoardListId AS ListID,
    BL.Name AS ListName,
    BL.ListPosition
FROM boardlists BL
JOIN boards B
    ON BL.BoardId = B.BoardId
WHERE B.BoardId = 32;




