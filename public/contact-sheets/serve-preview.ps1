$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add('http://127.0.0.1:8767/')
$listener.Start()
$root = 'C:\Users\COMP\Downloads\Sthyra\Sthyra\public'
while ($listener.IsListening) {
  try {
    $context = $listener.GetContext()
    $relative = $context.Request.Url.AbsolutePath.TrimStart('/') -replace '/', '\\'
    if ([string]::IsNullOrWhiteSpace($relative)) { $relative = 'index.html' }
    $file = Join-Path $root $relative
    if (Test-Path -LiteralPath $file -PathType Leaf) {
      $bytes = [IO.File]::ReadAllBytes($file)
      $context.Response.ContentType = switch ([IO.Path]::GetExtension($file).ToLower()) {
        '.html' { 'text/html' }
        '.avif' { 'image/avif' }
        '.png' { 'image/png' }
        default { 'application/octet-stream' }
      }
      $context.Response.ContentLength64 = $bytes.Length
      $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else { $context.Response.StatusCode = 404 }
    $context.Response.Close()
  } catch {}
}
