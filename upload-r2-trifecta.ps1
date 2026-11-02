param(
  [Parameter(Mandatory = $true)][string]$SourceRoot,
  [Parameter(Mandatory = $true)][string]$Endpoint,
  [Parameter(Mandatory = $true)][string]$Bucket,
  [Parameter(Mandatory = $true)][string]$AwsCredentialsPath
)

function Get-CredentialValue([string]$Name) {
  $line = Get-Content -LiteralPath $AwsCredentialsPath | Where-Object { $_ -match "^\s*$Name\s*=" } | Select-Object -First 1
  if (-not $line) { throw "Missing $Name in AWS credentials file." }
  return ($line -split '=', 2)[1].Trim()
}

function Get-HexHash([byte[]]$Bytes) {
  $hash = [Security.Cryptography.SHA256]::Create().ComputeHash($Bytes)
  return ([BitConverter]::ToString($hash) -replace '-', '').ToLowerInvariant()
}

function Get-Hmac([byte[]]$Key, [string]$Text) {
  $hmac = New-Object Security.Cryptography.HMACSHA256
  $hmac.Key = $Key
  return $hmac.ComputeHash([Text.Encoding]::UTF8.GetBytes($Text))
}

function Encode-Path([string]$Value) {
  return (($Value -split '/') | ForEach-Object { [Uri]::EscapeDataString($_) }) -join '/'
}

$accessKey = Get-CredentialValue 'aws_access_key_id'
$secretKey = Get-CredentialValue 'aws_secret_access_key'
$endpoint = $Endpoint.TrimEnd('/')
$r2Host = ([Uri]$endpoint).Host
$region = 'auto'
$service = 's3'
$date = [DateTime]::UtcNow
$amzDate = $date.ToString('yyyyMMddTHHmmssZ')
$shortDate = $date.ToString('yyyyMMdd')
$client = New-Object Net.Http.HttpClient

$groups = @(
  @{ Folder = 'tula-current'; Directory = 'tula-current' },
  @{ Folder = 'serene-current'; Directory = 'serene-current' }
)

foreach ($group in $groups) {
  $directory = Join-Path $SourceRoot $group.Directory
  Get-ChildItem -LiteralPath $directory -File -Filter '*.avif' | Sort-Object Name | ForEach-Object {
    $bytes = [IO.File]::ReadAllBytes($_.FullName)
    $payloadHash = Get-HexHash $bytes
    $key = "portfolio/trifecta/$($group.Folder)/$($_.Name)"
    $canonicalUri = '/' + (Encode-Path "$Bucket/$key")
    $canonicalHeaders = "content-type:image/avif`nhost:$r2Host`nx-amz-content-sha256:$payloadHash`nx-amz-date:$amzDate`n"
    $signedHeaders = 'content-type;host;x-amz-content-sha256;x-amz-date'
    $canonicalRequest = "PUT`n$canonicalUri`n`n$canonicalHeaders`n$signedHeaders`n$payloadHash"
    $credentialScope = "$shortDate/$region/$service/aws4_request"
    $canonicalRequestHash = Get-HexHash ([Text.Encoding]::UTF8.GetBytes($canonicalRequest))
    $stringToSign = "AWS4-HMAC-SHA256`n$amzDate`n$credentialScope`n$canonicalRequestHash"
    $kDate = Get-Hmac ([Text.Encoding]::UTF8.GetBytes("AWS4$secretKey")) $shortDate
    $kRegion = Get-Hmac $kDate $region
    $kService = Get-Hmac $kRegion $service
    $kSigning = Get-Hmac $kService 'aws4_request'
    $signature = ([BitConverter]::ToString((Get-Hmac $kSigning $stringToSign)) -replace '-', '').ToLowerInvariant()
    $authorization = "AWS4-HMAC-SHA256 Credential=$accessKey/$credentialScope, SignedHeaders=$signedHeaders, Signature=$signature"
    $uri = "$endpoint/$Bucket/$(Encode-Path $key)"
    $request = New-Object Net.Http.HttpRequestMessage([Net.Http.HttpMethod]::Put, $uri)
    $request.Content = New-Object Net.Http.ByteArrayContent(,$bytes)
    $request.Content.Headers.ContentType = [Net.Http.Headers.MediaTypeHeaderValue]::Parse('image/avif')
    $request.Headers.TryAddWithoutValidation('Authorization', $authorization) | Out-Null
    $request.Headers.TryAddWithoutValidation('x-amz-content-sha256', $payloadHash) | Out-Null
    $request.Headers.TryAddWithoutValidation('x-amz-date', $amzDate) | Out-Null
    $response = $client.SendAsync($request).GetAwaiter().GetResult()
    if (-not $response.IsSuccessStatusCode) {
      $detail = $response.Content.ReadAsStringAsync().GetAwaiter().GetResult()
      throw "R2 upload failed for $key ($($response.StatusCode)): $detail"
    }
    Write-Output "UPLOADED $key"
  }
}
