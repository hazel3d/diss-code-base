import { json, redirect, type ActionFunctionArgs, LoaderFunctionArgs} from '@remix-run/node';
import { PrismaClient } from '@prisma/client'
import { useLoaderData } from '@remix-run/react';

const prisma = new PrismaClient();

// Loading in all of the posts and people who have posted when the page loads
export async function loader({ request }: LoaderFunctionArgs) {
    const posts = await prisma.post.findMany();
    const userIds: Array<number> = [];
    const username = request.headers.get("cookie")?.split('=')[1] ?? "";
    
    // Adds all users that have posted to an array to search up
    posts.forEach( (post) => {
        if (!userIds.includes(post.authorId)) {
            userIds.push(post.authorId);
        }
    })

    // Finds the username of all users who have posted
    const users = await prisma.user.findMany({
        where: { id: {in: userIds }},
        select: { id: true, username: true}
    });

    return json({posts, users, username})
}

// Runs on submission of post on the forum
export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const title = formData.get('title')?.toString() ?? "";
    const comment = formData.get('comment')?.toString() ?? "";
    const username = request.headers.get("cookie")?.split('=')[1] ?? "";
    const user = await prisma.user.findFirst({ where: { username: username } });

    if (user == null){
        return redirect("/profile");
    }

    await prisma.post.create({
        data: {
            title: title ,
            body: comment,
            authorId: user.id
        }
    })

    return redirect("/forum");
}

export default function Index() {
    const { posts, users, username } = useLoaderData<typeof loader>();

    if(username == ""){
        return (
            <p className = "text-center p-10" >
                <h1 className="p-4 mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                    Forum
                </h1>
                
                You are not currently logged in. Please log in to access the forum.
            </p>
        )
    }

    return (
        <div id="forum">
            <h1 className="p-8 text-center mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                Forum
            </h1>
            <div id="feed">
                <section className="py-4 lg:py-16">
                    <div className="max-w-fit mx-auto px-4">
                        {/* Form for submitting a post */}
                        <div className="flex justify-between items-center mb-6">
                            <p> Posting under the username: {username} </p>
                        </div>
                        <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Make a Post</h2>
                        <form method="post" action="/forum" className="mb-6">
                            <div className="py-1 px-8 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                                <label htmlFor="title">Title</label>
                                <textarea name="title" id="title" rows={ 1 } className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                                    placeholder="Enter a title..." required></textarea>
                            </div>
                            <div className="py-4 px-8 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                                <label htmlFor="comment">Your comment</label>
                                <textarea name="comment" id="comment" rows={ 6 } className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800" 
                                placeholder="Write a comment..." required></textarea>
                            </div>
                            <button type="submit" className="inline-flex items-center outline py-2.5 px-6 text-xs font-medium text-center text-gray-900 bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                                Post!
                            </button>
                        </form>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Recent Posts</h2>
                        </div>

                        {/* Loads all posts */}
                        { posts.map( (p) => (
                            <article key={ p.id } className="p-6 text-base bg-white rounded-lg dark:bg-gray-900">
                                <footer className="flex justify-between items-center mb-2">
                                    <button id="dropdownComment1Button" data-dropdown-toggle="dropdownComment1"
                                        className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 dark:text-gray-400 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                                        type="button">
                                        <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
                                            <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                                        </svg>
                                        <span className="sr-only">Comment settings</span>
                                        <h3 className="px-5 text-gray-900"> { p.title } </h3>
                                    </button>
                                    <div id="dropdownComment1"
                                        className="hidden z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                                        <ul className="py-1 text-sm text-gray-700 dark:text-gray-200"
                                            aria-labelledby="dropdownMenuIconHorizontalButton">
                                            <li>
                                                <a href="mailto:hazel.bell.2018@uni.strath.ac.uk"
                                                    className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Report</a>
                                            </li>
                                        </ul>
                                    </div>
                                </footer>
                                <p className="text-gray-500 dark:text-gray-400"> { p.body } </p>
                                <div className="flex items-center mt-4 space-x-4">
                                    <p className="px-5"> 
                                        { users.find((user) => user.id === p.authorId)?.username ?? "" }
                                    </p>
                                </div>
                            </article>
                        ))}    
                    </div>
                </section>
            </div>
        </div>
    )
}
