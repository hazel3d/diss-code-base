import { json, redirect, type ActionFunctionArgs} from '@remix-run/node';
import { PrismaClient } from '@prisma/client'
import { useLoaderData } from '@remix-run/react';

const prisma = new PrismaClient();

export async function loader() {
    const posts = await prisma.post.findMany();
    const comments = await prisma.comment.findMany();
    const userIds: Array<number> = [];
    
    posts.forEach( (post) => {
        if (!userIds.includes(post.authorId)) {
            userIds.push(post.authorId);
        }
    })

    const users = await prisma.user.findMany({
        where: { id: {in: userIds }},
        select: { id: true, username: true}
    });

    return json({posts, comments, users})
}

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const title = formData.get('title')?.toString() ?? "";
    const comment = formData.get('comment')?.toString() ?? "";

    await prisma.post.create({
        data: {
            title: title ,
            body: comment,
            authorId: 1
        }
    })

    return redirect("/forum");
};

export default function Index() {
    const { posts, users } = useLoaderData<typeof loader>();

    return (
        <div id="forum">
            <h1 className="p-8 text-center mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                Forum
            </h1>
            <div id="feed">
                <section className="py-8 lg:py-16">
                    <div className="max-w-fit mx-auto px-4">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Make a Post</h2>
                        </div>
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
                                                <a href="/"
                                                    className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Report</a>
                                            </li>
                                        </ul>
                                    </div>
                                </footer>
                                <p className="text-gray-500 dark:text-gray-400"> { p.body } </p>
                                <div className="flex items-center mt-4 space-x-4">
                                    <button type="button"
                                        className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium">
                                        <svg className="mr-1.5 w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5h5M5 8h2m6-3h2m-5 3h6m2-7H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v5l5-5h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z" />
                                        </svg>
                                        Reply
                                        <p className="px-5"> 
                                            { users.find((user) => user.id === p.authorId)?.username ?? "" }
                                        </p>
                                    </button>
                                </div>
                            </article>

                            //Comments
                        //     { comments.forEach( (com) => (
                        //         <article className="p-6 mb-3 ml-6 lg:ml-12 text-base bg-white rounded-lg dark:bg-gray-900">
                        //             <footer className="flex justify-between items-center mb-2">
                        //                 <button id="dropdownComment2Button" data-dropdown-toggle="dropdownComment2"
                        //                     className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 dark:text-gray-40 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        //                     type="button">
                        //                     <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
                        //                         <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                        //                     </svg>
                        //                     <span className="sr-only">Comment settings</span>
                        //                 </button>
                        //                 <div id="dropdownComment2"
                        //                     className="hidden z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                        //                     <ul className="py-1 text-sm text-gray-700 dark:text-gray-200"
                        //                         aria-labelledby="dropdownMenuIconHorizontalButton">
                        //                         <li>
                        //                             <a href="/"
                        //                                 className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Report</a>
                        //                         </li>
                        //                     </ul>
                        //                 </div>
                        //             </footer>
                        //             <p className="text-gray-500 dark:text-gray-400">Much appreciated! Glad you liked it ☺️</p>
                        //             <div className="flex items-center mt-4 space-x-4">
                        //                 <button type="button"
                        //                     className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium">
                        //                     <svg className="mr-1.5 w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
                        //                         <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5h5M5 8h2m6-3h2m-5 3h6m2-7H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v5l5-5h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z" />
                        //                     </svg>
                        //                     Reply
                        //                 </button>
                        //             </div>
                        //         </article>
                        //     ))}
                        ))}    
                    </div>
                </section>
            </div>
        </div>
    )
}
