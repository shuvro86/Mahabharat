import AppKit
import AVFoundation
import CoreText

let inputURL = URL(fileURLWithPath: CommandLine.arguments[1])
let outputURL = URL(fileURLWithPath: CommandLine.arguments[2])
let width = 1280
let height = 720
let fps: Int32 = 24
let frameCount = 288
let imageSource = CGImageSourceCreateWithURL(inputURL as CFURL, nil)!
let image = CGImageSourceCreateImageAtIndex(imageSource, 0, nil)!
try? FileManager.default.removeItem(at: outputURL)

let writer = try AVAssetWriter(outputURL: outputURL, fileType: .mp4)
let settings: [String: Any] = [
  AVVideoCodecKey: AVVideoCodecType.h264,
  AVVideoWidthKey: width,
  AVVideoHeightKey: height,
  AVVideoCompressionPropertiesKey: [AVVideoAverageBitRateKey: 5_000_000, AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel]
]
let input = AVAssetWriterInput(mediaType: .video, outputSettings: settings)
input.expectsMediaDataInRealTime = false
let adaptor = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: input, sourcePixelBufferAttributes: [
  kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA,
  kCVPixelBufferWidthKey as String: width,
  kCVPixelBufferHeightKey as String: height,
  kCVPixelBufferCGImageCompatibilityKey as String: true,
  kCVPixelBufferCGBitmapContextCompatibilityKey as String: true
])
writer.add(input)
writer.startWriting()
writer.startSession(atSourceTime: .zero)

func color(_ red: CGFloat, _ green: CGFloat, _ blue: CGFloat, _ alpha: CGFloat) -> CGColor {
  CGColor(red: red, green: green, blue: blue, alpha: alpha)
}

func drawText(_ text: String, context: CGContext, x: CGFloat, y: CGFloat, size: CGFloat, tracking: CGFloat, alpha: CGFloat) {
  let font = CTFontCreateWithName("Georgia-Bold" as CFString, size, nil)
  let paragraph = NSMutableAttributedString(string: text)
  paragraph.addAttributes([
    NSAttributedString.Key(kCTFontAttributeName as String): font,
    NSAttributedString.Key(kCTForegroundColorAttributeName as String): color(1, 0.88, 0.61, alpha),
    NSAttributedString.Key(kCTKernAttributeName as String): tracking
  ], range: NSRange(location: 0, length: paragraph.length))
  let line = CTLineCreateWithAttributedString(paragraph)
  context.textPosition = CGPoint(x: x, y: y)
  CTLineDraw(line, context)
}

