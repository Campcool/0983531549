Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = 'Stop'
$root = Resolve-Path (Join-Path $PSScriptRoot '..')
$out = Join-Path $root 'public/og-cleaning-area-services-20260910.jpg'
$photo = Join-Path $root 'public/cases/site-cleaning-hero.jpg'
$logo = Join-Path $root 'public/brand/logo-horizontal-transparent.png'

$fontCollection = New-Object System.Drawing.Text.PrivateFontCollection
$fontCollection.AddFontFile("$env:WINDIR\Fonts\NotoSansTC-VF.ttf")
$fontFamily = $fontCollection.Families[0]

function New-Font($size, $style = [System.Drawing.FontStyle]::Regular) {
  return [System.Drawing.Font]::new($fontFamily, $size, $style, [System.Drawing.GraphicsUnit]::Pixel)
}

function New-Brush($hex, $alpha = 255) {
  $color = [System.Drawing.ColorTranslator]::FromHtml($hex)
  return [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb($alpha, $color))
}

function U($hex) {
  return (($hex -split ' ') | ForEach-Object { [char][Convert]::ToInt32($_, 16) }) -join ''
}

function New-RoundRect($x, $y, $w, $h, $r) {
  $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
  $d = $r * 2
  $path.AddArc($x, $y, $d, $d, 180, 90)
  $path.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
  $path.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
  $path.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
  $path.CloseFigure()
  return $path
}

function Draw-CoverImage($graphics, $image, $x, $y, $w, $h) {
  $scale = [Math]::Max($w / $image.Width, $h / $image.Height)
  $sw = [int]($w / $scale)
  $sh = [int]($h / $scale)
  $sx = [int](($image.Width - $sw) / 2)
  $sy = [int](($image.Height - $sh) / 2)
  $src = [System.Drawing.Rectangle]::new($sx, $sy, $sw, $sh)
  $dst = [System.Drawing.Rectangle]::new($x, $y, $w, $h)
  $graphics.DrawImage($image, $dst, $src, [System.Drawing.GraphicsUnit]::Pixel)
}

function Fill-RoundRect($graphics, $x, $y, $w, $h, $r, $brush) {
  $path = New-RoundRect $x $y $w $h $r
  $graphics.FillPath($brush, $path)
  $path.Dispose()
}

function Stroke-RoundRect($graphics, $x, $y, $w, $h, $r, $pen) {
  $path = New-RoundRect $x $y $w $h $r
  $graphics.DrawPath($pen, $path)
  $path.Dispose()
}

$bitmap = [System.Drawing.Bitmap]::new(1200, 1200)
$g = [System.Drawing.Graphics]::FromImage($bitmap)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

$bg1 = New-Brush '#e9f8f5'
$g.Clear($bg1.Color)

$photoImage = [System.Drawing.Image]::FromFile($photo)
Draw-CoverImage $g $photoImage 445 0 755 1200

$tealOverlay = New-Brush '#174f5d' 128
$g.FillRectangle($tealOverlay, 445, 0, 755, 1200)

$leftPanel = New-Brush '#ffffff' 242
Fill-RoundRect $g 58 64 704 1072 48 $leftPanel
$panelStroke = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(150, 167, 220, 200), 3)
Stroke-RoundRect $g 58 64 704 1072 48 $panelStroke

$logoImage = [System.Drawing.Image]::FromFile($logo)
$g.DrawImage($logoImage, [System.Drawing.Rectangle]::new(104, 96, 270, 134))

$primary = New-Brush '#174f5d'
$secondary = New-Brush '#2f8f8f'
$muted = New-Brush '#54707a'
$white = New-Brush '#ffffff'
$lineGreen = New-Brush '#017a35'
$blue = New-Brush '#2f77a1'
$orange = New-Brush '#c57b2c'
$purple = New-Brush '#6f5cc5'

$fontBrand = New-Font 82 ([System.Drawing.FontStyle]::Bold)
$fontSub = New-Font 44 ([System.Drawing.FontStyle]::Bold)
$fontArea = New-Font 50 ([System.Drawing.FontStyle]::Bold)
$fontBody = New-Font 35 ([System.Drawing.FontStyle]::Bold)
$fontChip = New-Font 31 ([System.Drawing.FontStyle]::Bold)
$fontSmall = New-Font 26 ([System.Drawing.FontStyle]::Bold)

$g.DrawString((U '6F54 6DE8 574A'), $fontBrand, $primary, 104, 268)
$g.DrawString((U '6E05 6F54 5DE5 4F5C 5BA4'), $fontSub, $primary, 108, 364)
$g.DrawString((U '4E7E 6DE8 FF0C 8B93 751F 6D3B 66F4 7F8E 597D FF01'), $fontBody, $secondary, 108, 438)

Fill-RoundRect $g 104 520 574 118 32 (New-Brush '#dff3ef')
$g.DrawString((U '57FA 9686 FF5C 53F0 5317 FF5C 65B0 5317 FF5C 6843 5712'), $fontArea, $primary, 124, 553)

$g.DrawString((U '670D 52D9 5167 5BB9'), $fontSmall, $muted, 108, 684)

$chips = @(
  @{ Text = (U '5C45 5BB6 6E05 6F54'); X = 108; Y = 738; W = 250; C = $secondary; Bg = '#e6f7f2' },
  @{ Text = (U '88DD 6F62 7D30 6E05'); X = 382; Y = 738; W = 250; C = $blue; Bg = '#e8f5fb' },
  @{ Text = (U '9000 79DF 5165 4F4F'); X = 108; Y = 816; W = 250; C = $orange; Bg = '#fff3e5' },
  @{ Text = (U '91CD 6CB9 6C59'); X = 382; Y = 816; W = 250; C = $purple; Bg = '#f0edff' },
  @{ Text = (U '7279 6B8A 6E05 6F54'); X = 108; Y = 894; W = 250; C = $primary; Bg = '#edf8e8' }
)

foreach ($chip in $chips) {
  Fill-RoundRect $g $chip.X $chip.Y $chip.W 58 29 (New-Brush $chip.Bg)
  $g.DrawString($chip.Text, $fontChip, $chip.C, ($chip.X + 27), ($chip.Y + 9))
}

Fill-RoundRect $g 104 1000 574 82 28 $lineGreen
$g.DrawString((U '004C 0049 004E 0045 0020 50B3 7167 7247 5148 78BA 8A8D'), $fontBody, $white, 155, 1017)

$photoCard = New-Brush '#ffffff' 245
Fill-RoundRect $g 790 704 338 276 30 $photoCard
$casePhoto = [System.Drawing.Image]::FromFile((Join-Path $root 'public/cases/commercial-kitchen/commercial-kitchen-01.jpg'))
Draw-CoverImage $g $casePhoto 810 724 298 190
$g.DrawString((U '5BE6 62CD 6848 5834'), $fontSmall, $primary, 845, 930)

$watermarkFont = New-Font 24 ([System.Drawing.FontStyle]::Bold)
$g.DrawString('JIE JING FANG CLEANING SERVICE', $watermarkFont, (New-Brush '#ffffff' 185), 776, 1058)

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$encoderParams = [System.Drawing.Imaging.EncoderParameters]::new(1)
$encoderParams.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new([System.Drawing.Imaging.Encoder]::Quality, [int64]90)
$bitmap.Save($out, $jpegCodec, $encoderParams)

$casePhoto.Dispose()
$logoImage.Dispose()
$photoImage.Dispose()
$g.Dispose()
$bitmap.Dispose()
$fontCollection.Dispose()

Write-Output $out

