import type { MetaFunction } from "@remix-run/node";
// import type { LoaderFunctionArgs } from "@remix-run/node";
// import { PrismaClient} from "@prisma/client";
// import { json } from "@remix-run/node";
// import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
    return [
        { title: "Trans-Maps" },
        { name: "description", content: "Trans-Maps - A trans review website." },
    ];
};

// export const loader = async ({
//     params,
// }: LoaderFunctionArgs) => {
//     return json(
//         await db.product.findMany({
//             where: {
//                 categoryId: params.categoryId,
//             },
//         })
//     );
// };

// export default function Index() {
//     const db = new PrismaClient();


// }

// export default function ProductCategory() {
//     const products = useLoaderData<typeof loader>();
//     return (
//         <div>
//             <p>{products.length} Products</p>
//             {/* ... */}
//         </div>
//     );
// }
