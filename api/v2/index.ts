import yaml from 'js-yaml';
import fetch from 'node-fetch';
import { basename } from 'path';

const repo = "lauripiispanen/github-top";

const getLocation = async (location: string) => {
    const url = `https://cdn.jsdelivr.net/gh/lauripiispanen/github-top@master/_data/locations/${location}.yml`;
    console.log("Requesting ", url)
    return await fetch(url);
}

export const getAllLocationNames = async (): Promise<string[]> => {
    const locationResponse = await fetch(`https://api.github.com/repos/${repo}/git/trees/master?recursive=2`);
    const locationResponseData = await locationResponse.json();
    return locationResponseData.tree.filter(item => item.path.includes("_data/locations/")).map(item => basename(item.path, ".yml"));
}

export const getAllLocations = async () => {

    const locations = await getAllLocationNames();
    const endData = new Map<string, any>();
    for (const location of locations) {
        const locationDataResponse = await getLocation(location);

        if (!locationDataResponse.ok) {
            throw new Error(locationDataResponse.statusText);
        }

        const rawLocationData = await locationDataResponse.text();
        const data = yaml.load(rawLocationData);

        endData.set(location, data)
    }

    return endData;

}

export default async function handler(request, response) {

    const { location } = request.query;

    if (location) {
        const commiterResponse = await getLocation(location);

        if (!commiterResponse.ok) {
            response.status(400).json({
                status: "error",
                result: commiterResponse.statusText
            });
        }

        const rawYaml = await commiterResponse.text();
        const data = yaml.load(rawYaml);

        return response.status(200).json({ status: "success", result: { [location]: data } });

    } else {
        return response.status(400).json({ status: "error", result: "Select a location or query /locations for available options" });
        /*
        try {
            const data = Object.fromEntries(await getAllLocations());
            return response.status(200).json({ status: "success", result: data });
        } catch (e) {
            return response.status(500).json({ status: "error", result: e.message })
        }
        */
    }
}