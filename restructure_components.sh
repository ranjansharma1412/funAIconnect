#!/bin/bash
cd /Users/ranjansharma/Desktop/ranjan_workspace/FunAIconnect/src/components

# Atoms
mkdir -p atoms/avatar
mv atoms/Avatar.tsx atoms/AvatarStyle.ts atoms/avatar/

# Molecules
mkdir -p molecules/commentItem molecules/dashboardHeader molecules/emptyPostsState molecules/errorModal molecules/storyItem
mv molecules/CommentItem.tsx molecules/CommentItemStyle.ts molecules/commentItem/
mv molecules/DashboardHeader.tsx molecules/DashboardHeaderStyle.ts molecules/dashboardHeader/
mv molecules/EmptyPostsState.tsx molecules/EmptyPostsStateStyle.ts molecules/emptyPostsState/
mv molecules/ErrorModal.tsx molecules/ErrorModalStyle.ts molecules/errorModal/
mv molecules/StoryItem.tsx molecules/StoryItemStyle.ts molecules/storyItem/

# Organisms
mkdir -p organisms/commentsModal organisms/errorModalProvider organisms/gridPostCard organisms/postCard organisms/statusViewerModal organisms/storiesRail
mv organisms/CommentsModal.tsx organisms/CommentsModalStyle.ts organisms/commentsModal/
mv organisms/ErrorModalProvider.tsx organisms/errorModalProvider/
mv organisms/GridPostCard.tsx organisms/GridPostCardStyle.ts organisms/gridPostCard/
mv organisms/PostCard.tsx organisms/PostCardStyle.ts organisms/postCard/
mv organisms/StatusViewerModal.tsx organisms/StatusViewerModalStyle.ts organisms/statusViewerModal/
mv organisms/StoriesRail.tsx organisms/StoriesRailStyle.ts organisms/storiesRail/

echo "Component files moved successfully."
