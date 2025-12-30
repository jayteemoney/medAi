"""
MedBlocAI Backend API
Flask REST API for AI-powered health analysis
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from ai_model import HealthAnalyzer

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configure CORS
allowed_origins = os.getenv('ALLOWED_ORIGINS', 'http://localhost:5173').split(',')
CORS(app, resources={r"/api/*": {"origins": allowed_origins}})

# Initialize AI analyzer
analyzer = HealthAnalyzer()

# API version and info
API_VERSION = "1.0.0"
API_TITLE = "MedBlocAI Health Analysis API"


@app.route('/', methods=['GET'])
def home():
    """API home endpoint"""
    return jsonify({
        'success': True,
        'message': 'Welcome to MedBlocAI Health Analysis API',
        'version': API_VERSION,
        'endpoints': {
            'health_check': '/api/health',
            'analyze_symptoms': '/api/analyze',
            'get_health_tips': '/api/tips',
            'get_tips_by_category': '/api/tips/<category>'
        },
        'documentation': 'https://github.com/jayteemoney/medblocai'
    })


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'success': True,
        'status': 'healthy',
        'api': API_TITLE,
        'version': API_VERSION
    })


@app.route('/api/analyze', methods=['POST'])
def analyze_symptoms():
    """
    Analyze patient symptoms and provide recommendations

    Request body:
    {
        "symptoms": "I have a headache and fever"
    }

    Response:
    {
        "success": true,
        "detected_symptoms": [...],
        "analysis": {...},
        "disclaimer": "..."
    }
    """
    try:
        # Validate request
        if not request.json:
            return jsonify({
                'success': False,
                'error': 'Invalid request. JSON body required.'
            }), 400

        # Get symptoms from request
        symptoms_text = request.json.get('symptoms', '').strip()

        if not symptoms_text:
            return jsonify({
                'success': False,
                'error': 'No symptoms provided. Please describe your symptoms.'
            }), 400

        # Analyze symptoms using AI model
        analysis_result = analyzer.analyze_symptoms(symptoms_text)

        # Return analysis
        return jsonify(analysis_result), 200

    except Exception as e:
        app.logger.error(f"Error in analyze_symptoms: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'An error occurred while analyzing symptoms.',
            'details': str(e) if app.debug else None
        }), 500


@app.route('/api/tips', methods=['GET'])
@app.route('/api/tips/<category>', methods=['GET'])
def get_health_tips(category='general'):
    """
    Get health tips by category

    Categories:
    - general: General health and wellness
    - respiratory: Respiratory health
    - cardiovascular: Heart health
    - digestive: Digestive health
    - neurological: Brain and nervous system health

    Response:
    {
        "success": true,
        "category": "general",
        "title": "General Health & Wellness",
        "tips": [...]
    }
    """
    try:
        # Get health tips from AI model
        tips_result = analyzer.get_health_tips(category)

        return jsonify(tips_result), 200

    except Exception as e:
        app.logger.error(f"Error in get_health_tips: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'An error occurred while fetching health tips.',
            'details': str(e) if app.debug else None
        }), 500


@app.route('/api/symptoms', methods=['GET'])
def get_supported_symptoms():
    """
    Get list of supported symptoms for analysis

    Response:
    {
        "success": true,
        "symptoms": [...],
        "count": 10
    }
    """
    try:
        symptoms = list(analyzer.symptom_database.keys())

        return jsonify({
            'success': True,
            'symptoms': symptoms,
            'count': len(symptoms),
            'categories': list(set(s['category'] for s in analyzer.symptom_database.values()))
        }), 200

    except Exception as e:
        app.logger.error(f"Error in get_supported_symptoms: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'An error occurred while fetching supported symptoms.'
        }), 500


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({
        'success': False,
        'error': 'Endpoint not found',
        'message': 'The requested API endpoint does not exist.'
    }), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({
        'success': False,
        'error': 'Internal server error',
        'message': 'An unexpected error occurred on the server.'
    }), 500


if __name__ == '__main__':
    # Get configuration from environment
    debug_mode = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    port = int(os.getenv('PORT', 5000))

    # Start Flask app
    app.run(
        host='0.0.0.0',
        port=port,
        debug=debug_mode
    )
