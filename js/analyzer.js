// =================================================================== \\
//                           ANALYZER UTILITY                          \\
// =================================================================== \\
// This utility function analyzes Instagram relationship data.         \\
//                                                                     \\
// INPUT:                                                              \\
//   - following: Array of usernames that you follow on Instagram.     \\
//   - followers: Array of usernames that follow you.                  \\
//                                                                     \\
// PROCESS:                                                            \\
//   - Converts both arrays into Sets for efficient lookup.            \\
//   - Compares the two sets to determine:                             \\
//       1) Users you follow who don't follow you back (onlyFollowing).\\
//       2) Users you follow who also follow you back (mutual).        \\
//       3) Users who follow you but you don't follow (onlyFollowers). \\
//                                                                     \\
// OUTPUT:                                                             \\
//   - Returns an object with three properties:                        \\
//       {                                                             \\
//         onlyFollowing: [...],                                       \\
//         mutual: [...],                                              \\
//         onlyFollowers: [...]                                        \\
//       }                                                             \\
//                                                                     \\
// EXAMPLE USAGE:                                                      \\
//   const result = analyzeFollowers(followingList, followersList);    \\
//   // Users you follow but who don't follow back                     \\
//   console.log(result.onlyFollowing);                                \\
//   // Users with mutual following                                    \\
//   console.log(result.mutual);                                       \\
//   // Users who follow you but you don't follow                      \\
//   console.log(result.onlyFollowers);                                \\
//                                                                     \\
// NOTES:                                                              \\
//   - This function assumes that the input                            \\
//     arrays contain unique usernames.                                \\
// =================================================================== \\

export function analyzeFollowers(following, followers) {
    const setFollowing = new Set(following);
    const setFollowers = new Set(followers);

    const onlyFollowing = following.filter(user => !setFollowers.has(user));
    const mutual = following.filter(user => setFollowers.has(user));
    const onlyFollowers = followers.filter(user => !setFollowing.has(user));

    return { onlyFollowing, mutual, onlyFollowers };
}