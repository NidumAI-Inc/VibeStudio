# Variables
APP_NAME = VibeStudio
DIST_DIR = dist
APP_BUNDLE = $(DIST_DIR)/mac-arm64/VibeStudio.app
PACKAGE_VERSION = $(shell jq -r .version package.json)
DMG_FILE = $(DIST_DIR)/$(APP_NAME)-$(PACKAGE_VERSION)-arm64.dmg
CERTIFICATE_PATH = ./certificate.p12
APP_ZIP = $(DIST_DIR)/$(APP_NAME)-$(PACKAGE_VERSION)-mac.zip

# Load environment variables from .env
include .env
export $(shell sed 's/=.*//' .env)

.PHONY: install build-mac build-windows start clean sign notarize staple verify publish

install:
	npm install

build-mac:
	npm run clean
	make install
	npm run build
	@echo "✅ Building complete!"

sign:
	@echo "📜 Extracting certificate and private key..."
	openssl pkcs12 -in "$(CERTIFICATE_PATH)" -clcerts -nokeys -out extracted-cert.pem -password pass:"$(APPLE_CERTIFICATE_PASSWORD)" -legacy
	openssl pkcs12 -in "$(CERTIFICATE_PATH)" -nocerts -nodes -out extracted-key.pem -password pass:"$(APPLE_CERTIFICATE_PASSWORD)" -legacy

	@echo "🔏 Signing all files in public/bin..."
	find public/bin -type f -exec codesign --deep --force --verbose --options runtime --sign "Developer ID Application: Pritam Cristpin (JCN5972XNZ)" {} \;

	@echo "🔏 Signing app bundle..."
	codesign --deep --force --verbose --options runtime --sign "Developer ID Application: Pritam Cristpin (JCN5972XNZ)" "$(APP_BUNDLE)"

	@echo "✅ Signing complete!"

	@echo "🧼 Cleaning up extracted certificate files..."
	rm -f extracted-cert.pem extracted-key.pem || echo "⚠️ Warning: Cleanup failed!"
zip-app:
	@echo "📦 Zipping app for auto-update..."
	ditto -c -k --sequesterRsrc --keepParent "$(APP_BUNDLE)" "$(APP_ZIP)"
	@echo "✅ Zipping complete: $(APP_ZIP)"

notarize:
	@echo "📜 Notarizing DMG..."
	xcrun notarytool submit "$(DMG_FILE)" --wait --apple-id "$(APPLE_ID)" --password "$(APPLE_APP_SPECIFIC_PASSWORD)" --team-id "$(APPLE_TEAM_ID)"
	@echo "📜 Notarizing ZIP..."
	xcrun notarytool submit "$(APP_ZIP)" --wait --apple-id "$(APPLE_ID)" --password "$(APPLE_APP_SPECIFIC_PASSWORD)" --team-id "$(APPLE_TEAM_ID)"
	@echo "✅ Notarization complete!"


staple:
	@echo "📌 Stapling DMG..."
	xcrun stapler staple "$(DMG_FILE)"
	@echo "📌 Stapling App (from ZIP)..."
	xcrun stapler staple "$(APP_BUNDLE)"
	@echo "✅ Stapling complete!"


verify:
	@echo "🔍 Verifying app..."
	spctl --assess --type execute --verbose "$(APP_BUNDLE)"
	codesign --verify --deep --strict --verbose=2 "$(APP_BUNDLE)"
	@echo "✅ Verification complete!"

start:
	npm start

clean:
	npm run clean

publish: clean build-mac sign zip-app notarize staple verify
	@echo "🚀 Published! DMG File: $(DMG_FILE)"
	@echo "📦 Update ZIP: $(APP_ZIP)"

