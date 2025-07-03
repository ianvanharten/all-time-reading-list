import fs from 'fs';
import axios from 'axios';

// Rate limiting to be respectful to the API
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function searchBookCover(title, author) {
  try {
    // Clean up the search query
    const cleanTitle = title.replace(/[^\w\s]/g, '').trim();
    const cleanAuthor = author.replace(/[^\w\s]/g, '').trim();
    const query = `${cleanTitle} ${cleanAuthor}`.substring(0, 100); // Limit query length

    const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
      params: {
        q: query,
        maxResults: 1
      }
    });

    if (response.data.items && response.data.items.length > 0) {
      const book = response.data.items[0];
      const imageLinks = book.volumeInfo.imageLinks;

      // Try to get the highest quality image available
      if (imageLinks) {
        return imageLinks.extraLarge ||
               imageLinks.large ||
               imageLinks.medium ||
               imageLinks.small ||
               imageLinks.thumbnail ||
               imageLinks.smallThumbnail;
      }
    }

    return null;
  } catch (error) {
    console.error(`Error searching for "${title}" by ${author}:`, error.message);
    return null;
  }
}

async function updateBookCovers() {
  try {
    console.log('📚 Reading books.json...');
    const booksData = fs.readFileSync('public/books.json', 'utf8');
    const books = JSON.parse(booksData);

    console.log(`📖 Found ${books.length} books to process`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < books.length; i++) {
      const book = books[i];

      // Skip if already has a cover URL
      if (book.coverUrl) {
        console.log(`⏭️  Skipping "${book.title}" (already has cover URL)`);
        continue;
      }

      console.log(`🔍 Processing ${i + 1}/${books.length}: "${book.title}" by ${book.author}`);

      const coverUrl = await searchBookCover(book.title, book.author);

      if (coverUrl) {
        book.coverUrl = coverUrl;
        successCount++;
        console.log(`✅ Found cover for "${book.title}"`);
      } else {
        book.coverUrl = null;
        errorCount++;
        console.log(`❌ No cover found for "${book.title}"`);
      }

      // Rate limiting - wait 100ms between requests
      await delay(100);

      // Save progress every 50 books
      if ((i + 1) % 50 === 0) {
        console.log(`💾 Saving progress... (${i + 1}/${books.length})`);
        fs.writeFileSync('public/books.json', JSON.stringify(books, null, 2));
      }
    }

    // Final save
    console.log('💾 Saving final results...');
    fs.writeFileSync('public/books.json', JSON.stringify(books, null, 2));

    console.log('\n🎉 Done!');
    console.log(`✅ Successfully found covers: ${successCount}`);
    console.log(`❌ No covers found: ${errorCount}`);
    console.log(`📊 Success rate: ${((successCount / books.length) * 100).toFixed(1)}%`);

  } catch (error) {
    console.error('❌ Error updating book covers:', error);
  }
}

// Run the script
updateBookCovers();