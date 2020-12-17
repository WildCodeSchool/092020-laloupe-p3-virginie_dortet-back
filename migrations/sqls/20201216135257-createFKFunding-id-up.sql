ALTER TABLE Book
ADD CONSTRAINT `fk_Book_Funding`
FOREIGN KEY (`Funding_id`)
REFERENCES `Funding`(`id`);
