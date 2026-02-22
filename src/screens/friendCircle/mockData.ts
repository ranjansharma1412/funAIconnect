export interface UserProfile {
    id: string;
    name: string;
    handle: string;
    avatar: string;
    mutualFriends?: number;
}

export interface FriendRequest extends UserProfile {
    status: 'pending';
    timestamp: string;
}

export interface Post {
    id: string;
    userImage: string;
    userName: string;
    userHandle: string;
    isVerified: boolean;
    postImage: string;
    likes: number;
    hasLiked: boolean;
    commentsCount: number;
    description?: string;
}

export const mockFriendRequests: FriendRequest[] = [
    {
        id: '1',
        name: 'Alice Johnson',
        handle: '@alice_j',
        avatar: 'https://i.pravatar.cc/150?u=12',
        mutualFriends: 5,
        status: 'pending',
        timestamp: '2 hours ago',
    },
    {
        id: '2',
        name: 'Bob Smith',
        handle: '@bobster',
        avatar: 'https://i.pravatar.cc/150?u=13',
        mutualFriends: 2,
        status: 'pending',
        timestamp: '5 hours ago',
    },
];

export const mockFriendSuggestions: UserProfile[] = [
    {
        id: '3',
        name: 'Charlie Davis',
        handle: '@charlie_d',
        avatar: 'https://i.pravatar.cc/150?u=14',
        mutualFriends: 12,
    },
    {
        id: '4',
        name: 'Diana Prince',
        handle: '@wonder_diana',
        avatar: 'https://i.pravatar.cc/150?u=15',
        mutualFriends: 8,
    },
    {
        id: '5',
        name: 'Evan Wright',
        handle: '@ewright',
        avatar: 'https://i.pravatar.cc/150?u=16',
        mutualFriends: 1,
    }
];

export const mockFriends: UserProfile[] = [
    {
        id: '6',
        name: 'Fiona Gallagher',
        handle: '@fiona_g',
        avatar: 'https://i.pravatar.cc/150?u=17',
    },
    {
        id: '7',
        name: 'George Miller',
        handle: '@gmiller',
        avatar: 'https://i.pravatar.cc/150?u=18',
    },
    {
        id: '8',
        name: 'Hannah Abbott',
        handle: '@hannah_a',
        avatar: 'https://i.pravatar.cc/150?u=19',
    },
    {
        id: '9',
        name: 'Ian Somerhalder',
        handle: '@ian_s',
        avatar: 'https://i.pravatar.cc/150?u=20',
    }
];

export const mockMyPosts: Post[] = [
    {
        id: '101',
        userImage: 'https://i.pravatar.cc/150?u=me',
        userName: 'You',
        userHandle: '@me',
        isVerified: true,
        postImage: 'https://picsum.photos/seed/post1/500/800',
        likes: 120,
        hasLiked: true,
        commentsCount: 15,
        description: 'Exploring the beautiful streets of downtown! 📸 #citylife #photography',
    },
    {
        id: '102',
        userImage: 'https://i.pravatar.cc/150?u=me',
        userName: 'You',
        userHandle: '@me',
        isVerified: true,
        postImage: 'https://picsum.photos/seed/post2/500/800',
        likes: 85,
        hasLiked: false,
        commentsCount: 3,
        description: 'Coffee breaks are the best breaks. ☕️',
    },
    {
        id: '103',
        userImage: 'https://i.pravatar.cc/150?u=me',
        userName: 'You',
        userHandle: '@me',
        isVerified: true,
        postImage: 'https://picsum.photos/seed/post3/500/800',
        likes: 234,
        hasLiked: true,
        commentsCount: 42,
        description: 'Nature vibes today. So peaceful here. 🌿',
    },
    {
        id: '104',
        userImage: 'https://i.pravatar.cc/150?u=me',
        userName: 'You',
        userHandle: '@me',
        isVerified: true,
        postImage: 'https://picsum.photos/seed/post4/500/800',
        likes: 56,
        hasLiked: false,
        commentsCount: 1,
        description: 'Just setting up the new workspace! 💻🚀',
    },
    {
        id: '105',
        userImage: 'https://i.pravatar.cc/150?u=me',
        userName: 'You',
        userHandle: '@me',
        isVerified: true,
        postImage: 'https://picsum.photos/seed/post5/500/800',
        likes: 88,
        hasLiked: true,
        commentsCount: 11,
        description: 'Late night walks and long talks 🌙',
    },
    {
        id: '106',
        userImage: 'https://i.pravatar.cc/150?u=me',
        userName: 'You',
        userHandle: '@me',
        isVerified: true,
        postImage: 'https://picsum.photos/seed/post6/500/800',
        likes: 91,
        hasLiked: false,
        commentsCount: 5,
        description: 'Trying out a new recipe tonight! 🍝👨‍🍳',
    }
];
