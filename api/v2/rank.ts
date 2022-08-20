import yaml from 'js-yaml';
import { CommitsTopResponse } from '../../src/types/types';
import { getLocation } from "../../src/utils/api";

export default async function handler(request, response) {
    const { location, contributor } = request.query;
    const locationEveryoneResponse = await getLocation(location);

    if (!locationEveryoneResponse.ok) {
        response.status(400).json({
            status: "error",
            result: locationEveryoneResponse.statusText,
        });
    }
    const locationEveryoneRaw = await locationEveryoneResponse.text();
    const data = yaml.load(locationEveryoneRaw);

    const contributorStats = (data as CommitsTopResponse).users.find(user => user.login === contributor);

    if (!contributorStats) {
        return response.status(404).json({ status: "error", result: `User not found within ${location}`})
    }

    return response.status(200).json({ status: "success", result: contributorStats });
}
