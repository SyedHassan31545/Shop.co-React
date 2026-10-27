# Shop.co — Frontend (React + Vite)

Ye sirf frontend ha. Data (products, login, cart, orders) backend se aata ha: **Shop.co-Backend** folder.

## Chalane ka tareeqa
```bash
npm install
copy .env.example .env     # Mac/Linux: cp .env.example .env
npm run dev                # http://localhost:5173
```
`.env` ma `VITE_API_URL` backend ka address ha (local: `http://localhost:5000`).
**Pehle backend chalayein**, warna products load nahi honge.

## Vercel par deploy
1. Is folder ko GitHub repo ma push karein, Vercel ma Add New Project → repo import.
2. Environment Variable: `VITE_API_URL` = backend ka Vercel URL (bina `/` ke end ma).
3. Deploy. (`vercel.json` react-router ke page refresh ke liye pehle se set ha.)

## Pages
Home, Shop, Product Detail, Cart (+ checkout address), Login/Register, My Orders, Admin Panel (`/admin`, sirf admin).
