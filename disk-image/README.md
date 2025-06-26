# 📦 Alpine Disk Image with Python Apps (QEMU)

This component provides a ready-to-use Alpine Linux disk image preconfigured to run two Python applications in the background at startup. It also includes system monitoring with **Glances**.

---

## 🔗 Prebuilt Disk Image

You can download the prebuilt QEMU disk image from the link below:

```
https://nativenode.s3.ap-southeast-1.amazonaws.com/disk-100g-VIBE.img
```

Users of the desktop app must **replace the disk image link** in the app with the actual URL provided above.

---

## 🛠️ Manual Disk Image Creation (Optional)

For advanced users who want to create and configure the disk image themselves:

### Required Tools

* `qemu-img`
* `tar`
* `sudo`
* `mount`

### Steps

1. **Download Alpine Linux minirootfs**

   ```bash
   wget https://dl-cdn.alpinelinux.org/alpine/v3.19/releases/x86_64/alpine-minirootfs-3.19.0-x86_64.tar.gz
   ```

2. **Create a 2GB QCOW2 image**

   ```bash
   qemu-img create -f qcow2 alpine-python.img 2G
   ```

3. **Format the disk image**

   ```bash
   mkfs.ext4 alpine-python.img
   ```

4. **Mount and extract root filesystem**

   ```bash
   mkdir /mnt/alpine
   sudo mount -o loop alpine-python.img /mnt/alpine
   sudo tar -xzf alpine-minirootfs-3.19.0-x86_64.tar.gz -C /mnt/alpine
   ```

5. **Copy Python apps and configure**

   ```bash
   sudo mkdir -p /mnt/alpine/opt/app
   sudo cp file_system_api.py /mnt/alpine/opt/app/
   sudo cp vibe_backend.py /mnt/alpine/opt/app/
   ```

6. **Install Python and Glances in the image (chroot needed)**

   ```bash
   sudo chroot /mnt/alpine
   apk add python3 py3-pip
   pip install glances
   exit
   ```

7. **Create startup script (inside image)**

   ```bash
   echo -e "#!/bin/sh\npython3 /opt/app/file_system_api.py &\npython3 /opt/app/vibe_backend.py &\nglances" | sudo tee /mnt/alpine/etc/local.d/startup_script.start
   sudo chmod +x /mnt/alpine/etc/local.d/startup_script.start
   sudo rc-update add local default
   ```

8. **Unmount image**

   ```bash
   sudo umount /mnt/alpine
   ```
---

## ✨ Claude Code (Mandatory Tooling)

Use [Claude Code](https://www.anthropic.com/index/claude-code) to help you develop, debug, and manage the codebase in your terminal.

```bash
npm install -g @anthropic-ai/claude-code
claude
```

Claude Code is a mandatory developer assistant for this project. It works directly from your terminal and understands your entire repo context, helping with:

* Editing files and fixing bugs
* Answering questions about your code
* Executing and fixing tests
* Managing git history and merge conflicts
* Browsing and searching documentation

Ensure Claude Code is installed and configured before contributing.

---
For support and questions:
- **Email**: info@aivf.io
- **Issues**: Create an issue in this repository