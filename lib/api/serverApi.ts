import axios from "axios";
import { cookies } from "next/headers";

const baseURL = process.env.NEXT_PUBLIC_API_URL + '/api';

export const getServerApi = async () => {
    const cookieStore = await cookies();

    return axios.create({
        baseURL,
        headers: {
            Cookie: cookieStore.toString(),
        },
    });
};