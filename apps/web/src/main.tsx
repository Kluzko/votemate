import { createRoot } from 'react-dom/client'
import 'styles/index.css'

import { App } from 'components/App'

// eslint-disable-next-line prettier/prettier
createRoot(document.getElementById('root') as HTMLElement).render(<App />)
