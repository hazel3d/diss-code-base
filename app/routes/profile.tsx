import { redirect, type ActionFunctionArgs, LoaderFunctionArgs, json, isCookie } from '@remix-run/node';
import { PrismaClient } from '@prisma/client'
import { useLoaderData } from '@remix-run/react';

const prisma = new PrismaClient();

export async function loader({ request }: LoaderFunctionArgs) {
    const session = request.headers.get("cookie")?.split('=')[1] ?? "";

    if (session == "") {
        return redirect("/signin");
    }

    return json({ username: session });
}

export const action = async ({ request }: ActionFunctionArgs) => {
    delete isCookie

    return redirect("/signin");
};

export default function Index() {
    const username = useLoaderData<typeof loader>()?.username;

    return (
        <div id="signup">
            <h1 className="p-8 text-center mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                Profile
            </h1>
            <h3 className="p-8 text-center mb-4 text-4xl font-extrabold leading-none tracking-tight text-red-900 md:text-5xl lg:text-6xl dark:text-white">
                You are currently logged in as { username }!
            </h3>
            <form method="post" action="/profile" className="mb-6">
                <button type="submit" className="inline-flex items-center outline py-2.5 px-6 text-xs font-medium text-center text-gray-900 bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                    Log out
                </button>
            </form>
        </div>
    )
}
