import yaml from 'js-yaml';
import { getLocation } from '../../src/utils/api';

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