async function getUsersdata() {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");

    if (!response.ok) {
        throw new Error("can't load users");
    }

    return response.json();
}

async function getPost() {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");

    if (!response.ok) {
        throw new Error("can't load posts");
    }

    return response.json();
}

async function loadDashboard() {
    try {
        // 1. Get users and posts concurrently
        const [users, posts] = await Promise.all([
            getUsersdata(),
            getPost()
        ]);

        // 2. Total users
        console.log("Total users:", users.length);

        // 3. Total posts
        console.log("Total posts:", posts.length);

        // 4. Filter Gwenborough users then map to names
        const names = users
            .filter(user => user.city === "Gwenborough")
            .map(user => user.name);

        // 5. Count posts by userId
        const nposts = posts.reduce((count, post) => {
            count[post.userId] = (count[post.userId] || 0) + 1;
            return count;
        }, {});

        // 6. Display names and post counts
        console.log("Gwenborough users:", names);
        console.log("Posts by user:", nposts);

        // 7. Create dashboard user data
        const dashboardUsers = users.map(user => {
            return {
                name: user.name,
                city: user.city,
                posts: nposts[user.id] || 0
            };
        });

        // 8. Active Gwenborough users
        const activeGwenboroughUsers = users
            .filter(user =>
                user.city === "Gwenborough" &&
                nposts[user.id] > 0
            )
            .map(user => {
                return {
                    name: user.name,
                    posts: nposts[user.id]
                };
            });

        // 9. Dashboard summary
        const gbusers = users
            .filter(user => user.city === "Gwenborough")
            .length;

        const summary = {
            totalUsers: users.length,
            totalPosts: posts.length,
            gwenboroughUsers: gbusers,
            averagePostsPerUser: posts.length / users.length
        };

        console.log("Dashboard users:", dashboardUsers);
        console.log("Active Gwenborough users:", activeGwenboroughUsers);
        console.log("Summary:", summary);
    }
    catch (error) {
        console.log(error);
    }
}

loadDashboard();