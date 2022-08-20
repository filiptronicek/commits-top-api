import fetch from 'node-fetch';
import { basename } from 'path';
import yaml from 'js-yaml';
import { repo } from './constants';

export const getLocation = async (location: string) => {
    const url = `https://cdn.jsdelivr.net/gh/${repo}@master/_data/locations/${location}.yml`;
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