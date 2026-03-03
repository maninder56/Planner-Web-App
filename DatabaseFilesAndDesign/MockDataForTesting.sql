
START TRANSACTION;

INSERT INTO `colours` (`Name`, `HexValue`) VALUES
('soft-pink', '#f8bdbd'),
('light-mint-green', '#c8e7b1'),
('aqua', '#aee2dc'),
('lavender-blue', '#bbbef5'),
('light-purple', '#e0b8f1'),
('bright-pink', '#ff91e0');


-- Create new board
INSERT INTO `boards` (`Name`, `BackgroundColour`, `CreatedAt`)
VALUES ('Development Sprint Board', 'soft-pink', NOW());

-- Get newly created BoardId
SET @BoardId = LAST_INSERT_ID();


INSERT INTO `boardmembers` (`BoardId`, `UserId`, `Role`, `JoinedAt`)
VALUES (@BoardId, 1, 'Owner', NOW());


-- Star the board
INSERT INTO `boardstar` (`UserId`, `BoardId`, `CreatedAt`)
VALUES (1, @BoardId, NOW());


-- To Do
INSERT INTO `boardlists` (`Name`, `ListPosition`, `BoardId`) VALUES
('To Do', 0, @BoardId);

SET @TodoListId = LAST_INSERT_ID();

-- In Progress
INSERT INTO `boardlists` (`Name`, `ListPosition`, `BoardId`) VALUES
('In Progress', 1, @BoardId);

SET @InProgressListId = LAST_INSERT_ID();

-- Done
INSERT INTO `boardlists` (`Name`, `ListPosition`, `BoardId`) VALUES
('Done', 2, @BoardId);

SET @DoneListId = LAST_INSERT_ID();


INSERT INTO `cards` (`Title`, `Description`, `CardPosition`, `BoardListId`) VALUES
('Setup project structure', 'Initialize backend and frontend', 0, @TodoListId),
('Design database schema', 'Plan tables and foreign keys', 1, @TodoListId),
('Implement authentication', 'JWT + refresh token flow', 2, @TodoListId);

INSERT INTO `cards` (`Title`, `Description`, `CardPosition`, `BoardListId`) VALUES
('Implement drag & drop', 'DnD-kit logic for lists and cards', 0, @InProgressListId),
('Hydrate Zustand store', 'Load board into state properly', 1, @InProgressListId);

INSERT INTO `cards` (`Title`, `Description`, `CardPosition`, `BoardListId`) VALUES
('Create EF models', 'Boards, Lists, Cards configured', 0, @DoneListId),
('Add colours table', 'Boards now reference colours FK', 1, @DoneListId);

UPDATE `users`
SET `LastBoardId` = @BoardId
WHERE `UserId` = 1;



START TRANSACTION;


UPDATE `cards`
SET
    `DueDate` = '2026-03-10',
    `Priority` = 'High',
    `IsDone` = 0
WHERE `CardId` = 1;

UPDATE `cards`
SET
    `DueDate` = '2026-03-12',
    `Priority` = 'Medium',
    `IsDone` = 0
WHERE `CardId` = 2;

UPDATE `cards`
SET
    `DueDate` = '2026-03-15',
    `Priority` = 'High',
    `IsDone` = 0
WHERE `CardId` = 3;


UPDATE `cards`
SET
    `DueDate` = '2026-03-08',
    `Priority` = 'High',
    `IsDone` = 0
WHERE `CardId` = 4;

UPDATE `cards`
SET
    `DueDate` = '2026-03-09',
    `Priority` = 'Medium',
    `IsDone` = 0
WHERE `CardId` = 5;


UPDATE `cards`
SET
    `DueDate` = '2026-03-02',
    `Priority` = 'Medium',
    `IsDone` = 1
WHERE `CardId` = 6;

UPDATE `cards`
SET
    `DueDate` = '2026-03-02',
    `Priority` = 'Low',
    `IsDone` = 1
WHERE `CardId` = 7;



COMMIT ;