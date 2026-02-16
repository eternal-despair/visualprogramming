type Genre = "fiction" | "non-fiction"
interface Book {
    title: string;
    author: string;
    year?: number;
    genre: Genre;
}

function createBook(book: Book): Book{
    return book;
}

const Book1 = createBook({
    title: "AURA LADINA",
    author: "Apra Ivanovich",
    year: 2006,
    genre: "fiction"
});

const Book2 = createBook({
    title: "RAVIL",
    author: "Naksapfp Iaoida",
    genre: "fiction"
});
