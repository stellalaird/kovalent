// ─── MOCK DATA ───────────────────────────────────────────────
const MOCK_USERS = [
  { id: "u1", name: "Priya Nair", year: "3rd Year", major: "CS + Psychology", gender: "She/Her", avatar: "PN", color: "#7c3aed", tokens: 24, taught: 3, learned: 5, meetups: 4, rating: 4.9, contact: "priya@northwestern.edu" },
  { id: "u2", name: "Marcus Webb", year: "2nd Year", major: "Music + Economics", gender: "He/Him", avatar: "MW", color: "#0ea5e9", tokens: 18, taught: 5, learned: 2, meetups: 7, rating: 4.8, contact: "marcus@northwestern.edu" },
  { id: "u3", name: "Sofia Reyes", year: "4th Year", major: "Art History", gender: "She/Her", avatar: "SR", color: "#ec4899", tokens: 31, taught: 7, learned: 3, meetups: 9, rating: 5.0, contact: "sofia@northwestern.edu" },
  { id: "u4", name: "Jalen Brooks", year: "1st Year", major: "Pre-Med", gender: "He/Him", avatar: "JB", color: "#10b981", tokens: 8, taught: 1, learned: 6, meetups: 2, rating: 4.6, contact: "jalen@northwestern.edu" },
  { id: "u5", name: "Mei Lin", year: "3rd Year", major: "Chemical Engineering", gender: "She/Her", avatar: "ML", color: "#f59e0b", tokens: 22, taught: 4, learned: 4, meetups: 5, rating: 4.7, contact: "mei@northwestern.edu" },
  { id: "u6", name: "Devon Park", year: "2nd Year", major: "Film Studies", gender: "They/Them", avatar: "DP", color: "#8b5cf6", tokens: 15, taught: 2, learned: 7, meetups: 3, rating: 4.8, contact: "devon@northwestern.edu" },
];

const CURRENT_USER = {
  id: "me", name: "Alex Chen", year: "3rd Year", major: "Computer Science", gender: "He/Him",
  avatar: "AC", color: "#6c4fc2", tokens: 20, taught: 2, learned: 4, meetups: 3,
  rating: 4.7, contact: "alexchen@northwestern.edu", bio: "CS junior interested in music, chess, and building cool things.",
};

