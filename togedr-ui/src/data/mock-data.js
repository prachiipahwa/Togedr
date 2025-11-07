// src/data/mock-data.js
export const mockActivities = [
  {
    _id: 'act1',
    title: 'Evening Football Game',
    tag: 'Football',
    creator: 'user1',
    members: ['user1', 'user2'],
    time: '2025-07-31T18:00:00.000Z',
    // Add the location object back
    location: { lat: 30.7333, lng: 76.7794 },
    description: 'Casual 5-a-side football game. All skill levels welcome!',
  },
  {
    _id: 'act2',
    title: 'Study Session for Exams',
    tag: 'Study',
    creator: 'user2',
    members: ['user2'],
    time: '2025-08-01T14:00:00.000Z',
    // Add the location object back
    location: { lat: 30.7652, lng: 76.7853 },
    description: 'Grinding for the upcoming semester exams. Join me at the library.',
  },
  {
    _id: 'act3',
    title: 'Coffee and Conversation',
    tag: 'Coffee',
    creator: 'user3',
    members: ['user3'],
    time: '2025-08-01T19:00:00.000Z',
    // Add the location object back
    location: { lat: 30.7415, lng: 76.7788 },
    description: 'Just want to grab a coffee and chat about anything.',
  },
];

export const mockUsers = {
  user1: { _id: 'user1', name: 'Rohan', interests: ['Football', 'Gaming'] },
  user2: { _id: 'user2', name: 'Priya', interests: ['Study', 'Walk'] },
  user3: { _id: 'user3', name: 'Amit', interests: ['Coffee', 'Music Jam'] },
};