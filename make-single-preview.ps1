param([Parameter(Mandatory=$true)][string]$Source,[Parameter(Mandatory=$true)][string]$Output)
Add-Type -AssemblyName System.Drawing
$image=[Drawing.Image]::FromFile($Source)
$thumb=$image.GetThumbnailImage(1600,900,$null,[IntPtr]::Zero)
$thumb.Save($Output,[Drawing.Imaging.ImageFormat]::Jpeg)
$thumb.Dispose();$image.Dispose()
