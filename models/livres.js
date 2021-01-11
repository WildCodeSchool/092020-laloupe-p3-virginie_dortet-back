module.exports.sanitizeBook = result => {
  const books = [];
  result.forEach((item) => {
    const { BookId, Description, Price, Publication, Title, Link, ...image } = item;
    const bookExist = books.find((book) => book.BookId === item.BookId);
    if (!bookExist) {
      books.push({
        BookId,
        Description,
        Price,
        Publication,
        Title,
        Link,
        Images: [image],
      });
    } else {
      const bookIndex = books.findIndex((book) => book.BookId === item.BookId);
      books[bookIndex].Images.push(image);
    }
  });
  return books;
};
