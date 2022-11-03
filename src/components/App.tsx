import { FC, ChangeEvent, useRef } from 'react'

const App: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files == null) return
    const file = event.target.files[0]

    const fileReader = new FileReader()
    const image = document.createElement('img')

    fileReader.addEventListener('load', (event) => {
      const result = event.target?.result
      if (typeof result !== 'string') return
      image.src = result
    })

    image.addEventListener('load', (event) => {
      if (canvasRef.current == null) return
      const width = image.width
      const height = image.height

      const canvas = canvasRef.current

      canvas.setAttribute('width', width.toString())
      canvas.setAttribute('height', height.toString())

      const ctx = canvas.getContext('2d')
      if (ctx == null) return

      ctx.drawImage(image, 0, 0)

      ctx.fillStyle = 'rgba(255,255,255,0.2)'
      ctx.fillRect(0, 0, width, height)

      const colCount = 4
      const rowCount = 4
      const colWidth = width / 4
      const rowWidth = height / 4
      ctx.strokeStyle = 'red'
      ctx.lineWidth = 4
      for (let col = 0; col < colCount; col++) {
        const x1 = col * colWidth
        const y1 = 0
        const x2 = col * colWidth
        const y2 = height
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }

      for (let row = 0; row < rowCount; row++) {
        const x1 = 0
        const y1 = row * rowWidth
        const x2 = width
        const y2 = row * rowWidth
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }

      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(width, height)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(width, 0)
      ctx.lineTo(0, height)
      ctx.stroke()

      const img = imgRef.current
      if (img == null) return
      img.removeAttribute('hidden')
      img.src = canvas.toDataURL()
    })

    fileReader.readAsDataURL(file)
  }

  return (
    <div className='max-w-2xl mx-auto py-4'>
      <label htmlFor="file">
        <input type="file" id="file" onChange={handleChange} multiple={false} />
        画像を選ぶ
      </label>
      <canvas hidden className="w-full h-auto" ref={canvasRef} />
      <img hidden ref={imgRef} />
    </div>
  )
}

export default App
