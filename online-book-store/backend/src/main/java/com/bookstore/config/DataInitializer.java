package com.bookstore.config;

import com.bookstore.model.Book;
import com.bookstore.model.User;
import com.bookstore.repository.BookRepository;
import com.bookstore.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) {
        seedUsers();
        seedBooks();
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            User demoUser = new User(
                    "Sarah Jenkins",
                    "demo@bookstore.com",
                    "demouser",
                    "demo123",
                    "+1 (555) 234-5678",
                    "742 Evergreen Terrace, Springfield, OR"
            );
            userRepository.save(demoUser);
            System.out.println(">> Seeded default demo user: demo@bookstore.com / demo123");
        }
    }

    private void seedBooks() {
        if (bookRepository.count() == 0) {
            List<Book> books = Arrays.asList(
                    new Book(
                            "Clean Code: A Handbook of Agile Software Craftsmanship",
                            "Robert C. Martin",
                            "Computer Science",
                            42.99,
                            54.99,
                            4.8,
                            1420,
                            "https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=600&q=80",
                            "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code. This book is a must-read for any developer looking to craft clean, maintainable, and elegant software.",
                            "978-0132350884",
                            true,
                            25,
                            true,
                            "Prentice Hall",
                            464
                    ),
                    new Book(
                            "Designing Data-Intensive Applications",
                            "Martin Kleppmann",
                            "Computer Science",
                            47.50,
                            59.99,
                            4.9,
                            2105,
                            "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
                            "Data is at the center of many challenges in system design today. Difficult issues need to be figured out, such as scalability, consistency, reliability, efficiency, and maintainability. In this practical book, bestselling author Martin Kleppmann helps you navigate this diverse landscape.",
                            "978-1449373320",
                            true,
                            18,
                            true,
                            "O'Reilly Media",
                            616
                    ),
                    new Book(
                            "Atomic Habits: Tiny Changes, Remarkable Results",
                            "James Clear",
                            "Self-Help",
                            21.99,
                            27.00,
                            4.9,
                            3850,
                            "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
                            "No matter your goals, Atomic Habits offers a proven framework for improving every day. James Clear, one of the world's leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master tiny behaviors.",
                            "978-0735211292",
                            true,
                            40,
                            true,
                            "Avery",
                            320
                    ),
                    new Book(
                            "The Pragmatic Programmer: Your Journey To Mastery",
                            "David Thomas, Andrew Hunt",
                            "Computer Science",
                            39.95,
                            49.95,
                            4.8,
                            1120,
                            "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80",
                            "The Pragmatic Programmer cuts through the increasing specialization and technicalities of modern software development to examine the core process: taking a requirement and producing working, maintainable code that delights its users.",
                            "978-0135957059",
                            true,
                            15,
                            true,
                            "Addison-Wesley",
                            352
                    ),
                    new Book(
                            "Dune",
                            "Frank Herbert",
                            "Sci-Fi & Fantasy",
                            18.50,
                            24.00,
                            4.7,
                            2740,
                            "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=600&q=80",
                            "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the 'spice' melange, a drug capable of extending life and enhancing consciousness.",
                            "978-0441172719",
                            true,
                            30,
                            true,
                            "Ace Books",
                            896
                    ),
                    new Book(
                            "Sapiens: A Brief History of Humankind",
                            "Yuval Noah Harari",
                            "Non-Fiction & History",
                            24.00,
                            30.00,
                            4.7,
                            4310,
                            "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
                            "From a renowned historian comes a groundbreaking narrative of humanity’s creation and evolution—a #1 international bestseller that explores how biology and history have defined us and enhanced our understanding of what it means to be human.",
                            "978-0062316097",
                            true,
                            22,
                            true,
                            "Harper",
                            464
                    ),
                    new Book(
                            "The Psychology of Money",
                            "Morgan Housel",
                            "Business & Finance",
                            19.99,
                            25.00,
                            4.8,
                            2890,
                            "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
                            "Doing well with money isn’t necessarily about what you know. It’s about how you behave. And behavior is hard to teach, even to really smart people. Award-winning author Morgan Housel shares 19 short stories exploring the strange ways people think about money.",
                            "978-0857197689",
                            true,
                            35,
                            true,
                            "Harriman House",
                            256
                    ),
                    new Book(
                            "Project Hail Mary",
                            "Andy Weir",
                            "Sci-Fi & Fantasy",
                            22.50,
                            28.99,
                            4.9,
                            1980,
                            "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
                            "Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself are doomed. Except right now, he doesn't know that. He can't even remember his own name, let alone the nature of his assignment or how to complete it.",
                            "978-0593135204",
                            true,
                            20,
                            false,
                            "Ballantine Books",
                            496
                    ),
                    new Book(
                            "Zero to One: Notes on Startups",
                            "Peter Thiel, Blake Masters",
                            "Business & Finance",
                            23.00,
                            29.00,
                            4.6,
                            1670,
                            "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
                            "The great secret of our time is that there are still uncharted frontiers to explore and new inventions to create. In Zero to One, legendary entrepreneur and investor Peter Thiel shows how we can find singular ways to create those new things.",
                            "978-0804139298",
                            true,
                            16,
                            false,
                            "Crown Business",
                            224
                    ),
                    new Book(
                            "Deep Learning with Python",
                            "François Chollet",
                            "Computer Science",
                            49.99,
                            59.99,
                            4.8,
                            890,
                            "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
                            "Written by Keras creator François Chollet, this book introduces the field of deep learning using the Python language and the powerful Keras library. You'll explore challenging concepts and practice with applications in computer vision, natural language processing, and generative models.",
                            "978-1617296864",
                            true,
                            12,
                            false,
                            "Manning Publications",
                            504
                    ),
                    new Book(
                            "Thinking, Fast and Slow",
                            "Daniel Kahneman",
                            "Psychology",
                            21.50,
                            28.00,
                            4.6,
                            3100,
                            "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80",
                            "In the international bestseller, Thinking, Fast and Slow, Daniel Kahneman, the renowned psychologist and winner of the Nobel Prize in Economics, takes us on a groundbreaking tour of the mind and explains the two systems that drive the way we think.",
                            "978-0374533557",
                            true,
                            28,
                            false,
                            "Farrar, Straus and Giroux",
                            512
                    ),
                    new Book(
                            "Klara and the Sun",
                            "Kazuo Ishiguro",
                            "Literature & Fiction",
                            17.99,
                            22.99,
                            4.5,
                            1540,
                            "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?auto=format&fit=crop&w=600&q=80",
                            "From the Nobel Prize in Literature laureate Kazuo Ishiguro, a magnificent new novel that looks at our rapidly-changing modern world through the eyes of an unforgettable narrator, exploring the fundamental question: what does it mean to love?",
                            "978-0593318171",
                            true,
                            19,
                            false,
                            "Knopf",
                            320
                    )
            );

            bookRepository.saveAll(books);
            System.out.println(">> Successfully seeded " + books.size() + " books into MongoDB bookstore_db.books");
        }
    }
}
