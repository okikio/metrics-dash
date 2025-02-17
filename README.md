# Movie-Web Backend Metrics Dashboard

A lightweight, user-friendly dashboard to visualize metrics from your movie-web backend instance without needing Prometheus/Grafana. Simply enter your metrics endpoint and get actionable insights!

**Backend Documentation**: 
For information about setting up a backend check the [docs here.](https://docs.undi.rest/backend/introduction)

---

## ✨ Features
- **Simple Metrics URL Input** - No complex setup, just paste your backend's `/metrics` endpoint (e.g., `https://your-server/metrics`)
- **Auto-Refresh**
- **Key Overview Metrics**  
  - Total Accounts
  - Total Watch Requests
- **Provider Analytics**  
  - Success/Failure Rates
- **Content Popularity Insights**  
  - Most Watched Movies/TV Shows
- **Traffic Analysis**  
  - Backend Usage by Domain
  - Request Volume & Traffic Share
- **System Performance**  
  - HTTP Request Counts by Route
  - Average Response Times
- **More!**

---

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/Pasithea0/mw-metrics-dash.git
   ```
2. **Install dependencies**
   ```bash
   pnpm install
   ```
3. **Run the dashboard**
   ```bash
   pnpm run dev
   ```
4. **Enter your metrics URL** in the input field and click **Fetch Metrics**

---

## 📊 Example Metrics Preview

### Provider Performance (Sample Data)
| Provider       | Success Rate | Total Requests |
|----------------|--------------|----------------|
| flix-hq       | 82.3%        | 140.8K         |
| kissasian      | 96.9%        | 35.7K          |
| autoembed      | 8.4%         | 19.6K          |

### Most Watched Content
| Title                          | Type     | Total Watches | Success Rate |
|--------------------------------|----------|---------------|--------------|
| INVINCIBLE                     | TV Show  | 17.1K         | 84.7%        |
| Severance                      | TV Show  | 12.2K         | 80.1%        |
| Captain America: Brave New World | Movie    | 2.4K          | 69.5%        |


---

## 🤝 Contributing
PRs welcome! Please use good contributing standards, I'm too lazy to make actual guidelines. 

