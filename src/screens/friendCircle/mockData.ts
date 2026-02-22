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
        postImage: 'https://picsum.photos/seed/post1/500/500',
        likes: 120,
        hasLiked: true,
        commentsCount: 15,
    },
    {
        id: '102',
        userImage: 'https://i.pravatar.cc/150?u=me',
        userName: 'You',
        userHandle: '@me',
        isVerified: true,
        postImage: 'https://picsum.photos/seed/post2/500/500',
        likes: 85,
        hasLiked: false,
        commentsCount: 3,
    }
];
