CREATE TABLE `User_Admin` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Password` nvarchar(255) NOT NULL,
  `Email` nvarchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1;