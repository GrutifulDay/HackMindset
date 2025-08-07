import sharp from "sharp"
import fs from "fs"
import path from "path"

const inputDir = "assets/icons/"
const outputDir = "assets/icons/resized/"
const height = 100

const filesToResize = [
    "vedel-pruhledna.png",
    "vedel-zluta.png",
    "nevedel-pruhledna.png",
    "nevedel-zluta.png",
    "nezazil-green.png",
    "nezazil-white.png",
    "zazil-green.png",
    "zazil-white.png"
  ]
  

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

filesToResize.forEach(async (file) => {
  const inputPath = path.join(inputDir, file)
  const outputPath = path.join(outputDir, file)

  try {
    const metadata = await sharp(inputPath).metadata()
    const aspectRatio = metadata.width / metadata.height
    const width = Math.round(height * aspectRatio)

    await sharp(inputPath)
      .resize(width, height) // bez contain, bez background
      .toFile(outputPath)

    console.log(`✅ ${file} → OK`)
  } catch (err) {
    console.error(`❌ Chyba u souboru ${file}:`, err.message)
  }
})
