# MedBlocAI Backend API

Flask REST API for AI-powered health symptom analysis.

## Features

- **Symptom Analysis**: AI-powered symptom detection and health recommendations
- **Health Tips**: Category-specific wellness advice
- **RESTful API**: Clean, documented endpoints
- **CORS Enabled**: Works with frontend applications

## Installation

### Prerequisites
- Python 3.9+
- pip

### Setup

1. **Create virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Run the server:**
```bash
python app.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

### `GET /`
API information and available endpoints

### `GET /api/health`
Health check endpoint

### `POST /api/analyze`
Analyze symptoms and get health recommendations

**Request:**
```json
{
  "symptoms": "I have a headache and fever"
}
```

**Response:**
```json
{
  "success": true,
  "detected_symptoms": [
    {
      "symptom": "headache",
      "category": "neurological",
      "severity": "mild",
      "common_causes": ["Tension", "Dehydration", "Migraine"]
    }
  ],
  "analysis": {
    "severity": "moderate",
    "urgency": "moderate",
    "message": "⚠️ MODERATE: Monitor symptoms...",
    "recommendations": [...]
  }
}
```

### `GET /api/tips`
Get general health tips

### `GET /api/tips/<category>`
Get category-specific health tips

**Categories:**
- `general` - General health and wellness
- `respiratory` - Respiratory health
- `cardiovascular` - Heart health
- `digestive` - Digestive health
- `neurological` - Brain and nervous system health

### `GET /api/symptoms`
Get list of supported symptoms

## Supported Symptoms

- Cough
- Fever
- Headache
- Chest pain
- Fatigue
- Nausea
- Shortness of breath
- Dizziness
- Stomach pain
- Sore throat

## Development

### Run in development mode:
```bash
export FLASK_DEBUG=True
python app.py
```

### Run with Gunicorn (production):
```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## Testing

### Test with curl:
```bash
# Health check
curl http://localhost:5000/api/health

# Analyze symptoms
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"symptoms": "I have a headache and fever"}'

# Get health tips
curl http://localhost:5000/api/tips/respiratory
```

## Deployment

### Deploy to Render:

1. Create a new Web Service
2. Connect your repository
3. Set build command: `pip install -r backend/requirements.txt`
4. Set start command: `cd backend && gunicorn app:app`
5. Add environment variables from `.env`

## Important Notice

⚕️ **DISCLAIMER**: This is an AI-powered tool for educational purposes and general health information. It is NOT a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical concerns.

## License

MIT License - See LICENSE file for details
