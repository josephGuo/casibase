package txt

import (
	"bytes"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestDownloadSignedURLToTempFile(t *testing.T) {
	const signedURL = "https://example.com/handbook.md?sig=example/signature&expires=123#section"
	filename, err := downloadToTempFile(signedURL, func(got string) (*bytes.Buffer, error) {
		if got != signedURL {
			t.Fatalf("download URL changed: %q", got)
		}
		return bytes.NewBufferString("Equipment allowance: USD 480"), nil
	})
	if err != nil {
		t.Fatal(err)
	}
	defer os.Remove(filename)
	if strings.ContainsAny(filepath.Base(filename), "?:&#/\\") {
		t.Fatalf("URL characters in temporary filename: %q", filename)
	}
	content, err := os.ReadFile(filename)
	if err != nil || string(content) != "Equipment allowance: USD 480" {
		t.Fatalf("unexpected downloaded content %q: %v", content, err)
	}
	// A closed file can be removed immediately on Windows.
	if err := os.Remove(filename); err != nil {
		t.Fatal(err)
	}
}
