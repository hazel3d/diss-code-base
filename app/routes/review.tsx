import { redirect, type ActionFunctionArgs } from '@remix-run/node';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

// When someone reviews a place this uploads the review to the database and redirects them to the map
export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const pluscode = formData.get('pluscode')?.toString() ?? "";
    const location = formData.get('location')?.toString() ?? "";
    const review = formData.get('review')?.toString() ?? "";
    const ratingString = formData.get('rating')?.toString() ?? "3";
    const rating = parseInt(ratingString);


    await prisma.location.create({
        data: {
            pluscode: pluscode,
            title: location,
            body: review,
            rating: rating,
        }
    })

    return redirect("/map");
}

export default function Index() {
    return (
        <div>
            <h1 className="p-8 text-center mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                Review a location
            </h1>
            <form method="post" action="/review" className="mb-6">
                {/* pluscode section */}
                <div className="py-1 px-8 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                    <label htmlFor="pluscode">Plus Code</label>
                    <textarea name="pluscode" id="pluscode" rows={1} className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                        placeholder="Enter a plus code..." required></textarea>
                </div>
                {/* title section */}
                <div className="py-1 px-8 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                    <label htmlFor="location">Location Name</label>
                    <textarea name="location" id="location" rows={1} className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                        placeholder="Enter a location..." required></textarea>
                </div>
                {/* review section */}
                <div className="py-4 px-8 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                    <label htmlFor="review">Your Review</label>
                    <textarea name="review" id="review" rows={6} className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                        placeholder="Write a review..." required></textarea>
                </div>

                {/* rating section */}
                <div className="py-1 px-8 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                    <label htmlFor="rating" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Rating</label>
                    <input type="number" name="rating" id="rating" min="1" max="5" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="1-5" required />
                </div>


                {/* submit */}
                <button type="submit" className="inline-flex items-center outline py-2.5 px-6 text-xs font-medium text-center text-gray-900 bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                    Post!
                </button>
            </form>
        </div>
    )
}