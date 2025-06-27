# NERFUBI — Nerfstudio Setup for Drone-Based 3D Mapping

This installation guide is part of the **NERFUBI** project (_Neural Radiance Fields for UAV-Based Infrastructure Mapping at UBI_), conducted at the University of Beira Interior in 2025. The project aims to apply Neural Radiance Fields (NeRFs) to reconstruct and analyze outdoor infrastructures using drone-captured imagery.

## 💻 Tested Hardware

This configuration has been tested and validated on the student's **personal laptop**, with the following specifications:

| **Component**      | **Specification**                               |
|--------------------|-------------------------------------------------|
| Laptop Model       | MSI Cyborg 15 A13V                              |
| Processor          | Intel Core i7-13620H (10 cores)                 |
| RAM                | 32 GB DDR5                                      |
| Graphics Card      | NVIDIA GeForce RTX 4060 Laptop GPU (8 GB)       |
| Storage            | 1 TB NVMe SSD                                   |
| Operating System   | Windows 11                                      |

This setup ensures compatibility with the following key NeRF models:
- ✅ Nerfacto  
- ✅ Instant-NGP  
- ✅ NeRF-SH (Spherical Harmonics)

It is based on the integration of **Nerfstudio**, **Tiny-CUDA-NN**, and custom modules from the [NeRFtoGSandBack](https://github.com/grasp-lyrl/NeRFtoGSandBack) repository.

---

## ✅ Requirements

- Python 3.10  
- Conda installed  
- A CUDA-enabled GPU (CUDA 11.8 compatible, if different change your version accordingly)

---

## 🔧 Installation Steps

```bash
# 1. Create and activate Conda environment
conda create -n nerfstudio_exp python=3.10 -y
conda activate nerfstudio_exp

# 2. Upgrade pip
python -m pip install --upgrade pip

# 3. Uninstall conflicting packages
pip uninstall torch torchvision functorch tinycudann

# 4. Install PyTorch with CUDA 11.8
pip install torch==2.1.2+cu118 torchvision==0.16.2+cu118 --extra-index-url https://download.pytorch.org/whl/cu118

# 5. Install CUDA Toolkit (if not already installed)
conda install -c "nvidia/label/cuda-11.8.0" cuda-toolkit

# 6. Install tiny-cuda-nn (this may take a while, in case of error check this issue: https://github.com/nerfstudio-project/nerfstudio/issues/3600)
pip install git+https://github.com/NVlabs/tiny-cuda-nn/#subdirectory=bindings/torch

# 7. Clone and install Nerfstudio
git clone https://github.com/nerfstudio-project/nerfstudio.git
cd nerfstudio
pip install --upgrade pip setuptools
pip install -e .

# 8. Replace version for GSplat and NeRF-SH support
pip uninstall gsplat nerfstudio -y
pip install gsplat==0.1.3
pip install git+https://github.com/nerfstudio-project/nerfstudio.git@v1.0.1

# 9. Clone and install NeRFtoGSandBack modules
git clone https://github.com/grasp-lyrl/NeRFtoGSandBack.git
cd NeRFtoGSandBack
pip install -e nerfsh
pip install -e nerfgs

# 10. Fix NumPy version
pip uninstall numpy -y
pip install numpy==1.26.4
