# LuxVision
LuxVision is an AI-powered low-light image enhancement SaaS platform.It pairs a React web experience with a FastAPI service that runs a PyTorch KinD-Restormer hybrid model to brighten and restore uploaded images.
## Project Overview
-  **Frontend:** A React 19 single-page application built with Vite .It includes public product pages and authenticated dashboard,studio,gallery,profile,billing,and admin screens.
-  **Admin Dashboard:** An authenticated control center for listing users,adding credits,changing roles, and deleting accounts. Access is also checked by the backend API.
-  **FastAPI/PyTorch Backend:** A FastAPI application exposes authentication,image,   profile,payment,and admin routes .It loads the model checkpoint during application startup,uses PostgreSQL for account/history metadata,and stores uploaded image assets in Cloudinary.The backend creates SQLAlchemy tables from its models when imported; there is no migration framework in the current repository.
## Live Links
-  **Frontend:** [https://frontend-one-pearl-28.vercel.app](https://frontend-one-pearl-28.vercel.app)

## Key Features
-  **Hybrid KinD + Restormer enhancement:** The model decomposes an image into reflectance and illumination components,applies a Restormer-style
attention block to the reflectance, and recombines the result.
-  **Interactive Before/After Studio:** Upload and preview a JPG,PNG,or WEBP image,run enhancement,then drag the comparison split to inspect the result.The Studio currently limits uploads to 5 MB.
-  **JWT authentication and RBAC:** Login returns a bearer token.Protected API routes validate it,and admin routes enforce role checks.Passwords are
hashed with bcrypt.
-  **Credit and payment system:** Image enhancement costs one credit.Signup
initializes an account with 15 credits.The payment integration uses SSLCommerz;its current backend logic assigns 50 credits to the `pro` plan
and 10 to other plan values.
-  **Admin Control Center:** View users,add credits,update roles,and delete other users through the protected admin API.
-  **Image history and profile assets:** Save original/enhanced Cloudinary URLs and history records in PostgreSQL;manage history favorites and profile avatars.
## How It Works

1. A visitor creates an account or signs in from the React app.The API returns a JWT access token,which the app keeps in browser local storage.
2. The signed-in user uploads an image in Studio.The browser sends the file as multipart form data with the bearer token.
3. FastAPI verifies the user and available credits.It converts the image to RGB and resizes it for inference so its longest side is at most 512 pixels.
4. The loaded PyTorch model runs on CUDA when available,otherwise on CPU.The enhanced result is saved as PNG.
5. The backend uploads the original and enhanced images to Cloudinary,stores their URLs in PostgreSQL history,deducts one credit,and returns both URLs and the remaining balance.
6. Studio displays the original and enhanced images in a draggable before/after comparison.History and profile screens use the protected API to retrieve or manage the user's saved data.
7. For credit purchases,the frontend requests a payment session from SSLCommerz.The gateway calls the backend payment callback after the transaction.

  ```

User Studio ─────────┐
                     ├── FastAPI (REST API) ─── PostgreSQL (Users & History)
Admin Dashboard ─────┘       ├───────────────── PyTorch AI (hybrid_final.pth)
                             ├───────────────── Cloudinary (Image Storage)
                             └───────────────── SSLCommerz (Payments & Callbacks)
```
## Tech Stack
| Area | Technologies used |
| --- | --- |
| Frontend | React,Vite 8,React Router,Tailwind CSS,Lucide,React Toastify |
| Backend | Python,FastAPI,Uvicorn,SQLAlchemy |
| AI / Deep Learning | PyTorch, NumPy,Pillow;custom KinD + Restormer-style hybrid and `backend/weights/hybrid_final.pth` |
| Database | PostgreSQL,SQLAlchemy ORM,`psycopg2-binary` |
| Auth | JWT via PyJWT,bcrypt password hashing, bearer-token dependencies,user/admin roles |
| Media Storage | Cloudinary |
| Payments / Email | SSLCommerz,FastAPI-Mail / SMTP |
| Hosting | Vercel frontend;Render backend |
  
## Project Structure

This tree lists source and project files;local virtual environments and installed dependency directories are omitted.
```
LuxVision/
├── backend/                    # FastAPI & PyTorch AI Inference Engine
│   ├── routers/                # API endpoints (auth,image,payment,profile,admin)
│   ├── services/               # Cloudinary,SSLCommerz & SMTP email integrations
│   ├── utils/                  # JWT & security helpers
│   ├── weights/                # Pretrained KinD+Restormer weights(hybrid_final.pth)
│   ├── database.py             # PostgreSQL connection & session setup
│   ├── main.py                 # FastAPI app entry point & CORS config
│   ├── model.py                # Deep learning model architecture & inference
│   ├── models.py               # SQLAlchemy database models
│   └── requirements.txt        # Python dependencies
├── frontend/                   # React+Vite Web Application(User Studio & Admin)
│   ├── public/                 # Static assets & favicon(luxvision.svg)
│   ├── src/
│   │   ├── assets/            
│   │   ├── components/         # Reusable UI components(navbar,footer)
│   │   ├── context/            # Global auth & app state
│   │   ├── pages/              # Studio,Dashboard,Gallery,Billing,Auth & Admin views
│   │   ├── services/           # Axios API client(api.js)
│   │   ├── App.jsx             # Main routing & layout
│   │   └── main.jsx            # React entry point
│   ├── index.html              # HTML template
│   ├── package.json            # Frontend dependencies
│   └── vercel.json             # Vercel SPA routing config
├── th_final_hybrid.py          # Model training/evaluation script
├── ARCHITECTURE.md             # Deep-dive system & ML pipeline documentation
└── README.md                   # Project overview & setup guide
```

## Getting Started
### Prerequisites

- Python with a PyTorch-compatible build,Node.js and npm.
- PostgreSQL and a database that the backend can access.
- The included checkpoint at `backend/weights/hybrid_final.pth`.
- Cloudinary credentials for image/avatar uploads.
- SMTP settings for the backend's email service; SSLCommerz credentials to
exercise payment initialization.
The backend expects these variables in `backend/.env`.`DATABASE_URL` is required,and `MAIL_PORT` must be an integer.Email configuration is loaded
when the auth router is imported,so provide the `MAIL_*` values for the API
to start.

```dotenv

DATABASE_URL=postgresql://postgres:your_password@localhost:5432/luxvision

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

MAIL_USERNAME=your_smtp_username
MAIL_PASSWORD=your_smtp_password
MAIL_FROM=you@example.com
MAIL_PORT=465
MAIL_SERVER=smtp.example.com

STORE_ID=your_store_id
STORE_PASSWORD=your_store_password
STORE_IS_SANDBOX=True

```
| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL SQLAlchemy connection string.A `postgresql://` URL is adapted to the `psycopg2` driver. |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Cloudinary account credentials used for image/avatar uploads. |
| `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_FROM`, `MAIL_PORT`, `MAIL_SERVER` | SMTP connection and sender configuration. Current code uses SSL/TLS. |
| `STORE_ID`, `STORE_PASSWORD` | SSLCommerz credentials. |
| `STORE_IS_SANDBOX` | Set to exactly `True` to enable SSLCommerz sandbox mode. |
| `PORT` | Optional port read by `python main.py`; defaults to `10000`. |
| `VITE_API_URL` | Optional API base URL used by frontend pages; most default to `http://localhost:8000`. Set it in `frontend/.env` for a deployment. |

The JWT signing key is currently hard-coded in `backend/utils/security.py`;it is not an environment variable in this workspace.

### Backend setup (PowerShell)

Create a PostgreSQL database named `luxvision` and set `DATABASE_URL` to match your local database.Create `backend/.env` with the values above, then run:
```
powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000

```
Run the API from the `backend` directory because the model checkpoint is loaded using the relative path `weights/hybrid_final.pth`. At startup,the app creates missing database tables and loads the model. Open

[http://localhost:8000/docs](http://localhost:8000/docs)

### Frontend setup (PowerShell)
In another terminal:
```
powershell
cd frontend
npm ci
npm run dev
```
Open the Vite URL (normally `http://localhost:5173`).Most pages use

`VITE_API_URL` or `http://localhost:8000`;the admin dashboard has a fallback to the deployed Render API URL.For local setup,create `frontend/.env`:
```dotenv
VITE_API_URL=http://localhost:8000
```
The backend routes include the `/api` prefix. The page-level login and Studio requests use those paths,but the shared helpers in `frontend/src/services/api.js`
currently omit `/api` from their login and enhancement paths.
### Production builds (PowerShell)
Build and preview the frontend production bundle:
```powershell
cd frontend
npm ci
npm run build
npm run preview -- --host 0.0.0.0
```
Run the backend in production from its directory with its environment variables and database configured:
```powershell
cd backend
.\.venv\Scripts\Activate.ps1
$env:PORT = "10000"
python main.py
````
python main.py` binds the API to `0.0.0.0` and uses `PORT`(or `10000` when

unset). Choose the PyTorch build appropriate for the deployment CPU/GPU.
## API Endpoints Overview
Protected routes require `Authorization: Bearer <access_token>`.Login returns the bearer token.Image and avatar uploads use multipart form data with a
`file` field;other request bodies listed below are JSON unless noted.

 | Method | Route | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/` | Public | Basic backend status response. |
| `GET` | `/api/health` | Public | Health status. |
| `POST` | `/api/auth/signup` | Public | Create an account. Body fields: `name`, `email`, `password`. |
| `POST` | `/api/auth/login` | Public | Log in with `email` and `password`; returns a JWT, account role, and credits. |
| `POST` | `/api/image/enhance` | Bearer token | Enhance uploaded `file`; deducts one credit and returns original/enhanced URLs and remaining credits. |
| `GET` | `/api/image/history` | Bearer token | List the signed-in user's image history. |
| `DELETE` | `/api/image/history/{item_id}` | Bearer token | Delete a history item owned by the signed-in user. |
| `PATCH` | `/api/image/history/{item_id}/favorite` | Bearer token | Toggle the history item's favorite state. |
| `GET` | `/api/profile/me` | Bearer token | Retrieve the current user's profile. |
| `PUT` | `/api/profile/me` | Bearer token | Update `name` and/or `email`. |
| `POST` | `/api/profile/avatar` | Bearer token | Upload avatar `file` to Cloudinary. |
| `DELETE` | `/api/profile/avatar` | Bearer token | Remove the current user's avatar URL. |
| `POST` | `/api/payment/init` | Bearer token | Start a payment. Body: `plan`, `amount`, `phone`, `email`; optional `city` defaults to `Ctg`. |
| `POST` | `/api/payment/success` | Payment gateway callback | Apply the callback credits to the identified user and redirect to the local payment-success page. |
| `POST` | `/api/payment/fail` | Payment gateway callback | Redirect to the local billing failure page. |
| `POST` | `/api/payment/cancel` | Payment gateway callback | Redirect to the local billing cancellation page. |
| `GET` | `/api/admin/users` | Admin bearer token | List user IDs, emails, roles, and credits. |
| `POST` | `/api/admin/add-credit/{user_id}?amount={amount}` | Admin bearer token | Add the `amount` query parameter in credits to a user. |
| `PUT` | `/api/admin/user/{user_id}/role` | Admin bearer token | Update role. Body: `{"role":"user"}`, `{"role":"admin"}`, or `{"role":"superadmin"}`. |
| `DELETE` | `/api/admin/user/{user_id}` | Admin bearer token | Delete a user; an admin cannot delete their own account. |
