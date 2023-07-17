import '@fontsource/lalezar'
import '@fontsource/roboto'
import { createRoot } from 'react-dom/client'
import 'styles/index.css'

import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import { App } from 'components/App'
import { store, persistor } from '@redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

createRoot(document.getElementById('root') as HTMLElement).render(
   <Provider store={store}>
      <PersistGate persistor={persistor}>
         <QueryClientProvider client={queryClient}>
            <App />
         </QueryClientProvider>
      </PersistGate>
   </Provider>
)
