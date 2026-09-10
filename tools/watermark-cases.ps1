param(
  [Parameter(Mandatory = $true)]
  [string] $SourceRoot,

  [Parameter(Mandatory = $true)]
  [string] $OutputRoot
)

Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = "Stop"
$outputRootPath = Resolve-Path -LiteralPath $OutputRoot -ErrorAction SilentlyContinue
if (-not $outputRootPath) {
  New-Item -ItemType Directory -Force -Path $OutputRoot | Out-Null
  $outputRootPath = Resolve-Path -LiteralPath $OutputRoot
}

function U {
  param([int[]] $Codes)
  return -join ($Codes | ForEach-Object { [char]$_ })
}

$albums = @(
  @{
    Folder = "."
    Slug = "."
    Prefix = "renovation-detail"
    Label = (U 0x88dd, 0x6f62, 0x8207, 0x6ac3, 0x9ad4, 0x7d30, 0x6e05)
    OutputNames = @(
      "panel-wipe-cleaning.jpg",
      "high-cabinet-cleaning.jpg",
      "cabinet-detail-cleaning.jpg",
      "room-after-work-cleaning.jpg",
      "vacuum-dust-cleaning.jpg",
      "site-cleaning-hero.jpg"
    )
  },
  @{ Folder = "20260909"; Slug = "case-20260909"; Prefix = "case-20260909"; Label = (U 0x9000, 0x79df, 0x6e05, 0x904b) },
  @{ Folder = (U 0x4e00, 0x822c, 0x6e05, 0x6f54); Slug = "general-cleaning"; Prefix = "general-cleaning"; Label = (U 0x4e00, 0x822c, 0x6e05, 0x6f54); Recursive = $true },
  @{ Folder = (U 0x9664, 0x9709); Slug = "mold-removal"; Prefix = "mold-removal"; Label = (U 0x7279, 0x6b8a, 0x6e05, 0x6f54, 0x0020, 0x9664, 0x9709) },
  @{ Folder = (U 0x5eda, 0x623f, 0x91cd, 0x6cb9, 0x6c59); Slug = "grease-kitchen"; Prefix = "grease-kitchen"; Label = (U 0x5eda, 0x623f, 0x91cd, 0x6cb9, 0x6c59) },
  @{ Folder = (U 0x6c34, 0x57a2, 0x8655, 0x7406); Slug = "scale-removal"; Prefix = "scale-removal"; Label = (U 0x91cd, 0x6c34, 0x5730, 0x5340, 0x6c34, 0x57a2, 0x8655, 0x7406) },
  @{ Folder = (U 0x6d17, 0x96e8, 0x68da); Slug = "awning-cleaning"; Prefix = "awning-cleaning"; Label = (U 0x6d17, 0x96e8, 0x68da); Recursive = $true },
  @{ Folder = (U 0x7279, 0x6b8a, 0x6e05, 0x6f54, 0x0020, 0x5730, 0x677f, 0x9664, 0x81a0); Slug = "floor-adhesive-removal"; Prefix = "floor-adhesive-removal"; Label = (U 0x7279, 0x6b8a, 0x6e05, 0x6f54, 0x0020, 0x5730, 0x677f, 0x9664, 0x81a0); Recursive = $true },
  @{ Folder = (U 0x505c, 0x8eca, 0x4f4d, 0x8207, 0x5730, 0x677f, 0x6e05, 0x6f54); Slug = "parking-floor-cleaning"; Prefix = "parking-floor-cleaning"; Label = (U 0x505c, 0x8eca, 0x4f4d, 0x8207, 0x5730, 0x677f, 0x6e05, 0x6f54); Recursive = $true },
  @{ Folder = (U 0x5546, 0x696d, 0x5eda, 0x623f); Slug = "commercial-kitchen"; Prefix = "commercial-kitchen"; Label = (U 0x5546, 0x696d, 0x5eda, 0x623f, 0x6e05, 0x6f54); Recursive = $true }
)

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
  Where-Object { $_.MimeType -eq "image/jpeg" } |
  Select-Object -First 1

$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
  [System.Drawing.Imaging.Encoder]::Quality,
  [int64] 84
)

