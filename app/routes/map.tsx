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

export default function Index() {
    const { apiKey } = useLoaderData<typeof loader>();
    const position = { lat: 55.862, lng: -4.247 };

    return (
        <APIProvider apiKey={apiKey ?? ""}>
            <div id="map" className="absolute size-full h-[calc(100vh-80px)]">
                <Map defaultZoom={10} defaultCenter={ position } mapId="4616fdc1c50c696b">

                </Map>
            </div>
        </APIProvider>
    )
}
