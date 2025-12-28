import Parse from "@/lib/parse/client"

export async function signUp({ username, password, name }: { username: string, password: string, name: string }) {
    const normalizedUsername = username.trim().toLowerCase();
    const normalizedName = name.trim()

    const usernameRegex = /^[a-z0-9._-]{3,20}$/;
    if (!usernameRegex.test(normalizedUsername)) {
        throw new Error("Invalid username format.");
    }

    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ'’ -]{2,50}$/;
    if (!nameRegex.test(normalizedName)) {
        throw new Error("Full Name can only contain letters, spaces, and basic punctuation.");
    }

    if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long.");
    }
    if (password.startsWith(" ") || password.endsWith(" ")) {
        throw new Error("Password cannot start or end with spaces.");
    }

    const user = new Parse.User();
    user.set("username", normalizedUsername)
    user.set("password", password)
    user.set("name", normalizedName)

    try {
        const result = await user.signUp()
        console.log("Signed up:", result.get("username"))
        return result;
    } catch (err: any) {
        if (err instanceof Error) throw err;
        throw new Error("Sign up failed.");
    }
}

export async function logIn({ username, password }: { username: string, password: string }) {
    try {
        const user = await Parse.User.logIn(username.trim().toLowerCase(), password);
        console.log("Logged in:", user.get("username"))
        return user;
    } catch (err: any) {
        if (err instanceof Error) throw err;
        throw new Error("Login failed.");
    }
}

export async function logOut() {
    await Parse.User.logOut();
}

export function getCurrentUser() {
    return Parse.User.current();
}