"""
AI Health Analysis Module
Provides symptom analysis and health recommendations for MedBlocAI
"""

from typing import Dict, List, Any
import re


class HealthAnalyzer:
    """Rule-based health analyzer for symptom assessment and recommendations"""

    def __init__(self):
        # Symptom database with severity levels and recommendations
        self.symptom_database = {
            # Respiratory symptoms
            'cough': {
                'category': 'respiratory',
                'severity': 'mild',
                'common_causes': ['Common cold', 'Allergies', 'Bronchitis', 'Post-nasal drip'],
                'recommendations': [
                    'Stay hydrated with warm fluids',
                    'Get adequate rest (7-9 hours)',
                    'Use honey to soothe throat',
                    'Avoid irritants like smoke',
                    'Consult doctor if persists over 2 weeks or worsens'
                ],
                'red_flags': ['Blood in cough', 'High fever', 'Chest pain', 'Difficulty breathing']
            },
            'fever': {
                'category': 'general',
                'severity': 'moderate',
                'common_causes': ['Viral infection', 'Bacterial infection', 'Flu', 'COVID-19'],
                'recommendations': [
                    'Monitor temperature every 4-6 hours',
                    'Stay well hydrated with water and electrolytes',
                    'Rest in a cool environment',
                    'Take fever reducers as directed',
                    'Seek medical care if fever exceeds 39°C (102.2°F) or persists'
                ],
                'red_flags': ['Fever above 40°C', 'Confusion', 'Severe headache', 'Stiff neck', 'Difficulty breathing']
            },
            'headache': {
                'category': 'neurological',
                'severity': 'mild',
                'common_causes': ['Tension', 'Dehydration', 'Migraine', 'Eye strain', 'Stress'],
                'recommendations': [
                    'Rest in a quiet, dark room',
                    'Stay hydrated',
                    'Apply cold or warm compress',
                    'Practice relaxation techniques',
                    'Limit screen time and bright lights'
                ],
                'red_flags': ['Sudden severe headache', 'Visual disturbances', 'Fever with stiff neck', 'Head injury']
            },
            'chest pain': {
                'category': 'cardiovascular',
                'severity': 'high',
                'common_causes': ['Heart attack', 'Angina', 'Anxiety', 'Muscle strain', 'Acid reflux'],
                'recommendations': [
                    '⚠️ SEEK IMMEDIATE MEDICAL ATTENTION',
                    'Call emergency services (911/112)',
                    'Do not drive yourself to hospital',
                    'Sit down and stay calm',
                    'Chew aspirin if available and not allergic'
                ],
                'red_flags': ['Pressure/squeezing sensation', 'Pain radiating to arm/jaw', 'Shortness of breath', 'Nausea/sweating']
            },
            'fatigue': {
                'category': 'general',
                'severity': 'mild',
                'common_causes': ['Lack of sleep', 'Stress', 'Anemia', 'Thyroid issues', 'Depression', 'Poor nutrition'],
                'recommendations': [
                    'Ensure 7-9 hours of quality sleep',
                    'Maintain balanced diet rich in iron and vitamins',
                    'Regular moderate exercise',
                    'Manage stress levels',
                    'Consult doctor if persistent despite lifestyle changes'
                ],
                'red_flags': ['Extreme exhaustion', 'Unexplained weight loss', 'Shortness of breath', 'Persistent despite rest']
            },
            'nausea': {
                'category': 'digestive',
                'severity': 'mild',
                'common_causes': ['Food poisoning', 'Pregnancy', 'Gastritis', 'Anxiety', 'Medications'],
                'recommendations': [
                    'Sip clear fluids slowly (water, ginger tea)',
                    'Eat bland foods (BRAT diet: bananas, rice, applesauce, toast)',
                    'Avoid strong odors and greasy foods',
                    'Rest in upright position',
                    'Seek care if unable to keep fluids down for 24 hours'
                ],
                'red_flags': ['Severe abdominal pain', 'Blood in vomit', 'Signs of dehydration', 'High fever']
            },
            'shortness of breath': {
                'category': 'respiratory',
                'severity': 'high',
                'common_causes': ['Asthma', 'Anxiety', 'Heart failure', 'COVID-19', 'Pneumonia', 'Pulmonary embolism'],
                'recommendations': [
                    'Sit upright and stay calm',
                    'Seek medical attention if severe or sudden',
                    'Use prescribed inhaler if available',
                    'Loosen tight clothing',
                    'Call emergency if lips/skin turn blue'
                ],
                'red_flags': ['Blue lips/fingernails', 'Chest pain', 'Confusion', 'Rapid breathing', 'Sudden onset']
            },
            'dizziness': {
                'category': 'neurological',
                'severity': 'moderate',
                'common_causes': ['Dehydration', 'Low blood pressure', 'Inner ear problems', 'Medications', 'Anemia'],
                'recommendations': [
                    'Sit or lie down immediately',
                    'Stay hydrated with water and electrolytes',
                    'Avoid sudden movements',
                    'Rise slowly from sitting/lying',
                    'Consult doctor if recurring or severe'
                ],
                'red_flags': ['Chest pain', 'Confusion', 'Double vision', 'Slurred speech', 'Severe headache']
            },
            'stomach pain': {
                'category': 'digestive',
                'severity': 'moderate',
                'common_causes': ['Indigestion', 'Gas', 'Gastritis', 'Appendicitis', 'Kidney stones', 'Ulcer'],
                'recommendations': [
                    'Note pain location, intensity, and duration',
                    'Avoid solid foods if pain is severe',
                    'Stay hydrated',
                    'Apply heating pad for mild cramping',
                    'Seek immediate care if severe or worsening'
                ],
                'red_flags': ['Severe sharp pain', 'Blood in stool/vomit', 'Fever', 'Pain in lower right abdomen']
            },
            'sore throat': {
                'category': 'respiratory',
                'severity': 'mild',
                'common_causes': ['Viral infection', 'Strep throat', 'Allergies', 'Dry air', 'Acid reflux'],
                'recommendations': [
                    'Gargle with warm salt water',
                    'Stay hydrated with warm liquids',
                    'Use throat lozenges or honey',
                    'Rest your voice',
                    'Consult doctor if persists over 5 days or severe'
                ],
                'red_flags': ['Difficulty swallowing', 'Difficulty breathing', 'High fever', 'Swollen glands', 'White patches']
            }
        }

        # Severity priority mapping
        self.severity_priority = {
            'high': 3,
            'moderate': 2,
            'mild': 1
        }

    def extract_symptoms(self, text: str) -> List[str]:
        """Extract symptoms from user input text"""
        if not text or not isinstance(text, str):
            return []

        text_lower = text.lower()
        found_symptoms = []

        # Check for each symptom in the database
        for symptom in self.symptom_database.keys():
            # Match whole words to avoid partial matches
            pattern = r'\b' + re.escape(symptom) + r'\b'
            if re.search(pattern, text_lower):
                found_symptoms.append(symptom)

        return found_symptoms

    def analyze_symptoms(self, symptoms_input: str) -> Dict[str, Any]:
        """
        Analyze symptoms and provide health insights

        Args:
            symptoms_input: User's description of symptoms

        Returns:
            Dictionary containing comprehensive analysis results
        """
        if not symptoms_input or not isinstance(symptoms_input, str):
            return {
                'success': False,
                'error': 'Invalid input. Please provide a symptom description.'
            }

        # Extract symptoms from text
        detected_symptoms = self.extract_symptoms(symptoms_input)

        if not detected_symptoms:
            return {
                'success': True,
                'detected_symptoms': [],
                'analysis': {
                    'severity': 'unknown',
                    'urgency': 'low',
                    'message': 'No specific symptoms detected from your description.',
                    'suggestions': [
                        'Try describing your symptoms in more detail',
                        'Mention specific sensations (pain, discomfort, etc.)',
                        'Include symptom duration and intensity',
                        'Common symptoms: cough, fever, headache, fatigue, nausea'
                    ]
                },
                'disclaimer': 'This is an AI-powered analysis and NOT a substitute for professional medical advice.'
            }

        # Analyze detected symptoms
        max_severity = 'mild'
        max_severity_priority = 0
        all_categories = set()
        all_causes = []
        all_recommendations = []
        all_red_flags = []
        symptom_details = []

        for symptom in detected_symptoms:
            info = self.symptom_database[symptom]
            severity_priority = self.severity_priority[info['severity']]

            if severity_priority > max_severity_priority:
                max_severity_priority = severity_priority
                max_severity = info['severity']

            all_categories.add(info['category'])
            all_causes.extend(info['common_causes'])
            all_recommendations.extend(info['recommendations'])
            all_red_flags.extend(info.get('red_flags', []))

            symptom_details.append({
                'symptom': symptom,
                'category': info['category'],
                'severity': info['severity'],
                'common_causes': info['common_causes'][:3]  # Top 3 causes per symptom
            })

        # Remove duplicates while preserving order
        unique_recommendations = list(dict.fromkeys(all_recommendations))
        unique_causes = list(dict.fromkeys(all_causes))
        unique_red_flags = list(dict.fromkeys(all_red_flags))

        # Determine urgency message
        if max_severity == 'high':
            urgency_message = '🚨 HIGH PRIORITY: These symptoms may require immediate medical attention. Please seek emergency care.'
            urgency_level = 'high'
        elif max_severity == 'moderate':
            urgency_message = '⚠️ MODERATE: Monitor symptoms closely and consult a healthcare provider if they worsen or persist.'
            urgency_level = 'moderate'
        else:
            urgency_message = 'ℹ️ MILD: Generally manageable with self-care, but consult a doctor if symptoms persist or worsen.'
            urgency_level = 'low'

        # Generate summary
        symptom_count = len(detected_symptoms)
        symptom_list = ', '.join(detected_symptoms)
        summary = f"Detected {symptom_count} symptom{'s' if symptom_count > 1 else ''}: {symptom_list}"

        return {
            'success': True,
            'detected_symptoms': symptom_details,
            'summary': summary,
            'analysis': {
                'severity': max_severity,
                'urgency': urgency_level,
                'affected_systems': list(all_categories),
                'message': urgency_message,
                'possible_causes': unique_causes[:6],  # Top 6 possible causes
                'recommendations': unique_recommendations[:10],  # Top 10 recommendations
                'red_flags': unique_red_flags[:8] if unique_red_flags else None  # Warning signs
            },
            'disclaimer': '⚕️ IMPORTANT: This is an AI-powered analysis and NOT a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical concerns.'
        }

    def get_health_tips(self, category: str = 'general') -> Dict[str, Any]:
        """Get general health tips by category"""
        tips_database = {
            'general': {
                'title': 'General Health & Wellness',
                'tips': [
                    'Drink 8 glasses (2 liters) of water daily',
                    'Get 7-9 hours of quality sleep each night',
                    'Exercise at least 30 minutes daily, 5 days a week',
                    'Eat a balanced diet with plenty of fruits and vegetables',
                    'Schedule regular health check-ups and screenings',
                    'Manage stress through meditation or relaxation techniques',
                    'Limit alcohol consumption and avoid smoking',
                    'Maintain healthy weight through diet and exercise'
                ]
            },
            'respiratory': {
                'title': 'Respiratory Health',
                'tips': [
                    'Avoid smoking and secondhand smoke exposure',
                    'Practice deep breathing exercises daily',
                    'Maintain good indoor air quality',
                    'Stay up to date with vaccinations (flu, pneumonia)',
                    'Exercise regularly to improve lung capacity',
                    'Use proper ventilation in enclosed spaces',
                    'Wear masks in polluted or dusty environments'
                ]
            },
            'cardiovascular': {
                'title': 'Heart Health',
                'tips': [
                    'Monitor blood pressure regularly',
                    'Limit salt and saturated fat intake',
                    'Manage stress through relaxation techniques',
                    'Stay physically active with aerobic exercise',
                    'Maintain healthy cholesterol levels',
                    'Avoid smoking and limit alcohol',
                    'Get regular heart health screenings'
                ]
            },
            'digestive': {
                'title': 'Digestive Health',
                'tips': [
                    'Eat fiber-rich foods (whole grains, vegetables)',
                    'Practice portion control at meals',
                    'Stay hydrated throughout the day',
                    'Avoid late-night heavy meals',
                    'Include probiotics in your diet',
                    'Chew food thoroughly and eat slowly',
                    'Limit processed and fatty foods'
                ]
            },
            'neurological': {
                'title': 'Brain & Nervous System Health',
                'tips': [
                    'Get quality sleep for brain recovery',
                    'Engage in mental exercises and learning',
                    'Manage stress and practice mindfulness',
                    'Stay socially connected',
                    'Protect your head during activities',
                    'Limit alcohol and avoid drugs',
                    'Eat brain-healthy foods (omega-3, antioxidants)'
                ]
            }
        }

        category = category.lower()
        tips_data = tips_database.get(category, tips_database['general'])

        return {
            'success': True,
            'category': category,
            'title': tips_data['title'],
            'tips': tips_data['tips']
        }
