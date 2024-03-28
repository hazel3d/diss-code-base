import { redirect, type ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node';
import { PrismaClient } from '@prisma/client'
import { useActionData } from '@remix-run/react';

const prisma = new PrismaClient();

export async function loader({ request }: LoaderFunctionArgs) {
    const session = request.headers.get("cookie")?.split('=')[1] ?? "";

    if (session != "") {
        return redirect("/profile");
    }

    return json({ message: "" });
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const username = formData.get('username')?.toString() ?? "";
    const password = formData.get('password')?.toString() ?? "";
    const user = await prisma.user.findFirst({ where: { username: username } });

    if (user == null) {
        return json({ message: "User not found." });
    }

    if (username == user.username && password == user.password) {

        return new Response("", {
            headers: {
                "Set-Cookie": ("user=" + username)
            }
        });
    }

    return json({ message: "Wrong login credentials." });
}

export default function Index() {
    const error = useActionData<typeof action>()?.message ?? "";

    return (
        <div id="signin">
            <h1 className="p-8 text-center mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                Sign-In
            </h1>
            <h3 className="p-8 text-center mb-4 text-4xl font-extrabold leading-none tracking-tight text-red-900 md:text-5xl lg:text-6xl dark:text-white">
                { error }
            </h3>
            <div>
                <form method="post" action="/signin" className="mb-6">
                    <div className="py-1 px-8 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                        <label htmlFor="username">Username</label>
                        <textarea name="username" id="username" rows={1} className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                            placeholder="Enter a username..." required></textarea>
                    </div>
                    <div className="py-1 px-8 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                        <label htmlFor="password">Password</label>
                        <textarea name="password" id="password" rows={1} className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                            placeholder="Enter a password..." required></textarea>
                    </div>
                    <button type="submit" className="inline-flex items-center outline py-2.5 px-6 text-xs font-medium text-center text-gray-900 bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                        Sign in
                    </button>
                </form>
            </div>
        </div>
    )
}
