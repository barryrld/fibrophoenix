module.exports = function (options = {}) {
  return function (req, res, next) {
    const path = require('path')

    const queryString = req._parsedOriginalUrl.query
    const url = req.url.replace(req._parsedOriginalUrl.search, '')
    const requestExtension = path.extname(url)

    // See: https://github.com/broofa/node-mime/blob/master/types/standard.json
    const imageExtensions = {
      '.png': { mime: 'image/png' },
      '.jpg': { mime: 'image/jpeg' },
      '.jpe': { mime: 'image/jpeg' },
      '.jpeg': { mime: 'image/jpeg' },
      '.gif': { mime: 'image/gif' },
      '.webp': { mime: 'image/webp' },
      '.svg': { mime: 'image/svg+xml' },
      '.svgz': { mime: 'image/svg+xml' }
    }

    if (!Object.keys(imageExtensions).includes(requestExtension)) {
      return next()
    }

    const fs = require('fs')

    // Lookup image file in the content directory nested as per the request url.
    const filePath = `./content${url}`
    const fileExists = fs.existsSync(filePath)

    if (fileExists) {
      const query = !queryString ? {} : queryString.split('&').reduce((acc, query) => {
        const [key, value] = query.split('=')
        acc[key] = value
        return acc
      }, {})

      const respondWithFile = (imagePath) => {
        const fileContent = fs.readFileSync(imagePath)
        res.writeHead(200, { 'Content-Type': imageExtensions[requestExtension].mime });
        return res.end(fileContent)
      }

      const imageStyles = options.imageStyles || {}

      if (query.style && Object.keys(imageStyles).includes(query.style)) {

        const mkdirp = require('mkdirp')
        const subDir = path.dirname(url)
        const styleDir = path.join('static', 'image-styles', subDir)

        // Prepare target directory.
        if (!fs.existsSync(styleDir)) {
          mkdirp.sync(styleDir)
        }

        // Copy file.
        const sourceBasename = path.basename(url, requestExtension)
        const targetFile = `${sourceBasename}--${query.style}${requestExtension}`
        const targetPath = path.join(styleDir, targetFile)

        if (fs.existsSync(targetPath)) {
          // Respond with existing (already processed) file.
          return respondWithFile(targetPath)
        }

        // @todo imagemagick apply style
        fs.copyFileSync(filePath, targetPath)

        // Respond with new file.
        return respondWithFile(targetPath)
      }

      // Respond with source file.
      return respondWithFile(filePath)
    }

    // Fall through to nuxt's own 404 page.
    next()
  }
}