func render(_ context: CGContext, time t: CGFloat) {
  context.setFillColor(color(0.035, 0.035, 0.045, 1))
  context.fill(CGRect(x: 0, y: 0, width: width, height: height))

  let zoom = 1.035 + 0.072 * min(1, t / 12)
  let pan = -CGFloat(width) * 0.095 * min(1, max(0, (t - 1.2) / 9.5))
  let drawWidth = CGFloat(width) * zoom
  let drawHeight = CGFloat(height) * zoom
  context.draw(image, in: CGRect(x: (CGFloat(width) - drawWidth) / 2 + pan, y: (CGFloat(height) - drawHeight) / 2, width: drawWidth, height: drawHeight))

  let edgeColors = [color(0.015, 0.02, 0.03, 0.62), color(0.015, 0.02, 0.03, 0.025), color(0.015, 0.02, 0.03, 0.04), color(0.015, 0.02, 0.03, 0.34)] as CFArray
  let edgeLocations: [CGFloat] = [0, 0.27, 0.70, 1]
  let edgeGradient = CGGradient(colorsSpace: CGColorSpaceCreateDeviceRGB(), colors: edgeColors, locations: edgeLocations)!
  context.drawLinearGradient(edgeGradient, start: CGPoint(x: 0, y: CGFloat(height) / 2), end: CGPoint(x: CGFloat(width), y: CGFloat(height) / 2), options: [])
  let bottomColors = [color(0.015, 0.02, 0.03, 0), color(0.015, 0.02, 0.03, 0.42)] as CFArray
  let bottomGradient = CGGradient(colorsSpace: CGColorSpaceCreateDeviceRGB(), colors: bottomColors, locations: [0, 1])!
  context.drawLinearGradient(bottomGradient, start: CGPoint(x: 0, y: 350), end: CGPoint(x: 0, y: 0), options: [])

  // Slow drifting embers and dust, seeded by index for reproducible frames.
  for i in 0..<86 {
    let seed = CGFloat(i)
    let baseX = (seed * 139.7 + 37).truncatingRemainder(dividingBy: CGFloat(width))
    let baseY = (seed * 83.1 + 19).truncatingRemainder(dividingBy: CGFloat(height))
    let x = (baseX + t * (5 + CGFloat(i % 7) * 1.5)).truncatingRemainder(dividingBy: CGFloat(width))
    let y = (baseY + sin(t * 0.7 + seed) * 17 + t * (3 + CGFloat(i % 4))).truncatingRemainder(dividingBy: CGFloat(height))
    let radius = 0.7 + CGFloat(i % 4) * 0.55
    let alpha = 0.12 + CGFloat(i % 5) * 0.045
    context.setFillColor(color(1, 0.69, 0.31, alpha))
    context.fillEllipse(in: CGRect(x: x, y: y, width: radius * 2, height: radius * 2))
  }

  // Arrow streaks converge on Bhishma in a symbolic, non-graphic barrage.
  if t > 5.5 && t < 9.1 {
    for i in 0..<17 {
      let launch = 5.65 + CGFloat(i) * 0.145
      let progress = min(1, max(0, (t - launch) / 0.48))
      if progress > 0 && progress < 1 {
        let startX = CGFloat(width) * (0.30 + CGFloat(i % 5) * 0.024)
        let startY = CGFloat(height) * (0.51 + CGFloat(i % 7) * 0.026)
        let endX = CGFloat(width) * 0.87
        let endY = CGFloat(height) * (0.53 + CGFloat(i % 5) * 0.012)
        let x = startX + (endX - startX) * progress
        let y = startY + (endY - startY) * progress
        let tailX = x - 70
        let tailY = y - (endY - startY) * 0.13
        context.setStrokeColor(color(1, 0.72, 0.28, 0.45))
        context.setLineWidth(8)
        context.setLineCap(.round)
        context.move(to: CGPoint(x: tailX, y: tailY))
        context.addLine(to: CGPoint(x: x, y: y))
        context.strokePath()
        context.setStrokeColor(color(1, 0.9, 0.58, 0.95))
        context.setLineWidth(2.2)
        context.move(to: CGPoint(x: tailX, y: tailY))
        context.addLine(to: CGPoint(x: x, y: y))
        context.strokePath()
      }
    }
  }

  // Brief golden flare at the moment of impact; light only, with no injury shown.
  if t > 7.55 && t < 8.55 {
    let strength = sin((t - 7.55) / 1.0 * .pi) * 0.28
    context.setFillColor(color(1, 0.72, 0.32, strength))
    context.fillEllipse(in: CGRect(x: CGFloat(width) * 0.79, y: CGFloat(height) * 0.39, width: 145, height: 155))
    context.setStrokeColor(color(1, 0.89, 0.61, strength * 1.8))
    context.setLineWidth(3)
    context.strokeEllipse(in: CGRect(x: CGFloat(width) * 0.82, y: CGFloat(height) * 0.42, width: 90, height: 90))
  }

  let titleAlpha = min(1, max(0, (4.7 - t) / 1.2))
  if titleAlpha > 0 {
    context.setFillColor(color(0.025, 0.03, 0.045, 0.46 * titleAlpha))
    context.fill(CGRect(x: 55, y: 515, width: 600, height: 135))
    drawText("DAY 10 · BHISHMA PARVA", context: context, x: 82, y: 604, size: 18, tracking: 3, alpha: titleAlpha)
    drawText("THE BED OF ARROWS", context: context, x: 78, y: 550, size: 39, tracking: 1.2, alpha: titleAlpha)
    drawText("A vow. A choice. A turning point.", context: context, x: 82, y: 523, size: 16, tracking: 0.6, alpha: titleAlpha * 0.94)
  }
}

for frame in 0..<frameCount {
  while !input.isReadyForMoreMediaData { Thread.sleep(forTimeInterval: 0.002) }
  var pixelBuffer: CVPixelBuffer?
  guard CVPixelBufferPoolCreatePixelBuffer(kCFAllocatorDefault, adaptor.pixelBufferPool!, &pixelBuffer) == kCVReturnSuccess,
        let buffer = pixelBuffer else { fatalError("Could not allocate frame buffer") }
  CVPixelBufferLockBaseAddress(buffer, [])
  let context = CGContext(data: CVPixelBufferGetBaseAddress(buffer), width: width, height: height, bitsPerComponent: 8,
                          bytesPerRow: CVPixelBufferGetBytesPerRow(buffer), space: CGColorSpaceCreateDeviceRGB(),
                          bitmapInfo: CGImageAlphaInfo.noneSkipFirst.rawValue | CGBitmapInfo.byteOrder32Little.rawValue)!
  render(context, time: CGFloat(frame) / CGFloat(fps))
  CVPixelBufferUnlockBaseAddress(buffer, [])
  let presentationTime = CMTime(value: Int64(frame), timescale: fps)
  guard adaptor.append(buffer, withPresentationTime: presentationTime) else { fatalError(writer.error?.localizedDescription ?? "Could not append video frame") }
}

input.markAsFinished()
let finished = DispatchSemaphore(value: 0)
writer.finishWriting { finished.signal() }
finished.wait()
guard writer.status == .completed else { fatalError(writer.error?.localizedDescription ?? "Video export failed") }
print("Rendered \(frameCount) frames to \(outputURL.path)")
