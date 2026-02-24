const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replacements = [
  // Atoms
  { regex: /(['"])(.*)\/atoms\/Avatar(['"])/g, replace: '$1$2/atoms/avatar/Avatar$3' },
  // Molecules
  { regex: /(['"])(.*)\/molecules\/CommentItem(['"])/g, replace: '$1$2/molecules/commentItem/CommentItem$3' },
  { regex: /(['"])(.*)\/molecules\/DashboardHeader(['"])/g, replace: '$1$2/molecules/dashboardHeader/DashboardHeader$3' },
  { regex: /(['"])(.*)\/molecules\/EmptyPostsState(['"])/g, replace: '$1$2/molecules/emptyPostsState/EmptyPostsState$3' },
  { regex: /(['"])(.*)\/molecules\/ErrorModal(['"])/g, replace: '$1$2/molecules/errorModal/ErrorModal$3' },
  { regex: /(['"])(.*)\/molecules\/StoryItem(['"])/g, replace: '$1$2/molecules/storyItem/StoryItem$3' },
  // Organisms
  { regex: /(['"])(.*)\/organisms\/CommentsModal(['"])/g, replace: '$1$2/organisms/commentsModal/CommentsModal$3' },
  { regex: /(['"])(.*)\/organisms\/ErrorModalProvider(['"])/g, replace: '$1$2/organisms/errorModalProvider/ErrorModalProvider$3' },
  { regex: /(['"])(.*)\/organisms\/GridPostCard(['"])/g, replace: '$1$2/organisms/gridPostCard/GridPostCard$3' },
  { regex: /(['"])(.*)\/organisms\/PostCard(['"])/g, replace: '$1$2/organisms/postCard/PostCard$3' },
  { regex: /(['"])(.*)\/organisms\/StatusViewerModal(['"])/g, replace: '$1$2/organisms/statusViewerModal/StatusViewerModal$3' },
  { regex: /(['"])(.*)\/organisms\/StoriesRail(['"])/g, replace: '$1$2/organisms/storiesRail/StoriesRail$3' },
];

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (!['node_modules', '.git', 'android', 'ios'].includes(file)) {
        walk(filePath);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      let content = fs.readFileSync(filePath, 'utf8');
      let originalContent = content;
      
      for (const { regex, replace } of replacements) {
        content = content.replace(regex, replace);
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated imports in ${filePath}`);
      }
    }
  }
}

walk(srcDir);
console.log('Import updates complete.');
