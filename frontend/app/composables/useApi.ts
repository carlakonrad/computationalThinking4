// Every request to the backend goes through this client.
export function useApi() {
  return $fetch.create({ baseURL: useRuntimeConfig().public.apiBase })
}
