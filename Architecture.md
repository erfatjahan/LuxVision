# LuxVision — System & Model Architecture
LuxVision is an AI-powered low-light image enhancement platform combining a **React + Vite** frontend,a **FastAPI** backend service,**PostgreSQL** persistence,**Cloudinary** media storage,**SSLCommerz** payment callbacks,and a **PyTorch** low-light enhancement inference engine(`backend/weights/hybrid_final.pth`).
## High-Level System Architecture

```text
User Studio ─────────┐
                     │  HTTPS (JSON / Multipart)
Admin Dashboard ─────┴──► FastAPI Backend ───── PostgreSQL (Users & History)
                              ├──────────────── PyTorch AI (hybrid_final.pth)
                              ├──────────────── Cloudinary (Image Storage)
                              └──────────────── SSLCommerz (Checkout & Callbacks)

```

-   **Frontend (`frontend/`):** React + Vite interface handling the before/after enhancement studio,gallery/history,billing flows, and admin dashboard.
    
-   **Backend API (`backend/`):** FastAPI service managing JWT auth,role-based access(`user`,`admin`,`superadmin`),credit deduction (`1` credit/image), and payment callbacks.
    
-   **Storage & Payments:** PostgreSQL stores users,credits,and history records;Cloudinary hosts original/enhanced images and avatars; SSLCommerz handles checkout and credit top-up callbacks.
    

## Deep Learning Model Architecture (`KinD_Restormer_Hybrid`)
```
Input Image (RGB PIL)
         │
         ▼
 Normalize [0, 1] & Tensor (1, 3, H, W)
         │
         ▼
   ┌───────────┐
   │  DecomNet │  ──► Reflectance r (3 ch) & Illumination i (1 ch)
   └─────┬─────┘
         │
   ┌─────┴──────────────────────┐
   ▼                            ▼
[Reflectance r]           [Illumination i]
   │                            │
   ▼                            │
RestormerBlock (dim=3)          │
(1x1 qkv + 3x3 dwconv +         │
 transposed attention +         │
 residual skip)                 │
   │                            │
   ▼                            │
[r_enhanced] ───────────┬───────┘
                        ▼
             r_enhanced * i & clamp [0, 1]
                        │
                        ▼
            uint8 Image & PIL ImageEnhance
      (Brightness 0.95, Contrast 1.05,
       Sharpness 1.1, Color 1.03) + gc.collect()

```

-   **`DecomNet(channel=64)`:** Uses `3x3` convolutions (`padding=1`),`LeakyReLU(0.2)`,and`Sigmoid` to split the RGB input into 3-channel reflectance (`r`) and 1-channel illumination (`i`).
    
-   **`RestormerBlock(dim=3, num_heads=1)`:** Applies `1x1` `qkv` and `3x3` depthwise convolutions (`qkv_dwconv`),L2-normalizes `q` and `k` to compute transposed channel attention(`(q @ k.transpose(-2, -1)) * temperature`),projects via `1x1` `project_out`,and adds a residual skip connection (`res + out`).
    
-   **Fusion & Inference (`enhance_image`):** Multiplies restored reflectance with illumination (`r_enhanced * i`),clamps to `[0, 1]` under `torch.no_grad()`,and applies PIL `ImageEnhance` refinements(`Brightness 0.95`,`Contrast 1.05`, `Sharpness 1.1`, `Color 1.03`)followed by `gc.collect()`.
    
-   **Evaluation Context:** Trained and evaluated on the **LOL dataset** (`our485` / `eval15`) using PyTorch image quality metrics (`torchmetrics`, `pytorch-msssim`, `piq`, `pyiqa`). 