const MOCK_SESSIONS = [
  {
    id: "s1", type: "teach", skill: "Jazz Guitar Fundamentals", teacher: MOCK_USERS[1],
    level: "Beginner", interested: 8, minGroup: 2, maxGroup: 5, taught: 5,
    description: "Learn jazz chord voicings, basic improv theory, and rhythm patterns. We'll start with standards like Autumn Leaves.",
    activityLevel: "high", status: "feed", tags: ["music", "guitar"],
    waitingRoom: [MOCK_USERS[0], MOCK_USERS[3]],
    messages: [
      { user: MOCK_USERS[1], text: "Hey everyone! Excited to teach this. Let's nail down a time.", time: "2:30 PM" },
      { user: MOCK_USERS[0], text: "I'm free most evenings after 6pm!", time: "2:45 PM" },
      { user: MOCK_USERS[3], text: "Weekends work great for me", time: "3:00 PM" },
    ]
  },
  {
    id: "s2", type: "teach", skill: "Watercolor Basics", teacher: MOCK_USERS[2],
    level: "All Levels", interested: 12, minGroup: 2, maxGroup: 6, taught: 7,
    description: "Explore wet-on-wet techniques, color blending, and simple landscapes. Materials provided for first session.",
    activityLevel: "medium", status: "feed", tags: ["art", "creative"],
    waitingRoom: [MOCK_USERS[4], MOCK_USERS[5], MOCK_USERS[0]],
    messages: []
  },
  {
    id: "s3", type: "teach", skill: "Python for Beginners", teacher: MOCK_USERS[0],
    level: "Beginner", interested: 15, minGroup: 3, maxGroup: 8, taught: 3,
    description: "Intro to Python: variables, loops, functions. Perfect for non-CS majors who want to learn coding basics.",
    activityLevel: "high", status: "feed", tags: ["coding", "tech"],
    waitingRoom: [MOCK_USERS[3]],
    messages: []
  },
  {
    id: "s4", type: "teach", skill: "Pottery Wheel", teacher: MOCK_USERS[4],
    level: "Intermediate", interested: 6, minGroup: 2, maxGroup: 4, taught: 4,
    description: "Throwing and centering clay on the wheel. We'll use Norris University Center's ceramics studio.",
    activityLevel: "medium", status: "scheduled",
    scheduledTime: "Saturday, June 7 · 2:00 PM", location: "Norris Ceramics Studio, Room 201",
    materials: "Clay provided. Wear clothes you don't mind getting dirty.",
    participants: [MOCK_USERS[1], MOCK_USERS[5]],
    messages: []
  },
  {
    id: "s5", type: "learn", skill: "Spanish Conversation", requester: MOCK_USERS[3],
    interested: 4, level: "Intermediate", description: "Looking for a fluent speaker to practice conversational Spanish, especially medical vocab.",
    activityLevel: "medium", status: "feed", tags: ["language"],
  },
  {
    id: "s6", type: "learn", skill: "Film Photography", requester: MOCK_USERS[5],
    interested: 7, level: "Beginner", description: "Want to learn how to shoot and develop 35mm film. Darkroom access at Block Museum.",
    activityLevel: "high", status: "feed", tags: ["photography", "art"],
  },
  {
    id: "s7", type: "learn", skill: "Piano/Keyboard", requester: MOCK_USERS[3],
    interested: 3, level: "Beginner", description: "Complete beginner wanting to learn basics. Have a keyboard in my dorm.",
    activityLevel: "low", status: "feed", tags: ["music"],
  },
  {
    id: "s8", type: "meetup", activity: "Chess Club", participants: [MOCK_USERS[0], MOCK_USERS[1], MOCK_USERS[4]],
    activityLevel: "high", status: "feed", interested: 9, maxGroup: 12,
    description: "Casual chess games, any skill level welcome. We meet at Norris weekly and do blitz + analysis.",
    tags: ["games", "strategy"],
    messages: [
      { user: MOCK_USERS[0], text: "Anyone up for a blitz tourney this weekend?", time: "1:15 PM" },
      { user: MOCK_USERS[1], text: "Absolutely! Saturday works for me", time: "1:20 PM" },
    ]
  },
  {
    id: "s9", type: "meetup", activity: "Morning Run Group", participants: [MOCK_USERS[2], MOCK_USERS[4]],
    activityLevel: "medium", status: "feed", interested: 5, maxGroup: 10,
    description: "5K loops around the lakefront, Tues/Thurs 7am. All paces welcome, we stick together.",
    tags: ["fitness", "outdoors"],
    messages: []
  },
  {
    id: "s10", type: "meetup", activity: "Board Game Night", participants: [MOCK_USERS[1], MOCK_USERS[5], MOCK_USERS[3], MOCK_USERS[2]],
    activityLevel: "high", status: "scheduled",
    scheduledTime: "Friday, June 6 · 7:00 PM", location: "Norris Game Room",
    participants: [MOCK_USERS[1], MOCK_USERS[5], MOCK_USERS[3]],
    description: "Catan, Ticket to Ride, Codenames — bring your favorites!",
    tags: ["games", "social"],
    messages: []
  },
];

// Sessions the current user is involved in
const MY_SESSIONS = [
  { ...MOCK_SESSIONS[0], status: "waiting_room", myRole: "learner" },
  { ...MOCK_SESSIONS[3], status: "scheduled", myRole: "learner" },
  { ...MOCK_SESSIONS[7], status: "waiting_room", myRole: "participant" },
  { ...MOCK_SESSIONS[9], status: "scheduled", myRole: "participant" },
  {
    id: "s-comp1", type: "teach", skill: "Intro to Chess", teacher: MOCK_USERS[0],
    level: "Beginner", status: "completed", myRole: "teacher",
    scheduledTime: "May 15, 2025 · 3:00 PM", location: "Tech LG52",
    participants: [MOCK_USERS[1], MOCK_USERS[3]],
    attended: [MOCK_USERS[1], MOCK_USERS[3]],
    ratings: [5, 4], description: "Taught chess basics.",
  },
];



export { MOCK_USERS, CURRENT_USER, MOCK_SESSIONS, MY_SESSIONS };