import { json, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
    APIProvider,
    Map,
    AdvancedMarker,
    Pin,
    InfoWindow
} from "@vis.gl/react-google-maps"

export async function loader() {
    return json({ apiKey: process.env.API_KEY });
}

export const meta: MetaFunction = () => {
    return [
        { title: "Trans-Maps" },
        { name: "description", content: "Trans-Maps - A trans review website." },
    ];
};

export default function Index() {
    const { apiKey } = useLoaderData<typeof loader>();
    return (
        <APIProvider apiKey={apiKey ?? ""}>
            <Map zoom={15} center={{ lat: 55.862, lng: -4.247 }} mapId="4616fdc1c50c696b" className="absolute size-full h-[calc(100vh-80px)]">
                {
                    
                }
            </Map>
        </APIProvider>
    )
}
