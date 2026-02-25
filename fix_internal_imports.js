const fs = require('fs');
const path = require('path');

const targetDirs = [
  'src/components/atoms/avatar',
  'src/components/molecules/commentItem',
  'src/components/molecules/dashboardHeader',
  'src/components/molecules/emptyPostsState',
  'src/components/molecules/errorModal',
  'src/components/molecules/storyItem',
  'src/components/organisms/commentsModal',
  'src/components/organisms/errorModalProvider',
  'src/components/organisms/gridPostCard',
  'src/components/organisms/postCard',
  'src/components/organisms/statusViewerModal',
  'src/components/organisms/storiesRail'
];

for (const dir of targetDirs) {
  const fullDirPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullDirPath)) continue;
  
  const files = fs.readdirSync(fullDirPath);
  for (const file of files) {
    if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const filePath = path.join(fullDirPath, file);
      let content = fs.readFileSync(filePath, 'utf8');
      
      // We moved the file one directory deeper. So any relative import that goes OUT of the current directory (starts with ../)
      // needs an extra ../ prepended.
      // Example: `import Theme from '../../theme'` -> `import Theme from '../../../theme'`
      let newContent = content.replace(/(from\s+['"]|import\s+['"])\.\.\//g, '$1../../');
      
      if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Fixed relative imports in ${filePath}`);
      }
    }
  }
}
// Specifically check App.tsx as well as it had 1 error
const appFilePath = path.join(__dirname, 'App.tsx');
if (fs.existsSync(appFilePath)) {
    let content = fs.readFileSync(appFilePath, 'utf8');
    content = content.replace(/organisms\/ErrorModalProvider(['"])/, 'organisms/errorModalProvider/ErrorModalProvider$1');
    fs.writeFileSync(appFilePath, content, 'utf8');
    console.log(`Fixed App.tsx imports`);
}


