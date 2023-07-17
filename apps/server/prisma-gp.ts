import { execSync } from 'child_process'
import dotenv from 'dotenv'
import path from 'path'

import { logger } from 'utils'

const envPath = process.argv[2] === 'test' ? '.env.test' : '.env'
dotenv.config({ path: path.resolve(process.cwd(), envPath) })

try {
   execSync('npx prisma generate --schema=src/prisma/schema.prisma', { stdio: 'inherit' })
   execSync('npx prisma db push --schema=src/prisma/schema.prisma', { stdio: 'inherit' })
   logger.info({
      message: 'Successfully generated and pushed Prisma schema',
      environment: envPath,
      currentDirectory: process.cwd(),
   })
} catch (error: any) {
   logger.error({
      message: 'Failed to generate and push Prisma schema',
      error: error.toString(),
      environment: envPath,
      currentDirectory: process.cwd(),
   })
   process.exit(1)
}
