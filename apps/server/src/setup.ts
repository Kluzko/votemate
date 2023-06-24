import moduleAlias from 'module-alias'
import path from 'path'

moduleAlias.addAlias('prisma', path.resolve(__dirname, './prisma'))
moduleAlias.addAlias('utils', path.resolve(__dirname, './utils'))
