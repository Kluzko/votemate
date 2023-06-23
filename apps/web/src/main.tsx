import { createRoot } from 'react-dom/client'
import 'styles/index.css'

import { App } from 'components/App'

createRoot(document.getElementById('root') as HTMLElement).render(<App />)
