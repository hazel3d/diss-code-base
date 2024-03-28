import { PrismaClient } from "@prisma/client";
import { useState } from 'react';
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { APIProvider, Map, AdvancedMarker, InfoWindow, Pin, } from "@vis.gl/react-google-maps"

const prisma = new PrismaClient();

export async function loader() {
    const locationsFromServer = await prisma.location.findMany();
    const geoApiKey = process.env.GEO_API_KEY;
    const apiKey = process.env.API_KEY;
    const promises: Promise<any>[] = [];

    // For each location on the server, take the pluscode and process it into coords, then rebuild the object
    locationsFromServer.forEach((location) => {
        promises.push(fetch(encodeURI(`https://plus.codes/api?address=${location.pluscode}&key=${geoApiKey}`).replace('+', '%2B'))
            .then(response => response.json())
            .then(response => ({ ...location, loc: response.plus_code.geometry.location }))
            );
    })

    const data = await Promise.all(promises);

    return json({ data, apiKey });
}

export default function Index() {
    const { data, apiKey } = useLoaderData<typeof loader>();
    const [infowindowOpen, setInfowindowOpen] = useState(false);
    const position = { lat: 55.862, lng: -4.247 };
    const colour = ["red", "orange", "yellow", "olive", "lime"];

    // Returning a map and for each location placing a pin with a corespending info box
    return (
        <APIProvider apiKey={apiKey ?? ""}>
            <div id="map" className="absolute size-full h-[calc(100vh-80px)]">
                <Map defaultZoom={ 10 } defaultCenter={ position } mapId="4616fdc1c50c696b">
                    { data.map((location) => {
                        return (
                            <>                            
                                <AdvancedMarker key={location.id} position={ location.loc } title={ location.title } onClick={() => setInfowindowOpen(true)}>
                                    <Pin background={ colour[location.rating - 1] } borderColor={ "black" } glyphColor={ "black" }/>
                                </AdvancedMarker>

                                {infowindowOpen && (
                                    <InfoWindow key={location.id} position={location.loc} onCloseClick={() => setInfowindowOpen(false)}>
                                        <div>
                                            <h1> { location.title } </h1>
                                            <p> Review: { location.body } </p>
                                            <p> Experience: { location.rating } stars </p>
                                        </div>
                                    </InfoWindow>
                                )}
                            </>
                        )
                    })}
                </Map>
            </div>
        </APIProvider>
    )
}