function Resize-Image {
  param(
    [System.Drawing.Image] $Image,
    [int] $MaxSide
  )

  $largest = [Math]::Max($Image.Width, $Image.Height)
  if ($largest -le $MaxSide) {
    return @{ Width = $Image.Width; Height = $Image.Height }
  }

  $scale = $MaxSide / $largest
  return @{
    Width = [Math]::Max(1, [int][Math]::Round($Image.Width * $scale))
    Height = [Math]::Max(1, [int][Math]::Round($Image.Height * $scale))
  }
}

function Add-Watermark {
  param(
    [System.Drawing.Graphics] $Graphics,
    [int] $Width,
    [int] $Height,
    [string] $AlbumLabel
  )

  $fontSize = [Math]::Max(24, [int]($Width / 34))
  $smallFontSize = [Math]::Max(14, [int]($Width / 70))
  $font = New-Object System.Drawing.Font("Microsoft JhengHei", $fontSize, [System.Drawing.FontStyle]::Bold)
  $smallFont = New-Object System.Drawing.Font("Microsoft JhengHei", $smallFontSize, [System.Drawing.FontStyle]::Regular)
  $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(88, 255, 255, 255))
  $shadowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(74, 23, 79, 93))
  $lineBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(78, 167, 220, 200))

  $mainText = U 0x6f54, 0x6de8, 0x574a, 0x0020, 0x6e05, 0x6f54, 0x670d, 0x52d9
  $subText = $AlbumLabel
  $mainSize = $Graphics.MeasureString($mainText, $font)
  $subSize = $Graphics.MeasureString($subText, $smallFont)
  $x = $Width - [Math]::Max($mainSize.Width, $subSize.Width) - 42
  $y = $Height - $mainSize.Height - $subSize.Height - 44

  $Graphics.DrawString($mainText, $font, $shadowBrush, $x + 2, $y + 2)
  $Graphics.DrawString($mainText, $font, $textBrush, $x, $y)
  $Graphics.DrawString($subText, $smallFont, $shadowBrush, $x + 1, $y + $mainSize.Height + 7)
  $Graphics.DrawString($subText, $smallFont, $lineBrush, $x, $y + $mainSize.Height + 6)

  $font.Dispose()
  $smallFont.Dispose()
  $textBrush.Dispose()
  $shadowBrush.Dispose()
  $lineBrush.Dispose()
}

foreach ($album in $albums) {
  $sourcePath = Join-Path $SourceRoot $album.Folder
  if (-not (Test-Path -LiteralPath $sourcePath)) {
    Write-Warning "Skip missing folder: $sourcePath"
    continue
  }

  $targetPath = if ($album.Slug -eq ".") { $OutputRoot } else { Join-Path $OutputRoot $album.Slug }
  New-Item -ItemType Directory -Force -Path $targetPath | Out-Null

  $index = 1
  $files = Get-ChildItem -LiteralPath $sourcePath -File -Recurse:([bool]$album.Recursive) |
    Where-Object { $_.Extension -match '^\.(jpg|jpeg|png)$' } |
    Sort-Object FullName

  if ($album.OutputNames) {
    $files = $files | Select-Object -First $album.OutputNames.Count
  }

  $files | ForEach-Object {
      $sourceFile = $_.FullName
      $image = [System.Drawing.Image]::FromFile($sourceFile)
      try {
        $size = Resize-Image -Image $image -MaxSide 1800
        $bitmap = New-Object System.Drawing.Bitmap($size.Width, $size.Height)
        try {
          $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
          try {
            $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
            $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
            $graphics.DrawImage($image, 0, 0, $size.Width, $size.Height)
            Add-Watermark -Graphics $graphics -Width $size.Width -Height $size.Height -AlbumLabel $album.Label
          }
          finally {
            $graphics.Dispose()
          }

          if ($album.OutputNames) {
            $outputFile = Join-Path $targetPath $album.OutputNames[$index - 1]
          }
          else {
            $outputFile = Join-Path $targetPath ("{0}-{1:D2}.jpg" -f $album.Prefix, $index)
          }
          $bitmap.Save($outputFile, $jpegCodec, $encoderParams)
          Write-Output $outputFile
        }
        finally {
          $bitmap.Dispose()
        }
      }
      finally {
        $image.Dispose()
      }
      $index += 1
    }
}
