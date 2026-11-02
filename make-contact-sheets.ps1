param(
  [Parameter(Mandatory = $true)][string]$SourceDirectory,
  [Parameter(Mandatory = $true)][string]$OutputDirectory,
  [string]$Title = 'Tula · supplied render options',
  [string]$OutputName = 'tula-supplied-37.png',
  [string]$Filter = '*.png',
  [switch]$NumericSort
)

Add-Type -AssemblyName System.Drawing

if (-not (Test-Path -LiteralPath $OutputDirectory)) {
  New-Item -ItemType Directory -Path $OutputDirectory | Out-Null
}

function New-ContactSheet {
  param(
    [Parameter(Mandatory = $true)][string]$Title,
    [Parameter(Mandatory = $true)][object[]]$Files,
    [Parameter(Mandatory = $true)][string]$OutputPath,
    [int]$Columns = 4,
    [int]$ThumbWidth = 320,
    [int]$ThumbHeight = 220
  )

  $cellWidth = $ThumbWidth + 20
  $cellHeight = $ThumbHeight + 52
  $rows = [Math]::Ceiling($Files.Count / $Columns)
  $sheetWidth = $Columns * $cellWidth + 20
  $sheetHeight = $rows * $cellHeight + 88
  $bitmap = New-Object System.Drawing.Bitmap($sheetWidth, $sheetHeight)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.Clear([System.Drawing.Color]::FromArgb(243, 241, 235))
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $titleFont = New-Object System.Drawing.Font('Arial', 22, [System.Drawing.FontStyle]::Bold)
  $labelFont = New-Object System.Drawing.Font('Arial', 12, [System.Drawing.FontStyle]::Regular)
  $ink = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(24, 24, 22))
  $muted = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(100, 98, 90))

  $graphics.DrawString($Title, $titleFont, $ink, 18, 16)
  $graphics.DrawString("$($Files.Count) images · labels match original filenames", $labelFont, $muted, 20, 52)

  for ($i = 0; $i -lt $Files.Count; $i++) {
    $file = $Files[$i]
    $x = 20 + ($i % $Columns) * $cellWidth
    $y = 84 + [Math]::Floor($i / $Columns) * $cellHeight
    $image = $null
    try {
      $image = [System.Drawing.Image]::FromFile($file.FullName)
      $scale = [Math]::Min($ThumbWidth / $image.Width, $ThumbHeight / $image.Height)
      $drawWidth = [int]($image.Width * $scale)
      $drawHeight = [int]($image.Height * $scale)
      $drawX = $x + [int](($ThumbWidth - $drawWidth) / 2)
      $drawY = $y + [int](($ThumbHeight - $drawHeight) / 2)
      $graphics.FillRectangle([System.Drawing.Brushes]::White, $x, $y, $ThumbWidth, $ThumbHeight)
      $graphics.DrawImage($image, $drawX, $drawY, $drawWidth, $drawHeight)
      $graphics.DrawString($file.BaseName, $labelFont, $ink, $x, $y + $ThumbHeight + 7)
    } finally {
      if ($null -ne $image) { $image.Dispose() }
    }
  }

  $bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $muted.Dispose()
  $ink.Dispose()
  $labelFont.Dispose()
  $titleFont.Dispose()
  $graphics.Dispose()
  $bitmap.Dispose()
}

$files = @(Get-ChildItem -LiteralPath $SourceDirectory -File -Filter $Filter)
if ($NumericSort) {
  $files = @($files | Sort-Object {
    if ($_.BaseName -match '^(\d+)') { [int]$Matches[1] } else { [int]::MaxValue }
  }, Name)
}
New-ContactSheet -Title $Title -Files $files -OutputPath (Join-Path $OutputDirectory $OutputName) -Columns 5 -ThumbWidth 300 -ThumbHeight 190
