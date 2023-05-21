const runtimeConfig = useRuntimeConfig();

export const getAPI = () => runtimeConfig.public.apiKey
//import.meta.env.VITE_API_URL;