param([Parameter(Mandatory=$true)][string]$SourceDirectory,[Parameter(Mandatory=$true)][string]$OutputPath,[Parameter(Mandatory=$true)][string]$Title)
Add-Type -AssemblyName System.Drawing
$files=@(Get-ChildItem -LiteralPath $SourceDirectory -File -Filter '*.png' | Sort-Object Name)
$columns=4;$thumbWidth=360;$thumbHeight=180;$cellWidth=[int]($thumbWidth+24);$cellHeight=[int]($thumbHeight+44);$rows=[int][Math]::Ceiling($files.Count/$columns)
$sheet=New-Object Drawing.Bitmap([int]($columns*$cellWidth+24),[int]($rows*$cellHeight+88))
$g=[Drawing.Graphics]::FromImage($sheet);$g.Clear([Drawing.Color]::FromArgb(243,241,235));$g.InterpolationMode=[Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$titleFont=New-Object Drawing.Font('Arial',22,[Drawing.FontStyle]::Bold);$labelFont=New-Object Drawing.Font('Arial',11);$ink=New-Object Drawing.SolidBrush([Drawing.Color]::FromArgb(24,24,22));$muted=New-Object Drawing.SolidBrush([Drawing.Color]::FromArgb(100,98,90))
$g.DrawString($Title,$titleFont,$ink,18,16);$g.DrawString("$($files.Count) interior images",$labelFont,$muted,20,52)
for($i=0;$i -lt $files.Count;$i++){ $x=20+($i%$columns)*$cellWidth;$y=84+[Math]::Floor($i/$columns)*$cellHeight;$im=$null;$thumb=$null;try{$im=[Drawing.Image]::FromFile($files[$i].FullName);$thumb=$im.GetThumbnailImage($thumbWidth,$thumbHeight,$null,[IntPtr]::Zero);$g.FillRectangle([Drawing.Brushes]::White,$x,$y,$thumbWidth,$thumbHeight);$g.DrawImage($thumb,$x,$y,$thumbWidth,$thumbHeight);$g.DrawString($files[$i].BaseName,$labelFont,$ink,$x,$y+$thumbHeight+7)}finally{if($thumb){$thumb.Dispose()};if($im){$im.Dispose()}}}
$sheet.Save($OutputPath,[Drawing.Imaging.ImageFormat]::Png);$g.Dispose();$ink.Dispose();$muted.Dispose();$labelFont.Dispose();$titleFont.Dispose();$sheet.Dispose()
