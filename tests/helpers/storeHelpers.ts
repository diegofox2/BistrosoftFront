import { createPinia, setActivePinia } from 'pinia'

export const setupTestPinia = () => {
  const pinia = createPinia()
  setActivePinia(pinia)
  return pinia
}
