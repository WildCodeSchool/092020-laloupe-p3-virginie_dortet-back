ALTER TABLE Image
ADD `Description` TEXT NOT NULL, `Device` varchar(80);
ALTER TABLE Book
DROP COLUMN  `Link`;