import '@fontsource/lalezar'
import '@fontsource/roboto'
import { createRoot } from 'react-dom/client'
import 'styles/index.css'

import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import { App } from 'components/App'
import { store, persistor } from '@redux'
import { MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type AxiosError } from 'axios'
import { setIsAuthenticated } from 'utils'

const queryClient = new QueryClient({
   defaultOptions: { queries: { refetchOnWindowFocus: false } },
   mutationCache: new MutationCache({
      onError: (error, _query) => {
         const { response } = error as AxiosError
         if (response?.data === 'Token not found') {
            setIsAuthenticated(false)
         }
      },
   }),
})

createRoot(document.getElementById('root') as HTMLElement).render(
   <Provider store={store}>
      <PersistGate persistor={persistor}>
         <QueryClientProvider client={queryClient}>
            <App />
         </QueryClientProvider>
      </PersistGate>
   </Provider>
)
