import { getAllLocationNames } from "../../src/utils/api";

export default async function handler(_request, response) {
  const locations = await getAllLocationNames();
  return response.status(200).json({ status: "success", result: locations });
}

