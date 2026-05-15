const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '..', 'assets');
const moods = ['happy', 'funny', 'vacation', 'angry', 'cute', 'magic'];

// Create mood directories if they don't exist
moods.forEach(mood => {
  const dir = path.join(assetsDir, mood);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const files = fs.readdirSync(assetsDir).filter(file => 
  ['.jpg', '.jpeg', '.png'].includes(path.extname(file).toLowerCase()) &&
  !moods.includes(file) &&
  file !== 'login_bg.png' // Keep login background in root
);

const galleryData = [];

files.forEach((file, index) => {
  // Distribute files across moods
  // 0-7: happy, 8-15: funny, 16-23: vacation, 24-31: cute, 32-39: magic, 40+: angry
  let mood = '';
  if (index < 8) mood = 'happy';
  else if (index < 16) mood = 'funny';
  else if (index < 24) mood = 'vacation';
  else if (index < 32) mood = 'cute';
  else if (index < 40) mood = 'magic';
  else mood = 'angry';

  const oldPath = path.join(assetsDir, file);
  const newFileName = `photo_${index + 1}${path.extname(file)}`;
  const newPath = path.join(assetsDir, mood, newFileName);

  fs.renameSync(oldPath, newPath);

  galleryData.push({
    id: index + 1,
    mood: mood,
    // We'll use require context or dynamic imports in the component
    fileName: newFileName,
    caption: getCaption(mood, index)
  });
});

function getCaption(mood, index) {
  const captions = {
    happy: ["Pure happiness!", "Your smile is my favorite.", "Living our best life.", "So much love!", "Happy times together.", "Sparkling joy.", "You make me beam.", "Our happy place."],
    funny: ["We're so goofy!", "Laughing with you is the best.", "Stop being so funny!", "Memories of laughter.", "You're a clown!", "Never a dull moment.", "Haha, look at us!", "Funny faces."],
    vacation: ["Travel buddies for life.", "Lost in paradise.", "Exploring the world together.", "Sun, sand, and us.", "Best trip ever!", "Adventure awaits.", "Making memories worldwide.", "Vacation vibes."],
    cute: ["Simply adorable.", "Cutest couple!", "My heart melts.", "You're so precious.", "Cuteness overload.", "Sweet moments.", "Always cute.", "My little heart."],
    magic: ["Magic in the air.", "A dream come true.", "Enchanted moments.", "Sparkling love.", "Our fairytale.", "Stardust in our eyes.", "Magical memories.", "True magic."],
    angry: ["Even when you're mad...", "Grumpy but still mine.", "Cute little anger.", "Upset but together.", "Madly in love.", "Don't be angry!", "Fire and passion.", "Angry bird!"]
  };
  return captions[mood][index % 8];
}

// Generate the data file
const dataContent = `export const galleryPhotos = ${JSON.stringify(galleryData, null, 2)};`;
fs.writeFileSync(path.join(__dirname, '..', 'data', 'galleryData.js'), dataContent);

console.log(`Organized ${files.length} images.`);
