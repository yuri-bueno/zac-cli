import { InewRouter, personalRequest } from '@/@types/router'
import { NextFunction, Response } from 'express'
import fs from 'fs'
import path from 'path'
import { v4 as uuid4 } from 'uuid'

import multer from 'multer'

export function multerMiddleware(route: InewRouter) {
  return (req: personalRequest, res: Response, next: NextFunction) => {
    if (!route.files) return next()

    const filesConfig = route.files

    const maxCountFiles = route.files.max || 1

    const uploadsFolder = path.resolve(
      __rootname,
      'uploads',
      route.files?.folder
    )

    const upload = multer({
      storage: multer.memoryStorage(),

      fileFilter: (req, file, cb) => {
        if (filesConfig.type === 'all') return cb(null, true)

        if (file.mimetype.startsWith(filesConfig.type)) {
          cb(null, true)
        } else {
          cb(new Error('invalid-file-type'))
        }
      },
      limits: {
        fileSize: 1024 * 1024 * 5,
        files: maxCountFiles,
      },
    })

    return upload.array('files', maxCountFiles)(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message })
      }

      console.log(!!req.files?.length)

      if (!req.files?.length && !route.files?.required)
        return res.status(400).json({ error: 'empty-files' })

      req.saveFiles = (fileID = '') => {
        return saveFiles(
          req.files as Express.Multer.File[],
          uploadsFolder,
          fileID
        )
      }

      next()
    })
  }
}

export function saveFiles(
  files: Express.Multer.File[],
  destinationFolder: string,
  FILE_ID = ''
) {
  if (!fs.existsSync(destinationFolder))
    fs.mkdirSync(destinationFolder, { recursive: true })

  const fileID = FILE_ID || uuid4()

  files.forEach((file) => {
    const destinationPath = path.resolve(
      destinationFolder,
      `${fileID}${path.extname(file.originalname)}`
    )

    fs.writeFileSync(destinationPath, file.buffer)
  })

  return true
}
