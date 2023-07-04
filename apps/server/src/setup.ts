import moduleAlias from 'module-alias'
import path from 'path'

moduleAlias.addAlias('common', path.resolve(__dirname, './common'))
moduleAlias.addAlias('prisma', path.resolve(__dirname, './prisma'))
moduleAlias.addAlias('modules', path.resolve(__dirname, './modules'))
moduleAlias.addAlias('utils', path.resolve(__dirname, './utils'))
moduleAlias.addAlias('services', path.resolve(__dirname, './services'))
moduleAlias.addAlias('middlewares', path.resolve(__dirname, './middlewares'))
