/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { GluegunCommand } from 'gluegun'
import { Toolbox } from 'gluegun/build/types/domain/toolbox'

interface Iresult {
  path: string
  middlewares: string[]
  orm: string
  database?: string
}

const command: GluegunCommand = {
  name: 'zac-cli',
  run: async (toolbox) => {
    const { print, template } = toolbox

    const result = await initalAsks(toolbox)

    CreateMiddlewares(result.middlewares, toolbox)

    template.generate({
      template: 'server.ts.ejs',
      target: 'src/test/server.ts',
      props: {
        middlewares: result.middlewares,
      },
    })

    console.log(result)
    print.info('final')
  },
}

export default command

async function CreateMiddlewares(
  middlewares: string[],
  { filesystem }: Toolbox
) {
  for (const middleware of middlewares) {
    await filesystem.copyAsync(
      `src/base/middlewares/${middleware}.ts`,
      `src/test/middlewares/${middleware}.ts`,
      { overwrite: true }
    )
  }
}

async function initalAsks({ prompt, print }: Toolbox) {
  const result = await prompt.ask<Iresult>([
    {
      name: 'path',
      message: 'Escolha o local do arquivo:',
      type: 'input',
      initial: '.',
    },
    {
      name: 'middlewares',
      message: 'Middlewares adicionais:',
      type: 'multiselect',
      choices: [
        {
          name: 'FormatParams',
          value: 'formatParams',
          hint: print.colors.gray('(Recomendado)'),
        },
        { name: 'Auth', value: 'auth' },
        { name: 'Multer', value: 'multer' },
      ],
      required: false,
    },
    {
      name: 'orm',
      message: 'Escolha o ORM:',
      type: 'select',
      choices: [
        {
          name: 'Prisma',
          value: 'prisma',
          hint: print.colors.gray('(Recomendado)'),
        },
        { name: 'Nenhum', value: '' },
      ],
    },
  ])

  result.middlewares = result.middlewares.map(
    (m) => m.charAt(0).toLowerCase() + m.slice(1)
  )

  switch (result.orm) {
    case 'Prisma':
      result.database = await prompt
        .ask<{ database: string }>({
          name: 'database',
          message: 'Escolha o ORM:',
          type: 'select',
          choices: [
            { name: 'SQLite', value: 'sqlite' },
            { name: 'MySQL', value: 'mysql' },
            { name: 'PostgreSQL', value: 'postgresql' },
            { name: 'MongoDB', value: 'mongodb' },
            { name: 'SQL Server', value: 'sqlserver' },
            { name: 'CockroachDB', value: 'cockroachdb' },
          ],
          required: true,
        })
        .then((e) => e.database)
      break

    default:
      break
  }

  return result
}
